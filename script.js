// ========================================
// GLOBAL STATE & UTILITIES
// ========================================

const state = {
    currentTestimonial: 0,
    isAnimating: false,
    scrollPosition: 0
};

// Debounce utility for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Trigger number counting for stat cards
            if (entry.target.classList.contains('stat-card')) {
                const numberElement = entry.target.querySelector('.stat-number');
                if (numberElement && !numberElement.classList.contains('counted')) {
                    animateNumber(numberElement);
                    numberElement.classList.add('counted');
                }
            }
        }
    });
}, observerOptions);

// ========================================
// NAVIGATION
// ========================================

function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinkItems = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    const handleScroll = debounce(() => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update active nav link based on scroll position
        updateActiveNavLink();
    }, 10);

    window.addEventListener('scroll', handleScroll);

    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking nav link
    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Smooth scroll for nav links
    navLinkItems.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// ========================================
// STATISTICS COUNTER ANIMATION
// ========================================

function animateNumber(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateNumber = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateNumber);
        } else {
            element.textContent = target;
        }
    };

    updateNumber();
}

// ========================================
// TESTIMONIALS SLIDER
// ========================================

function initTestimonialsSlider() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');

    if (testimonialCards.length === 0) return;

    function showTestimonial(index) {
        if (state.isAnimating) return;
        state.isAnimating = true;

        // Ensure index is within bounds
        if (index >= testimonialCards.length) {
            index = 0;
        } else if (index < 0) {
            index = testimonialCards.length - 1;
        }

        state.currentTestimonial = index;

        // Update cards
        testimonialCards.forEach((card, i) => {
            card.classList.remove('active');
            if (i === index) {
                card.classList.add('active');
            }
        });

        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.remove('active');
            if (i === index) {
                dot.classList.add('active');
            }
        });

        setTimeout(() => {
            state.isAnimating = false;
        }, 500);
    }

    // Event listeners
    prevBtn.addEventListener('click', () => {
        showTestimonial(state.currentTestimonial - 1);
    });

    nextBtn.addEventListener('click', () => {
        showTestimonial(state.currentTestimonial + 1);
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showTestimonial(index);
        });
    });

    // Auto-advance testimonials
    let autoAdvanceInterval = setInterval(() => {
        showTestimonial(state.currentTestimonial + 1);
    }, 5000);

    // Pause auto-advance on hover
    const testimonialsSection = document.querySelector('.testimonials-slider');
    testimonialsSection.addEventListener('mouseenter', () => {
        clearInterval(autoAdvanceInterval);
    });

    testimonialsSection.addEventListener('mouseleave', () => {
        autoAdvanceInterval = setInterval(() => {
            showTestimonial(state.currentTestimonial + 1);
        }, 5000);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            showTestimonial(state.currentTestimonial - 1);
        } else if (e.key === 'ArrowRight') {
            showTestimonial(state.currentTestimonial + 1);
        }
    });

    // Initialize first testimonial
    showTestimonial(0);
}

// ========================================
// FORM HANDLING
// ========================================

function initContactForm() {
    const form = document.querySelector('.contact-form');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Get submit button
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        // Show loading state
        submitBtn.textContent = 'Envoi en cours...';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual API call)
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Success state
            submitBtn.textContent = '✓ Message envoyé !';
            submitBtn.style.background = '#48bb78';

            // Show success message
            showNotification('Votre message a été envoyé avec succès ! Nous vous recontacterons bientôt.', 'success');

            // Reset form
            form.reset();

            // Reset button after delay
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);

        } catch (error) {
            // Error state
            submitBtn.textContent = '✗ Erreur';
            submitBtn.style.background = '#f56565';

            showNotification('Une erreur est survenue. Veuillez réessayer.', 'error');

            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        }
    });

    // Add floating label effect
    const formInputs = form.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#48bb78' : '#f56565'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.5s ease-out;
        max-width: 400px;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 5000);
}

// Add notification animations to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
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
document.head.appendChild(style);

// ========================================
// SCROLL ANIMATIONS
// ========================================

function initScrollAnimations() {
    // Observe all animatable elements
    const animatableElements = document.querySelectorAll(`
        .benefit-card,
        .stat-card,
        .timeline-item,
        .testimonial-card,
        .contact-info,
        .contact-form
    `);

    animatableElements.forEach(element => {
        // Add initial state for animation
        if (!element.classList.contains('testimonial-card')) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        }

        animateOnScroll.observe(element);
    });

    // Add visible class effect
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(styleSheet);
}

// ========================================
// HERO PARALLAX EFFECT
// ========================================

function initParallaxEffect() {
    const heroShapes = document.querySelectorAll('.shape');
    const heroVisual = document.querySelector('.hero-visual');

    window.addEventListener('scroll', debounce(() => {
        const scrolled = window.scrollY;

        if (scrolled < window.innerHeight) {
            heroShapes.forEach((shape, index) => {
                const speed = 0.5 + (index * 0.1);
                const yPos = -(scrolled * speed);
                shape.style.transform = `translateY(${yPos}px)`;
            });

            if (heroVisual) {
                const yPos = scrolled * 0.3;
                heroVisual.style.transform = `translateY(${yPos}px)`;
            }
        }
    }, 10));
}

// ========================================
// BUTTON RIPPLE EFFECT
// ========================================

function initRippleEffect() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                top: ${y}px;
                left: ${x}px;
                background: rgba(255, 255, 255, 0.6);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add ripple animation
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
}

// ========================================
// SMOOTH SCROLL INDICATOR
// ========================================

function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');

    if (scrollIndicator) {
        window.addEventListener('scroll', debounce(() => {
            if (window.scrollY > 200) {
                scrollIndicator.style.opacity = '0';
            } else {
                scrollIndicator.style.opacity = '1';
            }
        }, 10));

        scrollIndicator.addEventListener('click', () => {
            const statsSection = document.querySelector('.stats');
            if (statsSection) {
                statsSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

// ========================================
// CARD 3D TILT EFFECT
// ========================================

function init3DTiltEffect() {
    const cards = document.querySelectorAll('.benefit-card, .floating-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// ========================================
// LOADING ANIMATION
// ========================================

function initLoadingAnimation() {
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');

        // Trigger entrance animations
        setTimeout(() => {
            const heroElements = document.querySelectorAll('.hero-text > *');
            heroElements.forEach((element, index) => {
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }, 100);
    });
}

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================

function optimizePerformance() {
    // Lazy load images when implemented
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Reduce motion for users who prefer it
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.scrollBehavior = 'auto';

        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(styleSheet);
    }
}

// ========================================
// ANALYTICS & TRACKING (Placeholder)
// ========================================

function initAnalytics() {
    // Track page views
    console.log('Page view tracked:', window.location.pathname);

    // Track button clicks
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', () => {
            console.log('Button clicked:', btn.textContent);
        });
    });

    // Track form submissions
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', () => {
            console.log('Form submitted');
        });
    }
}

// ========================================
// EASTER EGG
// ========================================

function initEasterEgg() {
    const konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.keyCode === konami[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konami.length) {
                activateEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
}

function activateEasterEgg() {
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach(shape => {
        shape.style.animation = 'float 1s infinite ease-in-out';
        shape.style.filter = 'blur(0px) hue-rotate(180deg)';
    });

    showNotification('🎉 Vous avez trouvé l\'easter egg ! Félicitations !', 'success');

    setTimeout(() => {
        shapes.forEach(shape => {
            shape.style.animation = '';
            shape.style.filter = '';
        });
    }, 5000);
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 Label Confiance - Site initialisé');

    // Initialize all features
    initNavigation();
    initTestimonialsSlider();
    initContactForm();
    initScrollAnimations();
    initParallaxEffect();
    initRippleEffect();
    initScrollIndicator();
    init3DTiltEffect();
    initLoadingAnimation();
    optimizePerformance();
    initAnalytics();
    initEasterEgg();

    console.log('✅ Toutes les fonctionnalités sont chargées');
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page hidden');
    } else {
        console.log('Page visible');
    }
});

// Handle online/offline status
window.addEventListener('online', () => {
    showNotification('Connexion rétablie', 'success');
});

window.addEventListener('offline', () => {
    showNotification('Vous êtes hors ligne', 'error');
});

// Export functions for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initNavigation,
        initTestimonialsSlider,
        initContactForm,
        showNotification
    };
}
