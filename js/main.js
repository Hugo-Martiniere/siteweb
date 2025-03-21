(function ($) {
    "use strict";
    
    // loader
    var loader = function () {
        setTimeout(function () {
            if ($('#loader').length > 0) {
                $('#loader').removeClass('show');
            }
        }, 1);
    };
    loader();
    
    
    // Initiate the wowjs
    new WOW().init();
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });
    
    
    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 0) {
            $('.navbar').addClass('nav-sticky');
        } else {
            $('.navbar').removeClass('nav-sticky');
        }
    });
    
    
    // Smooth scrolling on the navbar links
    $(".navbar-nav a").on('click', function (event) {
        if (this.hash !== "") {
            event.preventDefault();
            
            $('html, body').animate({
                scrollTop: $(this.hash).offset().top - 45
            }, 1500, 'easeInOutExpo');
            
            if ($(this).parents('.navbar-nav').length) {
                $('.navbar-nav .active').removeClass('active');
                $(this).closest('a').addClass('active');
            }
        }
    });
    
    
    // Typed Initiate
    if ($('.hero .hero-text h2').length == 1) {
        var typed_strings = $('.hero .hero-text .typed-text').text();
        var typed = new Typed('.hero .hero-text h2', {
            strings: typed_strings.split(', '),
            typeSpeed: 100,
            backSpeed: 20,
            smartBackspace: false,
            loop: true
        });
    }
    
    
    // Skills
    $('.skills').waypoint(function () {
        $('.progress .progress-bar').each(function () {
            $(this).css("width", $(this).attr("aria-valuenow") + '%');
        });
    }, {offset: '80%'});


    // Testimonials carousel
    $(".testimonials-carousel").owlCarousel({
        center: true,
        autoplay: true,
        dots: true,
        loop: true,
        responsive: {
            0:{
                items:1
            }
        }
    });
    
    
    
    // Portfolio filter
    var portfolioIsotope = $('.portfolio-container').isotope({
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
    });

    $('#portfolio-filter li').on('click', function () {
        $("#portfolio-filter li").removeClass('filter-active');
        $(this).addClass('filter-active');
        portfolioIsotope.isotope({filter: $(this).data('filter')});
    });
    
})(jQuery);

// Fonction pour vérifier et mettre à jour le lien du CV en fonction de la langue
function updateCVLink() {
    const lang = localStorage.getItem('selectedLanguage') || 'fr';  // Utilise la langue sauvegardée ou 'fr' par défaut

    // Trouve le lien pour le CV
    const cvLink = document.getElementById('cv-link');

    // Vérifie si la langue est le français ou non
    if (lang.startsWith('fr')) {
        // Si la langue est en français, utiliser le lien du CV français
        cvLink.href = 'img/cv/Hugo_Martiniere_CV.pdf';
    } else {
        // Si la langue est en anglais, utiliser le lien du CV anglais
        cvLink.href = 'img/cv/Hugo_Martiniere_resume_2.pdf';
    }
}

function changeLanguage(lang) {
    localStorage.setItem('selectedLanguage', lang); // Sauvegarde la langue
    document.documentElement.lang = lang;

    // Mise à jour de l'icône et du texte du menu déroulant
    const flagSrc = lang === 'fr' ? "img/langue/france.png" : "img/langue/anglais.png";
    const languageText = lang === 'fr' ? "Langue" : "Language";
    document.getElementById("languageIcon").src = flagSrc;
    document.getElementById("languageDropdownText").textContent = languageText;

    // Charger les traductions depuis le fichier JSON
	fetch("js/translations.json")
		.then(response => response.json())
		.then(data => {
			const translations = data[lang];

			// Appliquer les traductions aux éléments HTML
			document.querySelectorAll("[data-i18n]").forEach(element => {
				const key = element.getAttribute("data-i18n");
				if (translations[key]) {
					// Vérifie si le texte contient "\n" pour gérer les retours à la ligne
					if (translations[key].includes("\n")) {
						element.innerHTML = translations[key].replace(/\n/g, "<br>");
					} else {
						element.textContent = translations[key];
					}
				}
			});

			// Met à jour le lien du CV après le changement de langue
			updateCVLink();
		})
		.catch(error => console.error("Erreur de chargement des traductions :", error));

}

// Appliquer la langue sauvegardée ou par défaut au chargement
document.addEventListener("DOMContentLoaded", function () {
    // Si aucune langue n'est stockée, on utilise le français par défaut
    const savedLang = localStorage.getItem('selectedLanguage') || 'fr';
    changeLanguage(savedLang);  // Change la langue
    updateCVLink();  // Met à jour le lien du CV en fonction de la langue
});


/*Chat-bot*/
// Toggle l'ouverture et la fermeture de la fenêtre de chat
// Fonction pour basculer l'affichage de la fenêtre de chat
function toggleChatWindow() {
    const chatWindow = document.getElementById('chat-window');
    chatWindow.style.display = chatWindow.style.display === 'flex' ? 'none' : 'flex';
}

// Fonction pour extraire le contenu de la page
function extractSiteContent() {
    // Sélectionnez les éléments dont vous voulez extraire le texte
    const elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6'); // Exemple : paragraphes et titres
    let content = '';

    // Concaténez le texte de chaque élément
    elements.forEach(element => {
        content += element.innerText + '\n'; // Ajoutez un saut de ligne entre les éléments
    });

    return content;
}

// Fonction pour encoder le texte en utilisant l'API Hugging Face
async function encodeText(text) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/sentence-transformers/all-mpnet-base-v2", // Modèle d'embedding
        {
            method: "POST",
            headers: {
                "Authorization": "Bearer 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", // Votre token ici
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                inputs: text
            })
        }
    );

    const data = await response.json();
    return data[0]; // Retourne l'embedding du texte
}

// Fonction pour calculer la similarité cosinus entre deux embeddings
function cosineSimilarity(embeddingA, embeddingB) {
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < embeddingA.length; i++) {
        dotProduct += embeddingA[i] * embeddingB[i];
        magnitudeA += embeddingA[i] * embeddingA[i];
        magnitudeB += embeddingB[i] * embeddingB[i];
    }

    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    return dotProduct / (magnitudeA * magnitudeB);
}

// Fonction pour trouver la réponse la plus pertinente dans le contenu du site
async function findAnswerInContent(question, siteContent) {
    // Encoder la question
    const questionEmbedding = await encodeText(question);

    // Diviser le contenu du site en phrases
    const sentences = siteContent.split(/[.!?]/).filter(s => s.trim() !== '');

    let bestMatch = { sentence: '', similarity: -1 };

    // Comparer chaque phrase du site avec la question
    for (const sentence of sentences) {
        const sentenceEmbedding = await encodeText(sentence);
        const similarity = cosineSimilarity(questionEmbedding, sentenceEmbedding);

        if (similarity > bestMatch.similarity) {
            bestMatch = { sentence, similarity };
        }
    }

    // Retourner la phrase la plus pertinente si la similarité est suffisante
    if (bestMatch.similarity > 0.5) { // Ajustez ce seuil selon vos besoins
        return bestMatch.sentence;
    } else {
        return null; // Aucune réponse trouvée
    }
}

// Fonction pour envoyer un message et obtenir la réponse du chatbot
async function sendMessage() {
    const questionInput = document.getElementById('question');
    const chatbox = document.getElementById('chatbox');
    const question = questionInput.value.trim();

    if (!question) return; // Ne pas envoyer de message vide

    // Ajouter le message de l'utilisateur dans la fenêtre de chat
    const userMessage = document.createElement('p');
    userMessage.className = 'user-message';
    userMessage.innerText = question;
    chatbox.appendChild(userMessage);

    // Effacer le champ de saisie et faire défiler vers le bas
    questionInput.value = '';
    chatbox.scrollTop = chatbox.scrollHeight;

    // Afficher un indicateur de "bot en train d'écrire..."
    const typingIndicator = document.createElement('p');
    typingIndicator.className = 'bot-message typing';
    typingIndicator.innerText = 'Le bot écrit...';
    chatbox.appendChild(typingIndicator);

    try {
        // Extraire le contenu de votre site
        const siteContent = extractSiteContent();

        // Trouver la réponse dans le contenu du site
        const answer = await findAnswerInContent(question, siteContent);

        // Supprimer l'indicateur "bot en train d'écrire..."
        typingIndicator.remove();

        // Ajouter la réponse du chatbot
        const botMessage = document.createElement('p');
        botMessage.className = 'bot-message fade-in';
        botMessage.innerText = answer || "Désolé, je n'ai pas trouvé de réponse à votre question sur le site.";
        chatbox.appendChild(botMessage);

    } catch (error) {
        console.error('Erreur lors de la communication avec Hugging Face:', error);

        // Supprimer l'indicateur "bot en train d'écrire..."
        typingIndicator.remove();

        // Message d'erreur en cas de problème
        const errorMessage = document.createElement('p');
        errorMessage.className = 'bot-message error-message';
        errorMessage.innerText = "Oups ! Une erreur s'est produite. Réessayez plus tard.";
        chatbox.appendChild(errorMessage);
    }

    // Faire défiler vers le bas pour afficher le dernier message
    chatbox.scrollTop = chatbox.scrollHeight;
}

// Écouter l'événement "Entrée" dans le champ de saisie
document.getElementById('question').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// Écouter le clic sur le bouton d'envoi
document.getElementById('send-btn').addEventListener('click', sendMessage);