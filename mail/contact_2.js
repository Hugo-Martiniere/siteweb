// Initialisation du SDK EmailJS avec ton User ID
emailjs.init("UhfdDDWASXlsKeKCh");

// Lier l'événement de soumission du formulaire
document.getElementById("contactForm").addEventListener("submit", function(event) {
    // Empêcher la soumission du formulaire pour éviter le rechargement de la page
    event.preventDefault();

    // Récupérer les valeurs des champs du formulaire
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var subject = document.getElementById("subject").value;
    var message = document.getElementById("message").value;

    // Envoyer l'email avec EmailJS
    emailjs.send("service_nd8hsf8", "template_6zlrylg", {
        name: name,
        email: email,
        subject: subject,
        message: message
    }).then(function(response) {
        console.log("Email envoyé avec succès!", response);
        // Afficher un message de succès
        document.getElementById('success').innerHTML = "<div class='alert alert-success'>Message envoyé avec succès !</div>";
        // Réinitialiser le formulaire
        document.getElementById("contactForm").reset();
    }, function(error) {
        console.log("Échec de l'envoi", error);
        // Afficher un message d'erreur
        document.getElementById('success').innerHTML = "<div class='alert alert-danger'>Désolé, une erreur est survenue. Veuillez réessayer plus tard.</div>";
    });
});
