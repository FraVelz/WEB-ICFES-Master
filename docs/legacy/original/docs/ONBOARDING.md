# Guía de Onboarding (30 Minutos)

Bienvenido al equipo de desarrollo de **WEB-ICFES-Master**. Esta guía te ayudará a entender el proyecto rápidamente.

## 1. Primeros Pasos (5 min)

1.  **Instalación:** Asegúrate de tener Node.js instalado. Ejecuta `npm install` o `pnpm install`.
2.  **Ejecución:** Usa `npm run dev` para levantar el servidor de desarrollo.
3.  **Entorno:** Verifica que tienes las variables de entorno de Firebase configuradas (si aplica).

## 2. Entendiendo la Arquitectura (10 min)

El proyecto usa una arquitectura **Feature-Based**.
*   Si buscas algo relacionado con **Login**, ve a `src/features/auth`.
*   Si buscas algo relacionado con **Exámenes**, ve a `src/features/exam`.

**Regla de Oro:**
> No importes directamente desde `firebase/firestore` o `firebase/auth` en tus componentes UI. Usa los **Servicios** definidos en `features/*/services`.

## 3. Tareas Comunes (15 min)

### Crear una nueva Página
1.  Crea el componente en `src/features/[feature]/pages/MiPagina.jsx`.
2.  Agrégalo al router en `src/App.jsx`.

### Conectar con Firebase
1.  Busca el servicio correspondiente en `src/features/[feature]/services/`.
2.  Si no existe, crea una clase servicio (ej. `MiFeatureService.js`) e implementa los métodos.
3.  Importa el servicio en tu componente/hook.

### Usar Componentes Compartidos
Revisa `src/shared/components` antes de crear un botón o modal nuevo. Es probable que ya exista.

## Puntos de Atención (Refactorización en Curso)

Estamos migrando de una estructura antigua a una nueva.
*   **Evita usar:** `src/core` y `src/services/FirestoreServices.js`.
*   **Prefiere:** `src/shared` y servicios específicos por feature.
*   **Imports:** Usa siempre el alias `@/` (ej. `@/shared/components/...`).

## Glosario Rápido
*   **Feature:** Un módulo funcional (Auth, Exam).
*   **Shared:** Código compartido y utilidades.
*   **Service:** Clase que maneja la lógica de base de datos.
