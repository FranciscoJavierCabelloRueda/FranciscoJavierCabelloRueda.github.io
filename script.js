// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        this.bindEvents();
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
    }

    toggle() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    bindEvents() {
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggle());
        }
    }
}

// Smooth Scroll Navigation
class NavigationManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindSmoothScroll();
        this.updateActiveNavigation();
    }

    bindSmoothScroll() {
        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    updateActiveNavigation() {
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.nav-link');
            
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.getBoundingClientRect().top;
                if (sectionTop <= 150) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }
}

// Skills Animation
class SkillsAnimator {
    constructor() {
        this.animated = false;
        this.init();
    }

    init() {
        this.bindScrollAnimation();
    }

    bindScrollAnimation() {
        window.addEventListener('scroll', () => {
            if (!this.animated) {
                const skillsSection = document.getElementById('skills');
                if (skillsSection && this.isElementInViewport(skillsSection)) {
                    this.animateSkillBars();
                    this.animated = true;
                }
            }
        });
    }

    isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach((bar, index) => {
            const level = bar.getAttribute('data-level');
            setTimeout(() => {
                bar.style.width = level + '%';
            }, index * 100);
        });
    }
}

// Form Handler
class ContactFormManager {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.submitBtn = document.getElementById('submit-btn');
        this.toast = document.getElementById('toast');
        this.init();
    }

    init() {
        if (this.form) {
            this.bindFormSubmission();
        }
    }

    bindFormSubmission() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleFormSubmission();
        });
    }

    async handleFormSubmission() {
        const formData = new FormData(this.form);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        // Validate form
        if (!name || !email || !message) {
            this.showToast('Por favor, completa todos los campos.', 'error');
            return;
        }

        // Show loading state
        this.setLoadingState(true);

        // Simulate form submission (replace with actual API call)
        try {
            await this.submitForm({ name, email, message });
            this.showToast('¡Mensaje enviado! Gracias por contactarme. Te responderé pronto.', 'success');
            this.form.reset();
        } catch (error) {
            this.showToast('Error al enviar el mensaje. Inténtalo de nuevo.', 'error');
        } finally {
            this.setLoadingState(false);
        }
    }

    async submitForm(data) {
        // Simulate API call delay
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form submitted:', data);
                resolve();
            }, 2000);
        });
    }

    setLoadingState(loading) {
        const btnText = this.submitBtn.querySelector('.btn-text');
        const btnLoading = this.submitBtn.querySelector('.btn-loading');
        
        if (loading) {
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';
            this.submitBtn.disabled = true;
        } else {
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            this.submitBtn.disabled = false;
        }
    }

    showToast(message, type = 'success') {
        const toastMessage = this.toast.querySelector('.toast-message');
        const toastIcon = this.toast.querySelector('.toast-icon');
        
        toastMessage.textContent = message;
        toastIcon.textContent = type === 'success' ? '✅' : '❌';
        
        this.toast.classList.add('show');
        
        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 5000);
    }
}

// Parallax Effects
class ParallaxManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindScrollEffects();
    }

    bindScrollEffects() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;

            // Parallax effect for background blobs
            const blobs = document.querySelectorAll('.bg-blob');
            blobs.forEach((blob, index) => {
                const speed = 0.2 + (index * 0.1);
                blob.style.transform = `translateY(${scrolled * speed}px)`;
            });

            // Hero section parallax
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) {
                heroContent.style.transform = `translateY(${rate}px)`;
            }
        });
    }
}

// Intersection Observer for Animations
class AnimationObserver {
    constructor() {
        this.init();
    }

    init() {
        this.createObserver();
        this.observeElements();
    }

    createObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);
    }

    observeElements() {
        const animatedElements = document.querySelectorAll(
            '.project-card, .skill-category, .contact-form-container, .contact-info-container, .social-links-container'
        );

        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px)';
            el.style.transition = `all 0.6s ease ${index * 0.1}s`;
            this.observer.observe(el);
        });
    }
}

// Utility Functions
function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

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

// Mouse Trail Effect (Optional Enhancement)
class MouseTrail {
    constructor() {
        this.dots = [];
        this.mouse = { x: 0, y: 0 };
        this.init();
    }

    init() {
        this.createDots();
        this.bindMouseMove();
        this.animate();
    }

    createDots() {
        for (let i = 0; i < 5; i++) {
            const dot = document.createElement('div');
            dot.className = 'mouse-dot';
            dot.style.cssText = `
                position: fixed;
                width: 6px;
                height: 6px;
                background: linear-gradient(135deg, #0891b2, #0ea5e9);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                opacity: ${0.8 - i * 0.15};
                transition: opacity 0.3s ease;
            `;
            document.body.appendChild(dot);
            this.dots.push({
                element: dot,
                x: 0,
                y: 0,
                targetX: 0,
                targetY: 0
            });
        }
    }

    bindMouseMove() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        document.addEventListener('mouseenter', () => {
            this.dots.forEach(dot => {
                dot.element.style.opacity = dot.element.style.opacity;
            });
        });

        document.addEventListener('mouseleave', () => {
            this.dots.forEach(dot => {
                dot.element.style.opacity = '0';
            });
        });
    }

    animate() {
        let targetX = this.mouse.x;
        let targetY = this.mouse.y;

        this.dots.forEach((dot, index) => {
            dot.targetX = targetX;
            dot.targetY = targetY;
            
            dot.x += (dot.targetX - dot.x) * 0.15;
            dot.y += (dot.targetY - dot.y) * 0.15;

            dot.element.style.transform = `translate(${dot.x - 3}px, ${dot.y - 3}px)`;

            targetX = dot.x;
            targetY = dot.y;
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Add CSS for animate-in class
const animationCSS = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;

// Inject animation CSS
const style = document.createElement('style');
style.textContent = animationCSS;
document.head.appendChild(style);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Core functionality
    new ThemeManager();
    new NavigationManager();
    new SkillsAnimator();
    new ContactFormManager();
    new ParallaxManager();
    new AnimationObserver();
    
    // Optional enhancements (uncomment to enable)
    // new MouseTrail();
    
    // Add loading complete class
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when tab is not visible
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations when tab becomes visible
        document.body.style.animationPlayState = 'running';
    }
});

// Handle window resize
window.addEventListener('resize', debounce(() => {
    // Recalculate any size-dependent elements
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        const level = bar.getAttribute('data-level');
        if (bar.style.width !== '0%') {
            bar.style.width = level + '%';
        }
    });
}, 250));