// ===================================
// MOBILE MENU
// ===================================

const menuBtn = document.querySelector('.menu-btn');
const navMenu = document.querySelector('.nav-menu');

if (menuBtn) {
    menuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');

        // Animate menu button
        const spans = menuBtn.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translateY(8px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const spans = menuBtn.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        });
    });
}

// ===================================
// SMOOTH SCROLL
// ===================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// FORM VALIDATION & SUBMISSION
// ===================================

const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // Basic validation
        if (!data.cabinet || !data.name || !data.email || !data.size || !data.message) {
            showNotification('Veuillez remplir tous les champs obligatoires', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Veuillez entrer une adresse email valide', 'error');
            return;
        }

        // Get submit button
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        // Show loading state
        submitBtn.textContent = 'Envoi en cours...';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual API call)
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Success
            showNotification('Votre demande a été envoyée avec succès ! Nous vous recontacterons bientôt.', 'success');
            contactForm.reset();

        } catch (error) {
            showNotification('Une erreur est survenue. Veuillez réessayer.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ===================================
// NOTIFICATION SYSTEM
// ===================================

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6'
    };

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        max-width: 400px;
        padding: 1rem 1.5rem;
        background: ${colors[type]};
        color: white;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        font-weight: 500;
    `;

    document.body.appendChild(notification);

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    if (!document.querySelector('#notification-styles')) {
        style.id = 'notification-styles';
        document.head.appendChild(style);
    }

    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// ===================================
// SCROLL ANIMATIONS
// ===================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.why-card, .value-card, .pillar-item, .process-card, .benefit-card');

    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
});

// ===================================
// NAVBAR SHADOW ON SCROLL
// ===================================

const nav = document.querySelector('.nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        nav.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    }

    lastScroll = currentScroll;
});

// ===================================
// DIRECTORY / ANNUAIRE
// ===================================

// Base de données des cabinets (exemple)
const cabinets = [
    {
        name: "Cabinet Dubois & Associés",
        location: "paris",
        specialty: "affaires",
        address: "15 Avenue Montaigne, 75008 Paris",
        phone: "01 42 56 78 90",
        email: "contact@dubois-avocats.fr",
        description: "Cabinet spécialisé en droit des affaires depuis 25 ans. Équipe de 12 avocats engagés dans la démarche Label Confiance.",
        size: "11-20 collaborateurs",
        since: "2023"
    },
    {
        name: "Martin & Partners",
        location: "lyon",
        specialty: "penal",
        address: "8 Rue de la République, 69002 Lyon",
        phone: "04 78 39 45 67",
        email: "contact@martin-partners.fr",
        description: "Excellence en droit pénal des affaires et défense pénale. Cabinet à taille humaine privilégiant l'écoute et la bienveillance.",
        size: "6-10 collaborateurs",
        since: "2024"
    },
    {
        name: "Cabinet Leroy",
        location: "marseille",
        specialty: "famille",
        address: "32 Boulevard Longchamp, 13001 Marseille",
        phone: "04 91 55 23 44",
        email: "contact@cabinet-leroy.fr",
        description: "Spécialiste du droit de la famille et des successions. Approche humaine et bienveillante dans les moments difficiles.",
        size: "2-5 collaborateurs",
        since: "2023"
    },
    {
        name: "Rousseau Avocats",
        location: "toulouse",
        specialty: "immobilier",
        address: "45 Rue Alsace-Lorraine, 31000 Toulouse",
        phone: "05 61 22 33 44",
        email: "contact@rousseau-avocats.fr",
        description: "Cabinet dédié au droit immobilier et à l'urbanisme. Équipe engagée pour un environnement de travail équilibré.",
        size: "6-10 collaborateurs",
        since: "2024"
    },
    {
        name: "Bernard & Associés",
        location: "bordeaux",
        specialty: "travail",
        address: "12 Cours de l'Intendance, 33000 Bordeaux",
        phone: "05 56 44 55 66",
        email: "contact@bernard-associes.fr",
        description: "Experts en droit du travail et droit social. Cabinet pionnier dans la mise en place de pratiques RH innovantes.",
        size: "11-20 collaborateurs",
        since: "2023"
    },
    {
        name: "Cabinet Moreau",
        location: "nantes",
        specialty: "social",
        address: "7 Place Graslin, 44000 Nantes",
        phone: "02 40 77 88 99",
        email: "contact@cabinet-moreau.fr",
        description: "Droit social et protection sociale. Valeurs d'inclusion et de diversité au cœur de notre cabinet.",
        size: "2-5 collaborateurs",
        since: "2024"
    },
    {
        name: "Petit Avocats",
        location: "strasbourg",
        specialty: "fiscal",
        address: "18 Quai Kléber, 67000 Strasbourg",
        phone: "03 88 35 46 57",
        email: "contact@petit-avocats.fr",
        description: "Fiscalité des entreprises et particuliers. Cabinet qui place le bien-être de ses équipes en priorité.",
        size: "6-10 collaborateurs",
        since: "2024"
    },
    {
        name: "Laurent & Fils",
        location: "lille",
        specialty: "public",
        address: "25 Rue Nationale, 59000 Lille",
        phone: "03 20 12 34 56",
        email: "contact@laurent-fils.fr",
        description: "Droit public et droit administratif. Transmission des valeurs d'éthique et de respect entre générations.",
        size: "2-5 collaborateurs",
        since: "2023"
    },
    {
        name: "Cabinet Fontaine",
        location: "rennes",
        specialty: "affaires",
        address: "33 Rue Saint-Malo, 35000 Rennes",
        phone: "02 99 78 90 12",
        email: "contact@fontaine-avocats.fr",
        description: "Droit des affaires et corporate. Management participatif et transparence totale dans nos pratiques.",
        size: "6-10 collaborateurs",
        since: "2024"
    },
    {
        name: "Garcia Avocats",
        location: "nice",
        specialty: "immobilier",
        address: "14 Promenade des Anglais, 06000 Nice",
        phone: "04 93 87 65 43",
        email: "contact@garcia-avocats.fr",
        description: "Immobilier et urbanisme sur la Côte d'Azur. Cabinet qui valorise l'équilibre vie pro/vie perso de ses collaborateurs.",
        size: "2-5 collaborateurs",
        since: "2023"
    },
    {
        name: "Thomas & Associés",
        location: "paris",
        specialty: "travail",
        address: "56 Avenue Kléber, 75116 Paris",
        phone: "01 45 23 67 89",
        email: "contact@thomas-associes.fr",
        description: "Droit du travail individuel et collectif. Formation continue et développement des compétences pour tous.",
        size: "11-20 collaborateurs",
        since: "2024"
    },
    {
        name: "Simon Avocats",
        location: "lyon",
        specialty: "famille",
        address: "22 Quai Saint-Antoine, 69002 Lyon",
        phone: "04 72 56 78 90",
        email: "contact@simon-avocats.fr",
        description: "Droit de la famille et médiation familiale. Approche empathique et communication non-violente.",
        size: "2-5 collaborateurs",
        since: "2023"
    }
];

let filteredCabinets = [...cabinets];

// Fonction pour créer une carte cabinet
function createCabinetCard(cabinet) {
    const specialtyLabels = {
        'affaires': 'Droit des Affaires',
        'penal': 'Droit Pénal',
        'famille': 'Droit de la Famille',
        'immobilier': 'Droit Immobilier',
        'travail': 'Droit du Travail',
        'social': 'Droit Social',
        'fiscal': 'Droit Fiscal',
        'public': 'Droit Public'
    };

    return `
        <div class="cabinet-card">
            <div class="cabinet-badge">✓ Labellisé ${cabinet.since}</div>
            <div class="cabinet-header">
                <h3 class="cabinet-name">${cabinet.name}</h3>
                <div class="cabinet-location">📍 ${cabinet.address}</div>
                <div class="cabinet-specialty">⚖️ ${specialtyLabels[cabinet.specialty]}</div>
            </div>
            <p class="cabinet-description">${cabinet.description}</p>
            <div class="cabinet-info">
                <div class="cabinet-info-item">
                    <strong>Taille :</strong> ${cabinet.size}
                </div>
                <div class="cabinet-info-item">
                    <strong>Téléphone :</strong> ${cabinet.phone}
                </div>
                <div class="cabinet-info-item">
                    <strong>Email :</strong> ${cabinet.email}
                </div>
            </div>
            <div class="cabinet-actions">
                <a href="mailto:${cabinet.email}" class="btn btn-primary">Contacter</a>
                <a href="tel:${cabinet.phone}" class="btn btn-secondary">Appeler</a>
            </div>
        </div>
    `;
}

// Fonction pour afficher les cabinets
function displayCabinets(cabinetsToDisplay) {
    const resultsContainer = document.getElementById('directory-results');
    const noResults = document.getElementById('no-results');
    const countSpan = document.getElementById('count');

    if (cabinetsToDisplay.length === 0) {
        resultsContainer.innerHTML = '';
        noResults.style.display = 'block';
        countSpan.textContent = '0';
    } else {
        noResults.style.display = 'none';
        resultsContainer.innerHTML = cabinetsToDisplay.map(cabinet => createCabinetCard(cabinet)).join('');
        countSpan.textContent = cabinetsToDisplay.length;

        // Animate cards
        const cards = resultsContainer.querySelectorAll('.cabinet-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
}

// Fonction de filtrage
function filterCabinets() {
    const locationFilter = document.getElementById('location-filter').value;
    const specialtyFilter = document.getElementById('specialty-filter').value;

    filteredCabinets = cabinets.filter(cabinet => {
        const locationMatch = !locationFilter || cabinet.location === locationFilter;
        const specialtyMatch = !specialtyFilter || cabinet.specialty === specialtyFilter;
        return locationMatch && specialtyMatch;
    });

    displayCabinets(filteredCabinets);
}

// Initialisation de l'annuaire
document.addEventListener('DOMContentLoaded', () => {
    const locationFilter = document.getElementById('location-filter');
    const specialtyFilter = document.getElementById('specialty-filter');
    const resetBtn = document.getElementById('reset-filters');

    if (locationFilter && specialtyFilter) {
        // Afficher tous les cabinets au chargement
        displayCabinets(cabinets);

        // Événements sur les filtres
        locationFilter.addEventListener('change', filterCabinets);
        specialtyFilter.addEventListener('change', filterCabinets);

        // Réinitialiser les filtres
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                locationFilter.value = '';
                specialtyFilter.value = '';
                filterCabinets();
            });
        }
    }
});

// ===================================
// CONSOLE INFO
// ===================================

console.log('%c🏛️ Label Confiance', 'font-size: 20px; font-weight: bold; color: #2563eb;');
console.log('%cPlacer l\'humain au cœur de la pratique juridique', 'font-size: 12px; color: #64748b;');
console.log('%c✅ Site chargé avec succès', 'font-size: 12px; color: #10b981;');
