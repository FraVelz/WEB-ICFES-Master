# Guía: Personalizar Avatares en Onboarding

## 📋 Descripción General

El sistema de onboarding ahora incluye 2 secciones de introducción antes del cuestionario:

### Sección 1: "Hola, Yo soy Zeus"
- Avatar personalizable
- Descripción: "Tu asistente de estudio"
- Botón: Continuar

### Sección 2: "Responde 5 preguntas cortas antes de comenzar"
- Avatar personalizable
- Descripción: "Personalizaremos tu experiencia"
- Botón: Continuar

## 🎨 Cómo Cambiar los Avatares

### Paso 1: Coloca tus archivos de imagen
Coloca tus imágenes de avatares en la carpeta:
```
/public/avatars/
```

Ejemplos de nombres útiles:
- `zeus-book.webp` - Avatar con libro (para intro1)
- `zeus-wave.webp` - Avatar saludando (para intro2)
- `zeus-default.webp` - Avatar por defecto

### Paso 2: Actualiza OnboardingPage.jsx

Abre el archivo:
```
src/features/auth/pages/OnboardingPage.jsx
```

Busca esta sección:
```javascript
const avatarConfig = {
  intro1: '/avatars/logo.webp', // Avatar para "Hola, Yo soy Zeus"
  intro2: '/avatars/logo.webp', // Avatar para "Responde 5 preguntas..."
};
```

Cambia las rutas a tus propios avatares:
```javascript
const avatarConfig = {
  intro1: '/avatars/zeus-book.webp',      // Mismo avatar para ambas secciones
  intro2: '/avatars/zeus-wave.webp',      // O avatares diferentes
};
```

## 🔄 Flujo Completo del Onboarding

```
┌─────────────────────────────┐
│   INTRODUCCIÓN 1            │
│  (Avatar + Mensaje Zeus)    │
│                             │
│  👤 [Avatar Circle]         │
│                             │
│  "Hola, Yo soy Zeus"        │
│  Tu asistente de estudio    │
│                             │
│  [Continuar →]              │
└─────────────────────────────┘
           ↓
┌─────────────────────────────┐
│   INTRODUCCIÓN 2            │
│  (Avatar + Mensaje Preguntas)│
│                             │
│  👤 [Avatar Circle]         │
│                             │
│  "Responde 5 preguntas..." │
│  Personalizaremos tu exp.   │
│                             │
│  [Continuar →]              │
└─────────────────────────────┘
           ↓
┌─────────────────────────────┐
│   CUESTIONARIO (5Q)         │
│                             │
│  Pregunta 1 de 5 [████░░░░] │
│  ¿Cuál es tu objetivo?      │
│  □ Pasar ICFES              │
│  □ Obtener puntaje excel    │
│  □ A mi propio ritmo        │
│  □ Mejorar debilidades      │
│                             │
│  [Atrás] [Siguiente →]      │
└─────────────────────────────┘
           ↓
┌─────────────────────────────┐
│   COMPLETACIÓN              │
│                             │
│  ✓ [Success Circle]         │
│                             │
│  ¡Perfecto!                 │
│  Crearemos tu cuenta...     │
│                             │
│  [Ir al Registro →]         │
└─────────────────────────────┘
           ↓
     SignupPage
```

## 📝 Personalización Adicional

### Cambiar Mensajes
Si quieres cambiar los textos de las introducciones, abre:
```
src/features/auth/components/OnboardingQuiz.jsx
```

Busca `INTRODUCTION_SECTIONS` y modifica:
```javascript
const INTRODUCTION_SECTIONS = [
  {
    id: 1,
    message: 'Tu texto personalizado aquí',
    avatar: '/avatars/tu-avatar-1.webp',
    description: 'Tu descripción aquí',
  },
  {
    id: 2,
    message: 'Otro texto personalizado',
    avatar: '/avatars/tu-avatar-2.webp',
    description: 'Otra descripción aquí',
  },
];
```

### Cambiar Preguntas
Dentro del mismo archivo, busca `ONBOARDING_QUESTIONS` y edita:
```javascript
const ONBOARDING_QUESTIONS = [
  {
    id: 1,
    question: 'Tu pregunta aquí',
    type: 'single', // o 'multiple'
    options: [
      { value: 'id', label: 'Opción 1' },
      { value: 'id', label: 'Opción 2' },
      // ...
    ],
  },
  // ... más preguntas
];
```

## ✅ Características Implementadas

- ✅ 2 secciones de introducción con avatar dinámico
- ✅ Avatar personalizable para cada sección
- ✅ Mensaje y descripción personalizables
- ✅ Botón continuar en cada sección (pegado abajo)
- ✅ Transiciones suaves entre secciones
- ✅ 5 preguntas del cuestionario
- ✅ Navegación con botones Atrás/Siguiente
- ✅ Barra de progreso visual
- ✅ Validación de respuestas obligatorias
- ✅ Respuestas guardadas en sessionStorage
- ✅ Redirección automática al registro
- ✅ Diseño responsivo (móvil y desktop)

## 🚀 Ejemplo Completo

**OnboardingPage.jsx personalizado:**
```javascript
const avatarConfig = {
  intro1: '/avatars/zeus-book.webp',      // Tema: Estudiando
  intro2: '/avatars/zeus-excited.webp',   // Tema: Emocionado de empezar
};
```

**Resultado:**
- Usuario ve a Zeus con un libro presentándose
- Luego ve a Zeus emocionado invitándolo a responder preguntas
- Responde 5 preguntas personalizadas
- Ve mensaje de éxito
- Se redirecciona al registro

## 💡 Tips

1. **Usa WebP**: Los archivos .webp son más ligeros que PNG/JPG
2. **Nombra descriptivamente**: Usa nombres como `zeus-book.webp`, `zeus-wave.webp`
3. **Tamaño recomendado**: 400x400px o 500x500px para avatares
4. **Prueba responsivo**: Verifica en móvil y desktop

## 📞 Soporte

Si necesitas cambiar otras partes del onboarding, los archivos principales son:

- `src/features/auth/components/OnboardingQuiz.jsx` - Componente principal
- `src/features/auth/pages/OnboardingPage.jsx` - Página que maneja el flujo
- `src/features/auth/pages/SignupPage.jsx` - Página final de registro
