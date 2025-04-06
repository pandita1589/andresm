/*=============== EMAIL FORM & MODAL WITH REAL EMAIL SENDING ===============*/
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del formulario y modal
    const contactForm = document.getElementById('contactForm');
    const modal = document.getElementById('emailModal');
    const modalLoading = document.getElementById('modalLoading');
    const modalSuccess = document.getElementById('modalSuccess');
    const modalError = document.getElementById('modalError');
    const modalClose = document.getElementById('modalClose');
    const modalErrorClose = document.getElementById('modalErrorClose');
    const dateTimeDisplay = document.getElementById('currentDateTime');
    const notificationElement = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');
    const notificationClose = document.getElementById('notificationClose');
    
    // Mapeo de campos a mensajes de error
    const errorFields = {
        'contactName': 'nameError',
        'contactEmail': 'emailError',
        'contactSubject': 'subjectError',
        'contactBirthdate': 'birthdateError',
        'contactWork': 'workError',
        'contactDescription': 'descriptionError',
        'privacyPolicy': 'privacyError'
    };
    
    // Inicializar campos de fecha
    initializeDateFields();
    
    // Actualizar la fecha y hora actual
    updateDateTime();
    
    // Agregar validación en tiempo real para los campos
    setupFieldValidation();
    
    // Manejar el envío del formulario
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Cerrar notificaciones
    if (notificationClose) {
        notificationClose.addEventListener('click', () => {
            hideNotification();
        });
    }
    
    // Cerrar modales
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (modalErrorClose) {
        modalErrorClose.addEventListener('click', closeModal);
    }
    
    /**
     * Inicializa los campos de fecha con valores por defecto
     */
    function initializeDateFields() {
        const birthdateInput = document.getElementById('contactBirthdate');
        if (birthdateInput) {
            // Establecer fecha máxima (hoy) para el campo de fecha de nacimiento
            const today = new Date().toISOString().split('T')[0];
            birthdateInput.setAttribute('max', today);
            
            // Establecer fecha por defecto (18 años atrás)
            const defaultDate = new Date();
            defaultDate.setFullYear(defaultDate.getFullYear() - 18);
            birthdateInput.value = defaultDate.toISOString().split('T')[0];
        }
    }
    
    /**
     * Actualiza la fecha y hora actual en el elemento correspondiente
     */
    function updateDateTime() {
        if (dateTimeDisplay) {
            const now = new Date();
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            };
            
            dateTimeDisplay.textContent = now.toLocaleDateString('es-ES', options);
            
            // Actualizar cada segundo
            setTimeout(updateDateTime, 1000);
        }
    }
    
    /**
     * Configura la validación en tiempo real para los campos del formulario
     */
    function setupFieldValidation() {
        // Agregar validación en tiempo real para todos los campos
        for (const fieldId in errorFields) {
            const field = document.getElementById(fieldId);
            const errorId = errorFields[fieldId];
            
            if (field && errorId) {
                // Validar al perder el foco
                field.addEventListener('blur', function() {
                    validateField(this);
                });
                
                // Para checkbox, validar al cambiar
                if (field.type === 'checkbox') {
                    field.addEventListener('change', function() {
                        validateField(this);
                    });
                }
                
                // Para otros campos, limpiar error al empezar a escribir
                if (field.type !== 'checkbox') {
                    field.addEventListener('input', function() {
                        const errorElement = document.getElementById(errorId);
                        if (errorElement) {
                            errorElement.textContent = '';
                            errorElement.classList.remove('show');
                        }
                        this.classList.remove('error-input');
                    });
                }
            }
        }
    }
    
    /**
     * Valida un campo específico del formulario
     * @param {HTMLElement} field - El campo a validar
     * @returns {boolean} - Verdadero si el campo es válido, falso en caso contrario
     */
    function validateField(field) {
        const errorId = errorFields[field.id];
        const errorElement = document.getElementById(errorId);
        let isValid = true;
        let errorMessage = '';
        
        // Si no hay elemento de error, no podemos mostrar mensajes
        if (!errorElement) return true;
        
        // Validar según el tipo de campo
        if (field.hasAttribute('required') && !field.value && field.type !== 'checkbox') {
            isValid = false;
            errorMessage = 'Este campo es obligatorio';
        } else if (field.type === 'checkbox' && field.hasAttribute('required') && !field.checked) {
            isValid = false;
            errorMessage = 'Debes aceptar para continuar';
        } else if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                errorMessage = 'Ingresa un correo electrónico válido';
            }
        } else if (field.id === 'contactName' && field.value && field.value.length < 3) {
            isValid = false;
            errorMessage = 'El nombre debe tener al menos 3 caracteres';
        } else if (field.id === 'contactDescription' && field.value && field.value.length < 10) {
            isValid = false;
            errorMessage = 'La descripción debe tener al menos 10 caracteres';
        }
        
        // Mostrar u ocultar mensaje de error
        if (!isValid) {
            field.classList.add('error-input');
            errorElement.textContent = errorMessage;
            errorElement.classList.add('show');
        } else {
            field.classList.remove('error-input');
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
        
        return isValid;
    }
    
    /**
     * Valida todos los campos del formulario
     * @returns {boolean} - Verdadero si todos los campos son válidos
     */
    function validateAllFields() {
        let isValid = true;
        
        // Validar cada campo del formulario
        for (const fieldId in errorFields) {
            const field = document.getElementById(fieldId);
            if (field) {
                // Si alguno no es válido, marcar como inválido el formulario
                if (!validateField(field)) {
                    isValid = false;
                    
                    // Añadir animación de shake
                    field.classList.add('shake');
                    setTimeout(() => {
                        field.classList.remove('shake');
                    }, 500);
                }
            }
        }
        
        return isValid;
    }
    
    /**
     * Maneja el envío del formulario
     * @param {Event} e - El evento de envío
     */
    function handleFormSubmit(e) {
        e.preventDefault();
        
        // Validar todos los campos
        if (!validateAllFields()) {
            showNotification('Por favor, completa correctamente todos los campos obligatorios', 'error');
            return;
        }
        
        // Recopilar datos del formulario
        const formData = {
            name: document.getElementById('contactName').value,
            email: document.getElementById('contactEmail').value,
            subject: document.getElementById('contactSubject').value,
            birthdate: document.getElementById('contactBirthdate').value,
            workType: document.getElementById('contactWork').value,
            description: document.getElementById('contactDescription').value,
            timestamp: new Date().toISOString(),
            privacy_accepted: document.getElementById('privacyPolicy').checked
        };
        
        // Mostrar modal de carga
        showModal();
        modalLoading.style.display = 'block';
        modalSuccess.style.display = 'none';
        modalError.style.display = 'none';
        
        // Enviar email usando EmailJS
        sendEmail(formData);
    }
    
    /**
     * Muestra u oculta el modal
     * @param {boolean} show - Indica si mostrar u ocultar el modal
     */
    function showModal(show = true) {
        if (modal) {
            if (show) {
                modal.style.display = 'flex';
                setTimeout(() => {
                    modal.classList.add('active');
                }, 10);
                
                // Agregar clase al body para evitar scroll
                document.body.classList.add('modal-open');
            } else {
                modal.classList.remove('active');
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 300);
                
                // Remover clase al body para permitir scroll
                document.body.classList.remove('modal-open');
            }
        }
    }
    
    /**
     * Cierra el modal
     */
    function closeModal() {
        showModal(false);
    }
    
    /**
     * Muestra una notificación
     * @param {string} message - El mensaje a mostrar
     * @param {string} type - El tipo de notificación (success, error, info, warning)
     */
    function showNotification(message, type = 'info') {
        if (notificationElement && notificationMessage) {
            // Establecer el icono según el tipo de notificación
            const iconElement = notificationElement.querySelector('.notification__icon i');
            if (iconElement) {
                const iconClass = {
                    'success': 'ri-check-line',
                    'error': 'ri-error-warning-line',
                    'info': 'ri-information-line',
                    'warning': 'ri-alert-line'
                }[type] || 'ri-information-line';
                
                // Actualizar clase del icono
                iconElement.className = '';
                iconElement.classList.add(iconClass);
            }
            
            // Establecer mensaje y tipo
            notificationMessage.textContent = message;
            notificationElement.className = `notification ${type}`;
            
            // Mostrar notificación
            notificationElement.classList.add('active');
            
            // Ocultar después de 5 segundos
            clearTimeout(notificationTimeout);
            notificationTimeout = setTimeout(hideNotification, 5000);
        }
    }
    
    // Variable para almacenar el temporizador de notificación
    let notificationTimeout;
    
    /**
     * Oculta la notificación
     */
    function hideNotification() {
        if (notificationElement) {
            notificationElement.classList.remove('active');
        }
    }
    
    /**
     * Envía un email usando EmailJS
     * @param {Object} formData - Los datos del formulario
     */
    function sendEmail(formData) {
        // Credentials for EmailJS
        const serviceID = 'service_zgrkhrf';
        const templateID = 'template_p8v5pdc';
        const userID = 'gIYxgJqJn4Z6ufOad';
        
        // Prepare template parameters
        const templateParams = {
            to_email: 'fabian1234andre@gmail.com',
            from_email: formData.email,
            from_name: formData.name,
            subject: formData.subject,
            birthdate: formData.birthdate,
            work_type: formData.workType,
            message: formData.description,
            timestamp: new Date().toLocaleString('es-ES'),
            current_year: new Date().getFullYear()
        };
        
        // Send email
        emailjs.send(serviceID, templateID, templateParams, userID)
            .then(function(response) {
                console.log('Email enviado correctamente:', response);
                
                // Mostrar mensaje de éxito
                modalLoading.style.display = 'none';
                modalSuccess.style.display = 'block';
                
                // Limpiar formulario
                contactForm.reset();
                
                // Reinicializar campos de fecha
                initializeDateFields();
                
                // Mostrar notificación como respaldo
                showNotification('¡Mensaje enviado con éxito! Pronto me pondré en contacto contigo.', 'success');
            })
            .catch(function(error) {
                console.error('Error al enviar email:', error);
                
                // Mostrar mensaje de error
                modalLoading.style.display = 'none';
                modalError.style.display = 'block';
                
                // Mostrar notificación como respaldo
                showNotification('Error al enviar el mensaje. Por favor, intenta de nuevo más tarde.', 'error');
            });
    }
});
/*=============== SMOOTH SCROLL ANIMATION ===============*/
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