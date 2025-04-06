// auth.js - Sistema de autenticación para la web de AndreSM

document.addEventListener('DOMContentLoaded', function () {
    // Constantes para estados y errores
    const ERROR_MESSAGES = {
        WEAK_PASSWORD: 'La contraseña debe tener al menos 8 caracteres con letras, números y símbolos.',
        PASSWORD_MISMATCH: 'Las contraseñas no coinciden.',
        EMAIL_INVALID: 'Por favor, ingresa un correo electrónico válido.',
        NETWORK_ERROR: 'Error de conexión. Por favor, verifica tu conexión a internet.',
        SERVER_ERROR: 'Error del servidor. Por favor, intenta más tarde.',
        UNAUTHORIZED: 'Credenciales inválidas. Por favor, verifica tus datos.',
        DEFAULT: 'Ha ocurrido un error. Por favor, intenta nuevamente.'
    };
    
    const PASSWORD_STRENGTH = {
        0: { text: 'Muy débil', class: 'very-weak' },
        1: { text: 'Débil', class: 'weak' },
        2: { text: 'Media', class: 'medium' },
        3: { text: 'Fuerte', class: 'strong' },
        4: { text: 'Muy fuerte', class: 'very-strong' }
    };
    // Elementos de los modales
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    const connectionError = document.getElementById('connectionError');
    
    // Botones de usuario en la navegación
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const userProfile = document.getElementById('userProfile');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Botones y enlaces para cambiar entre modales
    const closeLoginModal = document.getElementById('closeLoginModal');
    const closeRegisterModal = document.getElementById('closeRegisterModal');
    const closeForgotModal = document.getElementById('closeForgotModal');
    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const backToLogin = document.getElementById('backToLogin');
    const retryConnection = document.getElementById('retryConnection');
    
    // Formularios
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    
    // Sistema de notificaciones
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');
    const notificationClose = document.getElementById('notificationClose');
    
    // URL base para la API (ajustar según corresponda)
    const API_URL = 'https://api.andresm.com';
    
    // Comprobar si hay un token de sesión válido al cargar la página
    checkAuthStatus();

    // ----------------------
    // FUNCIONES DE AUTENTICACIÓN
    // ----------------------
    
    // Comprobar el estado de autenticación
    function checkAuthStatus() {
        // Verificar si hay token en localStorage o sessionStorage
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        
        if (token) {
            try {
                // Verificar el token con el servidor
                fetch(`${API_URL}/verify-token`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Token inválido');
                    }
                })
                .then(data => {
                    // Si el token es válido, mostrar interfaz de usuario autenticado
                    showUserProfile(data.user);
                })
                .catch(error => {
                    // Si el token es inválido, eliminar y mostrar interfaz de invitado
                    console.error('Error de verificación:', error);
                    logout();
                });
            } catch (error) {
                console.error('Error al verificar sesión:', error);
                showConnectionError();
            }
        } else {
            // Mostrar interfaz de invitado si no hay token
            showGuestInterface();
        }
    }
    
    // Iniciar sesión
    async function login(email, password, rememberMe) {
        try {
            // Validar entrada
            if (!validateEmail(email)) {
                showFormError('loginEmailError', ERROR_MESSAGES.EMAIL_INVALID);
                return false;
            }
            
            // Aquí se realizaría la petición al servidor
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            if (response.ok) {
                const data = await response.json();
                
                // Guardar token de autenticación
                if (rememberMe) {
                    localStorage.setItem('authToken', data.token);
                } else {
                    sessionStorage.setItem('authToken', data.token);
                }
                
                // Guardar datos básicos del usuario
                localStorage.setItem('userData', JSON.stringify({
                    name: data.user.name,
                    email: data.user.email,
                    avatar: data.user.avatar
                }));
                
                // Mostrar perfil de usuario
                showUserProfile(data.user);
                closeModal(loginModal);
                showNotification('¡Inicio de sesión exitoso! Bienvenido de nuevo.', 'success');
                return true;
            } else if (response.status === 401) {
                throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
            } else if (response.status >= 500) {
                throw new Error(ERROR_MESSAGES.SERVER_ERROR);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || ERROR_MESSAGES.DEFAULT);
            }
        } catch (error) {
            console.error('Error de inicio de sesión:', error);
            if (error.message.includes('Failed to fetch')) {
                showConnectionError();
            } else {
                showFormError('loginPasswordError', error.message);
            }
            return false;
        }
    }})