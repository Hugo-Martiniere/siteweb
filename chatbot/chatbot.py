import os
from flask import Flask, request, jsonify
from whoosh.index import create_in, open_dir
from whoosh.fields import Schema, TEXT
from whoosh.qparser import QueryParser
from bs4 import BeautifulSoup
import requests
from pdfminer.high_level import extract_text

# URL de ton site
SITE_URL = "https://hugo-martiniere.github.io/siteweb/"

# Liens vers les fichiers PDF
PDF_LINKS = [
    "https://hugo-martiniere.github.io/siteweb/img/cv/Hugo_Martiniere_CV.pdf",
    "https://hugo-martiniere.github.io/siteweb/img/cv/Hugo_Martiniere_resume_2.pdf"
]

# Répertoire de l'index
INDEX_DIR = "indexdir"

# Schéma de l'index
schema = Schema(content=TEXT(stored=True))

# Flask app
app = Flask(__name__)


# Fonction pour scraper le site et extraire la section de la formation
def scrape_site():
    response = requests.get(SITE_URL)
    soup = BeautifulSoup(response.text, 'html.parser')

    # Trouver la section contenant la formation
    formation_section = soup.find('div', class_='timeline-item left wow slideInLeft formation')

    # Si la section de la formation est trouvée, on retourne son texte
    if formation_section:
        formation_text = formation_section.get_text(separator=' ', strip=True)
        return formation_text
    else:
        return "Formation non trouvée."


# Fonction pour extraire le texte d'un PDF
def extract_pdf_text(pdf_url):
    # Télécharge le PDF depuis l'URL
    response = requests.get(pdf_url)
    pdf_path = "temp.pdf"

    with open(pdf_path, "wb") as f:
        f.write(response.content)

    # Extraire le texte du fichier PDF
    text = extract_text(pdf_path)

    # Supprimer le fichier temporaire
    os.remove(pdf_path)

    return text


# Fonction pour créer l'index
def create_index():
    if not os.path.exists(INDEX_DIR):
        os.mkdir(INDEX_DIR)

    # Créer l'index
    ix = create_in(INDEX_DIR, schema)
    writer = ix.writer()

    # Scraper le site et récupérer la formation
    formation_text = scrape_site()

    # Ajouter la formation à l'index
    writer.add_document(content=formation_text)

    # Extraire et ajouter le contenu des PDFs à l'index
    for pdf_url in PDF_LINKS:
        pdf_text = extract_pdf_text(pdf_url)
        writer.add_document(content=pdf_text)

    writer.commit()


# Fonction pour rechercher dans l'index
def search_query(query):
    ix = open_dir(INDEX_DIR)
    with ix.searcher() as searcher:
        parser = QueryParser("content", ix.schema)
        parsed_query = parser.parse(query)
        results = searcher.search(parsed_query, limit=5)

        # Retourner les résultats
        return [r["content"][:500] for r in results]


# Fonction pour lancer Flask et répondre aux requêtes
@app.route('/ask', methods=['GET'])
def ask():
    query = request.args.get('query')

    if not query:
        return jsonify({"response": "Aucune question fournie."}), 400

    # Créer l'index si nécessaire
    create_index()

    # Effectuer la recherche
    answers = search_query(query)

    if answers:
        return jsonify({"response": answers[0]})  # Renvoie la première réponse
    else:
        return jsonify({"response": "Je n'ai pas trouvé de réponse."})


# Lancer l'application Flask
if __name__ == "__main__":
    app.run(debug=True)
