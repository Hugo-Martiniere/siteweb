// Initialisation du SDK EmailJS avec ton User ID
emailjs.init("UhfdDDWASXlsKeKCh");

// Détection de la langue (ici, on va utiliser la langue sélectionnée par l'utilisateur)
var language = localStorage.getItem('selectedLanguage') || 'fr';  // 'fr' par défaut si aucune langue n'est sélectionnée

// Messages d'erreur en fonction de la langue
var errorMessages = {
    fr: {
        name: "Veuillez entrer votre nom.",
        email: "Veuillez entrer votre adresse e-mail.",
        subject: "Veuillez entrer un objet pour votre message.",
        message: "Veuillez entrer un message."
    },
    en: {
        name: "Please enter your name.",
        email: "Please enter your email address.",
        subject: "Please enter a subject for your message.",
        message: "Please enter a message."
    }
};

// Appliquer la langue sauvegardée ou par défaut au chargement
document.addEventListener("DOMContentLoaded", function () {
    // Vérifie si la langue est déjà définie dans le localStorage
    changeLanguage(language);  // Change la langue au chargement de la page
});

// Fonction pour changer la langue de la page
function changeLanguage(lang) {
    // Modifie les éléments de la page en fonction de la langue
    // Exemple de modification de texte, adapte-le selon tes besoins
    if (lang === 'fr') {
        document.getElementById('lang-select').innerHTML = "Sélectionner la langue";
    } else if (lang === 'en') {
        document.getElementById('lang-select').innerHTML = "Select Language";
    }
    // Sauvegarde la langue dans localStorage
    localStorage.setItem('selectedLanguage', lang);
}

// Lier l'événement de soumission du formulaire
document.getElementById("contactForm").addEventListener("submit", function(event) {
    // Empêcher la soumission du formulaire pour éviter le rechargement de la page
    event.preventDefault();

    // Récupérer les valeurs des champs du formulaire
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var subject = document.getElementById("subject").value;
    var message = document.getElementById("message").value;

    // Initialiser une variable pour stocker les messages d'erreur
    var errorMessage = "";

    // Vérifier si tous les champs sont remplis
    if (name === "") {
        errorMessage += "<div class='alert alert-danger'>" + errorMessages[language].name + "</div>";
    }
    if (email === "") {
        errorMessage += "<div class='alert alert-danger'>" + errorMessages[language].email + "</div>";
    }
    if (subject === "") {
        errorMessage += "<div class='alert alert-danger'>" + errorMessages[language].subject + "</div>";
    }
    if (message === "") {
        errorMessage += "<div class='alert alert-danger'>" + errorMessages[language].message + "</div>";
    }

    // Afficher les erreurs si les champs sont vides
    if (errorMessage !== "") {
        document.getElementById('success').innerHTML = errorMessage;
        return; // Ne pas envoyer l'email si un champ est vide
    }

    // Si tous les champs sont remplis, envoyer l'email avec EmailJS
    emailjs.send("service_nd8hsf8", "template_6zlrylg", {
        name: name,
        email: email,
        subject: subject,
        message: message
    }).then(function(response) {
        // Afficher un message de succès
        document.getElementById('success').innerHTML = "<div class='alert alert-success'>" + (language === 'fr' ? "Message envoyé avec succès !" : "Message sent successfully!") + "</div>";
        // Réinitialiser le formulaire
        document.getElementById("contactForm").reset();
    }, function(error) {
        // Afficher un message d'erreur
        document.getElementById('success').innerHTML = "<div class='alert alert-danger'>" + (language === 'fr' ? "Désolé, une erreur est survenue. Veuillez réessayer plus tard." : "Sorry, an error occurred. Please try again later.") + "</div>";
    });
});
