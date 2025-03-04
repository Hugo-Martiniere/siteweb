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
        cvLink.href = 'img/cv/Hugo_Martiniere_resume.pdf';
    }
}

function changeLanguage(lang) {
    localStorage.setItem('selectedLanguage', lang); // Sauvegarde la langue
    document.documentElement.lang = lang;

    // Mise à jour de l'icône et du texte du menu déroulant
    const flagSrc = lang === 'fr' ? "img/langue/fr_flag.png" : "img/langue/uk_flag.png";
    const languageText = lang === 'fr' ? "Langue" : "Language";
    document.getElementById("languageIcon").src = flagSrc;
    document.getElementById("languageDropdownText").textContent = languageText;

    // Charger les traductions depuis le fichier JSON
    fetch("/js/translations.json")
        .then(response => response.json())
        .then(data => {
            const translations = data[lang];

            // Appliquer les traductions aux éléments HTML
            document.querySelectorAll("[data-i18n]").forEach(element => {
                const key = element.getAttribute("data-i18n");
                if (translations[key]) {
                    element.textContent = translations[key];
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
