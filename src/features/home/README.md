# HomePage - Estructura Factorizada

## Descripción General

El componente `HomePage.jsx` ha sido completamente factorizado para mejorar la mantenibilidad, legibilidad y escalabilidad. La estructura está organizada en:

- **Componentes de Sección**: Cada sección de la página es un componente independiente
- **Archivos de Datos**: Constantes y datos centralizados
- **Hooks Reutilizables**: Lógica compartida en hooks personalizados

## Estructura de Carpetas

```
src/features/home/
 pages/
    HomePage.jsx          # Componente principal (líneas reducidas: ~100)
 components/
    HeroSection.jsx        # Sección hero con CTA
    MascotSection.jsx      # Sección de mascota
    AreasSection.jsx       # Sección de 5 áreas
    FeaturesSection.jsx    # Sección "Por qué nosotros"
    TestimonialsSection.jsx # Sección de testimonios
    FAQSection.jsx         # Sección de preguntas frecuentes
    FinalCTASection.jsx    # CTA final
    DemoModal.jsx          # Modal de demostración
    HowToUseModal.jsx      # Modal de instrucciones
    index.js               # Exportaciones
 data/
    areas.js               # Constante AREAS
    features.js            # Constante WHY_CHOOSE_US
    testimonials.js        # Constante TESTIMONIALS
    pricing.js             # Constante PRICING_PLANS
    faqs.js                # Constante FAQS
    index.js               # Exportaciones centralizadas
 hooks/
    animations.js          # Lógica de animaciones y utilidades
 DonationSection.jsx        # Componente de donación
```

## Componentes

### HeroSection.jsx

- **Props**: `isInitialLoad`, `onDemoAccess`
- **Responsabilidad**: Mostrar el banner principal, título, subtitle y CTA
- **Líneas**: ~80

### MascotSection.jsx

- **Props**: `isInitialLoad`
- **Responsabilidad**: Mostrar la mascota con descripción
- **Líneas**: ~40

### AreasSection.jsx

- **Props**: `isInitialLoad`, `areasSection`
- **Responsabilidad**: Mostrar tarjetas de 5 áreas y CTA de simulacro
- **Líneas**: ~70

### FeaturesSection.jsx

- **Props**: `isInitialLoad`, `whyChooseSection`
- **Responsabilidad**: Mostrar 6 características principales
- **Líneas**: ~35

### TestimonialsSection.jsx

- **Props**: `isInitialLoad`, `testimonialSection`
- **Responsabilidad**: Mostrar testimonios de estudiantes
- **Líneas**: ~40

### FAQSection.jsx

- **Props**: `isInitialLoad`, `faqSection`, `expandedFaq`, `setExpandedFaq`
- **Responsabilidad**: Mostrar preguntas frecuentes con acordeón
- **Líneas**: ~45

### FinalCTASection.jsx

- **Responsabilidad**: CTA final sin props
- **Líneas**: ~20

### DemoModal.jsx

- **Props**: `isDemoOpen`, `setIsDemoOpen`, `demoTimeLeft`, `onStartDemo`
- **Responsabilidad**: Modal de demostración con timer
- **Líneas**: ~80

### HowToUseModal.jsx

- **Props**: `isOpen`, `onClose`
- **Responsabilidad**: Modal de instrucciones de uso
- **Líneas**: ~15

## Archivos de Datos

### areas.js

Exporta `AREAS` con 5 objetos:

- lectura-critica
- matematicas
- ciencias-naturales
- sociales-ciudadanas
- ingles

### features.js

Exporta `WHY_CHOOSE_US` con 6 características

### testimonials.js

Exporta `TESTIMONIALS` con 3 testimonios

### pricing.js

Exporta `PRICING_PLANS` con 3 planes (Básico, Premium, Pro)

### faqs.js

Exporta `FAQS` con 4 preguntas frecuentes

## Hooks Personalizados

### animations.js

- **getAnimationStyle(isVisible, isInitialLoad, delay)**: Calcula estilos de animación
- **useDemoMode()**: Hook que exporta `formatTime` para formato de tiempo

## HomePage.jsx Principal

Ahora es limpio y legible:

```jsx
export const HomePage = () => {
  // Estados básicos
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [demoTimeLeft, setDemoTimeLeft] = useState(180);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Hooks de animación
  const areasSection = useScrollAnimation();
  const whyChooseSection = useScrollAnimation();
  const testimonialSection = useScrollAnimation();
  const faqSection = useScrollAnimation();

  // useEffects (lógica)
  // ... handlers

  return (
    <div>
      <HeroSection ... />
      <MascotSection ... />
      <AreasSection ... />
      <FeaturesSection ... />
      <TestimonialsSection ... />
      <PricingPlans ... />
      <FAQSection ... />
      <FinalCTASection />
      <DonationSection />

      <HowToUseModal ... />
      <DemoModal ... />
    </div>
  );
};
```

## Ventajas de la Factorización

**Separación de Responsabilidades**: Cada componente tiene una tarea clara
**Reutilización**: Los componentes pueden usarse en otros contextos
**Mantenimiento**: Cambios localizados sin afectar todo
**Testing**: Más fácil de testear componentes individuales
**Legibilidad**: Código más limpio y organizado
**Escalabilidad**: Fácil agregar nuevas secciones o datos

## Cómo Usar

```jsx
import { HomePage } from '@/features/home/pages';

// ... en tu router
<Route path="/" element={<HomePage />} />;
```

## Importaciones Centralizadas

### Para acceder a datos:

```jsx
import {
  AREAS,
  WHY_CHOOSE_US,
  FAQS,
  TESTIMONIALS,
  PRICING_PLANS,
} from '@/features/home/data';
```

### Para acceder a componentes:

```jsx
import {
  HeroSection,
  MascotSection,
  AreasSection,
} from '@/features/home/components';
```

### Para acceder a utilidades:

```jsx
import {
  getAnimationStyle,
  useDemoMode,
} from '@/features/home/hooks/animations';
```

## Próximas Mejoras (Opcionales)

- Crear hook `useDemoTimer` para lógica del timer de demo
- Agregar tests unitarios para cada componente
- Crear componentes aún más granulares si es necesario
- Agregar validación de props con PropTypes o TypeScript
