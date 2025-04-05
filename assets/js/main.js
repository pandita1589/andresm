/*=============== EMAIL FORM & MODAL WITH REAL EMAIL SENDING ===============*/
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const modal = document.querySelector('.modal');
    const modalLoading = document.getElementById('modalLoading');
    const modalSuccess = document.getElementById('modalSuccess');
    const modalError = document.getElementById('modalError');
    const modalClose = document.getElementById('modalClose');
    const modalErrorClose = document.getElementById('modalErrorClose');
    
    // Función para enviar correo usando EmailJS
    const sendEmail = (email) => {
        // Estas credenciales deberán ser reemplazadas con tus credenciales reales de EmailJS
        const serviceID = 'service_zgrkhrf'; // Reemplazar con tu service ID
        const templateID = 'template_p8v5pdc'; // Reemplazar con tu template ID
        const userID = 'gIYxgJqJn4Z6ufOad'; // Reemplazar con tu user ID
        
        const templateParams = {
            to_email: 'fabian1234andre@gmail.com',
            from_email: email,
            subject: 'Nueva persona te quiere contratar',
            message: `El usuario con correo ${email} está interesado en tus servicios.`,
            contact_number: Math.random() * 100000 | 0
        };
        
        return emailjs.send(serviceID, templateID, templateParams, userID);
    };
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener el correo electrónico
            const emailInput = contactForm.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            // Abrir modal con pantalla de carga
            modal.classList.add('active');
            modalLoading.classList.add('active');
            modalSuccess.classList.remove('active');
            modalError.classList.remove('active');
            
            // Enviar correo electrónico real
            sendEmail(email)
                .then(response => {
                    console.log('Email enviado correctamente!', response);
                    modalLoading.classList.remove('active');
                    modalSuccess.classList.add('active');
                    
                    // Incrementar contador de contactos
                    const currentCount = parseInt(localStorage.getItem('contactCount') || 0);
                    localStorage.setItem('contactCount', currentCount + 1);
                    
                    // Limpiar formulario
                    contactForm.reset();
                })
                .catch(error => {
                    console.error('Error al enviar email:', error);
                    modalLoading.classList.remove('active');
                    modalError.classList.add('active');
                });
        });
    }
    
    // Cerrar modal en éxito
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            modal.classList.remove('active');
        });
    }
    
    // Cerrar modal en error
    if (modalErrorClose) {
        modalErrorClose.addEventListener('click', function() {
            modal.classList.remove('active');
        });
    }
    
    // También cerrar modal al hacer clic fuera
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
});/*=============== SMOOTH SCROLL ANIMATION ===============*/
// Función para scroll suave al hacer clic en enlaces de navegación
document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar todos los enlaces que apuntan a un ID
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Solo para enlaces que no son el botón de scroll-up y que tienen un destino válido
            if (this.getAttribute('href') !== '#' && this.getAttribute('href').length > 1 && !this.classList.contains('empty-link')) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Cerrar el menú móvil si está abierto
                    if (navMenu.classList.contains('show-menu')) {
                        navMenu.classList.remove('show-menu');
                    }
                    
                    // Calcular la posición del elemento destino
                    const headerOffset = 100; // Ajustar según la altura del header
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    // Animar el scroll
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
    navToggle = document.getElementById('nav-toggle'),
    navClose = document.getElementById('nav-close');

/* Menu show with animation */
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
        // Añadir animación de fade-in a los elementos del menú
        const navItems = document.querySelectorAll('.nav__item');
        navItems.forEach((item, index) => {
            item.style.animation = `fadeInRight 0.5s ease forwards ${0.2 + index * 0.1}s`;
            item.style.opacity = '0';
        });
    });
}

/* Menu hidden with animation */
if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
}

/*=============== REMOVE MENU MOBILE ===============*/
const navLink = document.querySelectorAll('.nav__link');

const linkAction = () => {
    navMenu.classList.remove('show-menu');
}
navLink.forEach(n => n.addEventListener('click', linkAction));

/*=============== CHANGE BACKGROUND HEADER ===============*/
const scrollHeader = () => {
    const header = document.getElementById('header');
    // When the scroll is greater than 50 viewport height, add the scroll-header class
    this.scrollY >= 50 ? header.classList.add('scroll-header') : header.classList.remove('scroll-header');
}
window.addEventListener('scroll', scrollHeader);

/*=============== SHOW SCROLL UP ===============*/
const scrollUp = () => {
    const scrollUp = document.getElementById('scroll-up');
    // When the scroll is higher than 350 viewport height, add the show-scroll class
    this.scrollY >= 350 ? scrollUp.classList.add('show-scroll') : scrollUp.classList.remove('show-scroll');
}
window.addEventListener('scroll', scrollUp);

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]');

const scrollActive = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight,
            sectionTop = current.offsetTop - 58,
            sectionId = current.getAttribute('id'),
            sectionsClass = document.querySelector('.nav__link[href*=' + sectionId + ']');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            sectionsClass.classList.add('active-link');
        } else {
            sectionsClass.classList.remove('active-link');
        }
    });
}
window.addEventListener('scroll', scrollActive);

/*=============== SPOTIFY PLAYER ENHANCED ===============*/
// Solución mejorada para reproductor de Spotify
document.addEventListener('DOMContentLoaded', () => {
    const musicPlayer = document.getElementById('music-player');
    const playerToggle = document.getElementById('player-toggle');
    const closePlayer = document.getElementById('close-player');
    const spotifyFrame = document.getElementById('spotify-player');
    
    // Crear un iframe oculto para mantener la reproducción en segundo plano
    const createBackgroundPlayer = () => {
        // Solo crear si no existe ya
        if (!document.getElementById('background-player')) {
            const hiddenPlayer = document.createElement('div');
            hiddenPlayer.style.position = 'fixed';
            hiddenPlayer.style.bottom = '0';
            hiddenPlayer.style.right = '0';
            hiddenPlayer.style.width = '1px';
            hiddenPlayer.style.height = '1px';
            hiddenPlayer.style.opacity = '0.01';
            hiddenPlayer.style.pointerEvents = 'none';
            hiddenPlayer.style.overflow = 'hidden';
            hiddenPlayer.style.zIndex = '-1';
            hiddenPlayer.id = 'background-player-container';
            
            // Clonar el iframe de Spotify
            hiddenPlayer.innerHTML = `
                <iframe id="background-player" 
                    src="${spotifyFrame.src}" 
                    width="1" height="1" 
                    frameBorder="0" 
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture; web-share">
                </iframe>
            `;
            
            document.body.appendChild(hiddenPlayer);
            return document.getElementById('background-player');
        }
        return document.getElementById('background-player');
    };
    
    // Iniciar la música cuando se activa el reproductor
    const startMusic = () => {
        createBackgroundPlayer();
        
        // Intenta reproducir también en el iframe visible 
        if (spotifyFrame) {
            // Enviar mensaje al iframe para reproducir
            try {
                spotifyFrame.contentWindow.postMessage(JSON.stringify({
                    command: 'play'
                }), '*');
            } catch (e) {
                console.log('No se pudo comunicar con iframe de Spotify');
            }
        }
    };
    
    // Cuando se hace clic en el botón de música
    playerToggle.addEventListener('click', () => {
        musicPlayer.classList.toggle('active');
        
        // Animar el botón cuando se hace clic
        playerToggle.classList.add('clicked');
        setTimeout(() => {
            playerToggle.classList.remove('clicked');
        }, 300);
        
        startMusic();
    });
    
    // Cuando se cierra el reproductor
    closePlayer.addEventListener('click', () => {
        // Solo ocultar el reproductor sin detener la música
        musicPlayer.classList.remove('active');
        // La música sigue reproduciéndose en el iframe oculto
    });
    
    // Mejorar rendimiento del iframe
    if (spotifyFrame) {
        // Remover atributos innecesarios en móviles
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            spotifyFrame.setAttribute('loading', 'eager'); // Cargar inmediatamente
            spotifyFrame.style.transform = 'translateZ(0)'; // Forzar aceleración hardware
        }
    }
    
    // Iniciar reproductor en segundo plano después de interacción del usuario
    document.addEventListener('click', startMusic, { once: true });
});

/*=============== MÚSICA AUTOPLAY MEJORADO ===============*/
// Función para intentar reproducir música
function tryPlayMusic() {
    const spotifyFrame = document.querySelector('.music-player__content iframe');
    
    if (spotifyFrame) {
        // Actualizar la URL del iframe para forzar recarga con autoplay
        let currentSrc = spotifyFrame.src;
        
        // Asegurarse de que tiene el parámetro autoplay=1
        if (!currentSrc.includes('autoplay=1')) {
            if (currentSrc.includes('?')) {
                currentSrc += '&autoplay=1';
            } else {
                currentSrc += '?autoplay=1';
            }
            spotifyFrame.src = currentSrc;
        } else {
            // Recargar el iframe para forzar autoplay
            spotifyFrame.src = spotifyFrame.src;
        }
        
        // Enfocar el iframe para aumentar posibilidades de autoplay
        setTimeout(() => {
            spotifyFrame.focus();
        }, 500);
    }
}

// Intento agresivo de reproducción
function aggressivePlayAttempt() {
    // Hacer visible el reproductor
    musicPlayer.classList.add('active');
    
    // Intento múltiple de reproducción
    tryPlayMusic();
    
    // Segundo intento después de 1 segundo
    setTimeout(tryPlayMusic, 1000);
    
    // Tercer intento después de 2 segundos
    setTimeout(tryPlayMusic, 2000);
    
    // Mostrar instrucción visual
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.bottom = '100px';
    notification.style.right = '30px';
    notification.style.background = 'rgba(0,0,0,0.8)';
    notification.style.color = 'white';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '8px';
    notification.style.zIndex = '1000';
    notification.style.fontWeight = 'bold';
    notification.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
    notification.innerHTML = 'Haz clic en cualquier parte para activar la música 🎵';
    
    document.body.appendChild(notification);
    
    // Eliminar la notificación después de 8 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.8s';
        setTimeout(() => notification.remove(), 800);
    }, 8000);
}

// Activar música con interacción del usuario (clic o tecla)
function setupUserActivatedPlay() {
    const activateMusic = () => {
        tryPlayMusic();
        // Eliminar listeners después del primer uso
        document.removeEventListener('click', activateMusic);
        document.removeEventListener('keydown', activateMusic);
    };
    
    document.addEventListener('click', activateMusic);
    document.addEventListener('keydown', activateMusic);
}

/*=============== SPLASH SCREEN & LOADER ===============*/
document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('splash-screen');
    const loader = document.getElementById('loader');

    // Configurar manejo de enlaces vacíos o sin destino
    setupEmptyLinksHandler();

    // Mostrar pantalla de bienvenida por 3 segundos
    setTimeout(() => {
        splashScreen.style.opacity = '0';
        loader.style.opacity = '1';
        loader.style.visibility = 'visible';

        // Mostrar loader por 2 segundos
        setTimeout(() => {
            loader.style.opacity = '0';

            // Ocultar loader después de la transición
            setTimeout(() => {
                splashScreen.style.display = 'none';
                loader.style.display = 'none';

                // Iniciar reproducción agresiva de música
                aggressivePlayAttempt();
                
                // Configurar activación por usuario como respaldo
                setupUserActivatedPlay();
                
            }, 400);
        }, 2000);
    }, 3000);
});

// Configurar manejo de enlaces vacíos o sin destino
function setupEmptyLinksHandler() {
    // Seleccionar todos los enlaces que tienen la clase empty-link o href="#" o href=""
    const emptyLinks = document.querySelectorAll('.empty-link, a[href="#"]:not(.nav__link):not(#scroll-up), a[href=""]:not(.nav__link)');
    
    // Añadir evento de clic para redirigir a la página 404
    emptyLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '404.html';
        });
    });
    
    // Manejar específicamente el botón de proyecto
    const projectButton = document.querySelector('.project-button');
    if (projectButton) {
        projectButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '404.html';
        });
    }
    
    // Añadir manejador para todos los enlaces en el pie de página
    const footerLinks = document.querySelectorAll('.footer__link:not([href^="http"]):not([href^="index"])');
    footerLinks.forEach(link => {
        if (link.getAttribute('href') === '#' || link.getAttribute('href') === '' || !link.hasAttribute('href')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = '404.html';
            });
        }
    });
    
    // Manejar formulario
    const contactForm = document.querySelector('.join__form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            // Permitir que el formulario se envíe a la página 404
        });
    }
}

// Intento adicional de reproducción cuando la ventana obtiene foco
window.addEventListener('focus', () => {
    if (musicPlayer.classList.contains('active')) {
        tryPlayMusic();
    }
});

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2500,
    delay: 400,
    // reset: true // Animations repeat
});

sr.reveal(`.home__data, .explore__data, .explore__user, .join__data`, { origin: 'left' });
sr.reveal(`.home__cards, .about__image, .join__image`, { origin: 'right' });
sr.reveal(`.about__data`, { origin: 'left' });
sr.reveal(`.popular__card`, { interval: 100 });