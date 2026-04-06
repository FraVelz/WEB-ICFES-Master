/**
 * Custom email copy configuration
 * Safe to edit these strings as needed
 */

export const EMAIL_MESSAGES = {
  // Password recovery email subject line
  resetPassword: {
    subject: '🔐 Recupera tu contraseña - ICFES Master',
    title: 'Recuperar tu Contraseña',
    greeting: 'Hola,',
    intro: 'Recibimos una solicitud para restablecer tu contraseña en ICFES Master.',
    instructions: 'Haz clic en el siguiente enlace para crear una nueva contraseña:',
    buttonText: 'Restablecer Contraseña',
    expirationWarning: 'Este enlace expirará en 1 hora por razones de seguridad.',
    safetyNotice: 'Si no solicitaste este cambio, puedes ignorar este email de forma segura.',
    footer: '© 2025 ICFES Master - Todos los derechos reservados',
    notRecognize: 'Si no reconoces esta actividad, cambia tu contraseña inmediatamente.',
  },

  // Forgot-password page copy
  forgotPasswordPage: {
    headerTitle: 'Recuperar Contraseña',
    headerSubtitle: 'Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña',
    emailLabel: 'Email',
    emailPlaceholder: 'tu@email.com',
    errorEmailNotRegistered: 'Este correo no está registrado en nuestra base de datos',
    errorSendingEmail: 'Error al enviar el email de recuperación',
    buttonText: 'Verificar y Enviar Email',
    buttonLoadingText: 'Verificando...',
    backToLogin: 'Volver al login',

    // Step 2 — success
    successTitle: '¡Email Enviado!',
    successMessage: 'Revisa tu bandeja de entrada. Te hemos enviado un enlace para restablecer tu contraseña.',
    importantLabel: 'Importante:',
    importanceList: [
      'El enlace expirará en 1 hora',
      'Si no ves el email, revisa tu carpeta de spam',
      'No compartas el enlace con otros',
    ],
    useAnotherEmailButton: '¿Usar otro email?',
  },

  // Reset-password page copy
  resetPasswordPage: {
    title: 'Nueva Contraseña',
    subtitle: 'Ingresa una nueva contraseña segura para tu cuenta',
    newPasswordLabel: 'Nueva Contraseña',
    confirmPasswordLabel: 'Confirmar Contraseña',
    passwordPlaceholder: '••••••••',

    // Validation messages
    errorEmptyFields: 'Por favor, completa todos los campos',
    errorPasswordTooShort: 'La contraseña debe tener al menos 6 caracteres',
    errorPasswordNoUppercase: 'Debe contener al menos una mayúscula',
    errorPasswordNoNumber: 'Debe contener al menos un número',
    errorPasswordsDoNotMatch: 'Las contraseñas no coinciden',
    errorExpiredLink: 'El enlace de recuperación ha expirado. Por favor, solicita uno nuevo.',
    errorInvalidLink: 'El enlace es inválido. Por favor, solicita uno nuevo.',
    errorGeneric: 'Error al resetear contraseña. Por favor, intenta de nuevo.',

    // Requirements
    requirementsTitle: 'Requisitos:',
    requirement1: 'Al menos 6 caracteres',
    requirement2: 'Al menos una mayúscula',
    requirement3: 'Al menos un número',
    requirement4: 'Las contraseñas coinciden',

    buttonText: 'Restablecer Contraseña',
    buttonLoadingText: 'Restableciendo...',

    // Success
    successTitle: '¡Contraseña Restablecida!',
    successMessage: 'Tu contraseña ha sido actualizada correctamente. Serás redirigido al login en unos momentos.',
    goToLoginButton: 'Ir al Login',
  },
};

export default EMAIL_MESSAGES;
