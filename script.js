/**
 * Gestiona el tema de la página (claro/oscuro).
 * Guarda la preferencia del usuario en localStorage.
 */
class ThemeManager {
    constructor() {
        // Obtiene el tema actual de localStorage o usa 'light' por defecto.
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        // Aplica el tema inicial y asigna el evento al botón de cambio de tema.
        this.setTheme(this.currentTheme);
        this.bindEvents();
    }

    setTheme(theme) {
        // Establece el atributo 'data-theme' en el elemento <html> y lo guarda en localStorage.
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
    }

    toggle() {
        // Cambia entre el tema claro y oscuro.
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    bindEvents() {
        // Asigna el evento de clic al botón de cambio de tema.
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggle());
        }
    }
}

/**
 * Gestiona la navegación con desplazamiento suave y resalta el enlace activo.
 */
class NavigationManager {
    constructor() {
        this.init();
    }

    init() {
        // Inicializa el desplazamiento suave y la actualización del enlace de navegación activo.
        this.bindSmoothScroll();
        this.updateActiveNavigation();
    }

    bindSmoothScroll() {
        // Añade un evento de clic a los enlaces de anclaje para un desplazamiento suave.
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    // Desplaza la vista hasta el elemento de destino.
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    updateActiveNavigation() {
        // Escucha el evento de scroll para resaltar el enlace de navegación correspondiente a la sección visible.
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.nav-link');
            
            let current = '';
            // Determina qué sección está actualmente en la parte superior de la ventana.
            sections.forEach(section => {
                const sectionTop = section.getBoundingClientRect().top;
                if (sectionTop <= 150) {
                    current = section.getAttribute('id');
                }
            });

            // Añade o quita la clase 'active' de los enlaces de navegación.
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }
}

/**
 * Anima las barras de progreso de habilidades cuando la sección es visible.
 */
class SkillsAnimator {
    constructor() {
        // Flag para asegurar que la animación se ejecute solo una vez.
        this.animated = false;
        this.init();
    }

    init() {
        // Asigna el evento de scroll para disparar la animación.
        this.bindScrollAnimation();
    }

    bindScrollAnimation() {
        // Escucha el evento de scroll.
        window.addEventListener('scroll', () => {
            if (!this.animated) {
                const skillsSection = document.getElementById('skills');
                // Si la sección de habilidades está en el viewport, anima las barras.
                if (skillsSection && this.isElementInViewport(skillsSection)) {
                    this.animateSkillBars();
                    this.animated = true;
                }
            }
        });
    }

    isElementInViewport(element) {
        // Comprueba si un elemento está completamente dentro de la ventana visible.
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    animateSkillBars() {
        // Selecciona todas las barras de progreso.
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach((bar, index) => {
            // Obtiene el nivel de la habilidad del atributo 'data-level'.
            const level = bar.getAttribute('data-level');
            setTimeout(() => {
                // Anima el ancho de la barra con un pequeño retraso para cada una.
                bar.style.width = level + '%';
            }, index * 100);
        });
    }
}

/**
 * Gestiona los efectos de paralaje en elementos de la página al hacer scroll.
 */
class ParallaxManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindScrollEffects();
    }

    bindScrollEffects() {
        // Escucha el evento de scroll para aplicar transformaciones.
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;

            // Efecto de paralaje para los "blobs" de fondo.
            const blobs = document.querySelectorAll('.bg-blob');
            blobs.forEach((blob, index) => {
                const speed = 0.2 + (index * 0.1);
                blob.style.transform = `translateY(${scrolled * speed}px)`;
            });

            // Efecto de paralaje para el contenido de la sección "hero".
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) {
                heroContent.style.transform = `translateY(${rate}px)`;
            }
        });
    }
}

/**
 * Utiliza IntersectionObserver para animar elementos cuando entran en el viewport.
 */
class AnimationObserver {
    constructor() {
        this.init();
    }

    init() {
        this.createObserver();
        this.observeElements();
    }

    createObserver() {
        // Configuración del observador.
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            // Cuando un elemento observado entra en el viewport, le añade la clase 'animate-in'.
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);
    }

    observeElements() {
        // Selecciona todos los elementos que deben ser animados.
        const animatedElements = document.querySelectorAll(
            '.project-card, .skill-category, .contact-form-container, .contact-info-container, .social-links-container'
        );

        animatedElements.forEach((el, index) => {
            // Prepara los elementos para la animación (los hace invisibles y los desplaza).
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px)';
            el.style.transition = `all 0.6s ease ${index * 0.1}s`;
            this.observer.observe(el);
        });
    }
}

/**
 * Función de utilidad para desplazarse suavemente a la sección de contacto.
 */
function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

/**
 * Función de utilidad para retrasar la ejecución de una función (debounce).
 * Evita que una función se llame demasiadas veces en un corto período de tiempo.
 */
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

// Añade el CSS necesario para la clase 'animate-in' dinámicamente.
const animationCSS = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;

// Inyecta el CSS de la animación en el <head> del documento.
const style = document.createElement('style');
style.textContent = animationCSS;
document.head.appendChild(style);

// Inicializa todas las clases y funcionalidades cuando el DOM está completamente cargado.
document.addEventListener('DOMContentLoaded', () => {
    // Funcionalidades principales
    new ThemeManager();
    new NavigationManager();
    new SkillsAnimator();
    new ParallaxManager();
    new AnimationObserver();
    
    // Mejoras opcionales (descomentar para habilitar)
    // new MouseTrail();
    
    // Añade una clase al body para indicar que la carga ha finalizado.
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Gestiona los cambios de visibilidad de la página.
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pausa las animaciones CSS cuando la pestaña no está visible.
        document.body.style.animationPlayState = 'paused';
    } else {
        // Reanuda las animaciones cuando la pestaña vuelve a estar visible.
        document.body.style.animationPlayState = 'running';
    }
});

// Gestiona el redimensionamiento de la ventana.
window.addEventListener('resize', debounce(() => {
    // Vuelve a calcular elementos dependientes del tamaño, como las barras de habilidades.
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        const level = bar.getAttribute('data-level');
        if (bar.style.width !== '0%') {
            bar.style.width = level + '%';
        }
    });
}, 250));