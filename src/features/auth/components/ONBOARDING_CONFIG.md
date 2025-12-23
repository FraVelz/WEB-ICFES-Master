/* GUÍA DE CONFIGURACIÓN DE AVATARES EN ONBOARDING */

// En OnboardingPage.jsx, puedes personalizar los avatares:

const avatarConfig = {
  // Avatar para la primera sección "Hola, Yo soy Zeus"
  intro1: '/avatars/logo.webp', // Cambiar a ruta de avatar con libro
  
  // Avatar para la segunda sección "Responde 5 preguntas..."
  intro2: '/avatars/logo.webp', // Cambiar a ruta de avatar saludando
};

// Ejemplos de rutas de avatares que puedes usar:
// - '/avatars/zeus-book.webp' - Avatar Zeus con libro (para intro1)
// - '/avatars/zeus-wave.webp' - Avatar Zeus saludando (para intro2)
// - '/avatars/logo.webp' - Logo por defecto

/* FLUJO DEL ONBOARDING */

1. INTRODUCCIÓN 1 (Avatar + Mensaje)
   - Muestra avatar personalizados (intro1)
   - Mensaje: "Hola, Yo soy Zeus"
   - Descripción: "Tu asistente de estudio"
   - Botón: Continuar

2. INTRODUCCIÓN 2 (Avatar + Mensaje)
   - Muestra avatar personalizado (intro2)
   - Mensaje: "Responde 5 preguntas cortas antes de comenzar"
   - Descripción: "Personalizaremos tu experiencia"
   - Botón: Continuar

3. CUESTIONARIO (5 Preguntas)
   - Pregunta 1: ¿Cuál es tu objetivo principal?
   - Pregunta 2: ¿En cuánto tiempo planeas presentar el ICFES?
   - Pregunta 3: ¿Cuál es tu nivel actual?
   - Pregunta 4: ¿Cuáles son tus áreas débiles?
   - Pregunta 5: ¿Cuánto tiempo disponible tienes para estudiar?

4. COMPLETACIÓN
   - Muestra mensaje de éxito con avatar
   - Botón: Ir al Registro
   - Redirecciona a SignupPage

/* CARACTERÍSTICAS */

✅ 2 Secciones de introducción con avatar dinámico
✅ Avatar personalizable para cada sección
✅ Mensaje y descripción personalizables
✅ Botón continuar en cada sección
✅ Transiciones suaves entre secciones
✅ Responde obligatoriamente antes de continuar
✅ Botón atrás/siguiente en el cuestionario
✅ Barra de progreso
✅ Guardado de respuestas en sessionStorage
✅ Redirección automática al registro

/* TIPS PARA PERSONALIZAR AVATARES */

Para cambiar los avatares, necesitas:
1. Tener los archivos de imagen en la carpeta /public/avatars/
2. Actualizar las rutas en OnboardingPage.jsx:

   const avatarConfig = {
     intro1: '/avatars/tu-avatar-1.webp',
     intro2: '/avatars/tu-avatar-2.webp',
   };

3. Los avatares se mostrarán usando el componente MascotaCircle
   que proporciona un marco circular elegante
