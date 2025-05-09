// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

mobileMenuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuToggle.innerHTML = navLinks.classList.contains('active')
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
});

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
let currentTheme = localStorage.getItem('theme') || 'light';

// Set initial theme
body.setAttribute('data-theme', currentTheme);
updateThemeIcon();

themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
});

function updateThemeIcon() {
    themeToggle.innerHTML = currentTheme === 'light'
        ? '<i class="fas fa-moon"></i>'
        : '<i class="fas fa-sun"></i>';
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
        });

        // Close mobile menu if open
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
});

// Command Tabs
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        tabButtons.forEach(btn => btn.classList.remove('active'));

        // Add active class to clicked button
        button.classList.add('active');

        // Hide all tab contents
        tabContents.forEach(content => content.classList.remove('active'));

        // Show the corresponding tab content
        const tabId = button.getAttribute('data-tab') + '-tab';
        document.getElementById(tabId).classList.add('active');
    });
});

// Testimonial Slider
const testimonialSlides = document.querySelector('.testimonial-slides');
const testimonialDots = document.querySelectorAll('.testimonial-dot');
let currentSlide = 0;

function goToSlide(slideIndex) {
    testimonialSlides.style.transform = `translateX(-${slideIndex * 100}%)`;

    // Update active dot
    testimonialDots.forEach(dot => dot.classList.remove('active'));
    testimonialDots[slideIndex].classList.add('active');

    currentSlide = slideIndex;
}

// Set up dot navigation
testimonialDots.forEach((dot, index) => {
    dot.addEventListener('click', () => goToSlide(index));
});

// Auto-advance slides
setInterval(() => {
    currentSlide = (currentSlide + 1) % testimonialDots.length;
    goToSlide(currentSlide);
}, 5000);


//sistema de carga

// Sistema de Carga
document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.querySelector('.preloader');
    
    // Simular tiempo de carga (puedes ajustar esto)
    setTimeout(() => {
        preloader.classList.add('hidden');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }, 3000);
});

// Sistema de Notificación de Errores
function showError(message) {
    const errorNotification = document.getElementById('error-notification');
    const errorMessage = document.getElementById('error-message');
    
    // Establecer mensaje de error
    errorMessage.textContent = message || 'Ha ocurrido un error inesperado.';
    
    // Mostrar notificación
    errorNotification.classList.add('show');
    
    // Añadir efecto de shake
    errorNotification.classList.add('error-shake');
    setTimeout(() => {
        errorNotification.classList.remove('error-shake');
    }, 500);
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
        hideError();
    }, 5000);
}

function hideError() {
    const errorNotification = document.getElementById('error-notification');
    errorNotification.classList.remove('show');
}

// Manejador para el botón de cerrar
document.getElementById('error-close').addEventListener('click', hideError);

// Ejemplo de uso:
// En caso de error en alguna operación, puedes llamar:
// showError('No se pudo cargar la información del servidor.');

// Para probar el sistema de errores, descomenta esta línea:
// setTimeout(() => { showError('Esta es una notificación de prueba.'); }, 5000);

// Ejemplo de captura de errores en fetch
window.addEventListener('error', function(e) {
    showError('Error en la página: ' + e.message);
});