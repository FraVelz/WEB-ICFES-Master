# Arquitectura del Proyecto WEB-ICFES-Master

## Visión General
Este proyecto es una aplicación web educativa construida con **React** y **Firebase**. La arquitectura sigue un enfoque **Feature-Based** (basado en características) con una capa **Shared** (compartida) robusta, diseñada para escalar y facilitar el mantenimiento a largo plazo.

> **Nota de Transición:** Actualmente el proyecto se encuentra en un proceso de refactorización para consolidar utilidades en `shared` y eliminar dependencias centralizadas heredadas.

## Principios de Diseño

1.  **Modularidad por Features:** Cada característica principal (Auth, Exam, Learning, etc.) vive en su propio directorio dentro de `src/features/`. Esto encapsula la lógica, UI y servicios específicos de ese dominio.
2.  **Separación de Responsabilidades:**
    *   **UI (Components/Pages):** Solo se encargan de renderizar y manejar eventos de usuario. No acceden directamente a Firebase.
    *   **Servicios (Services):** Encapsulan toda la lógica de comunicación con Firebase (Firestore, Auth).
    *   **Hooks:** Manejan la lógica de estado y efectos secundarios, conectando UI con Servicios.
3.  **Alias de Importación:** Se utiliza `@/` para referenciar `src/`, evitando imports relativos profundos (`../../../`).
4.  **Componentes "Dumb" en Shared:** Los componentes en `src/shared/ui` deben ser puramente presentacionales y reutilizables.

## Flujo de Datos

1.  **Usuario** interactúa con la **UI** (Page/Component).
2.  **UI** invoca un **Hook** o llama a un método de un **Servicio**.
3.  **Servicio** interactúa con **Firebase** (Auth/Firestore).
4.  **Firebase** retorna datos.
5.  **Servicio** formatea/valida datos y los devuelve.
6.  **UI** actualiza su estado y renderiza.

## Estado de la Arquitectura (Transición)

### Deprecación de `src/core`
La carpeta `src/core` contenía constantes y datos estáticos. Estos han sido migrados a `src/shared/constants` y `src/shared/data`.
*   **Estado:** `src/core` existe pero no debe usarse para nuevo código.
*   **Acción:** Usar `@/shared/constants` y `@/shared/data`.

### Deprecación de `src/services/FirestoreServices.js`
Antiguamente existía un archivo centralizado que re-exportaba todos los servicios.
*   **Estado:** Aún existe por compatibilidad.
*   **Acción:** Importar servicios directamente de su feature (ej. `import AuthService from '@/features/auth/services/AuthService'`).

## Tecnologías Clave
*   **Frontend:** React, Vite, TailwindCSS.
*   **Backend/BaaS:** Firebase (Auth, Firestore, Hosting).
*   **Routing:** React Router DOM.
