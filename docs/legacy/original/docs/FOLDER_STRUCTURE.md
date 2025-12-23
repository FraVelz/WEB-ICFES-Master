# Estructura de Carpetas

Esta guía describe la organización del código fuente en `src/`.

## Estructura de Alto Nivel

```text
src/
├── config/         # Configuración de servicios externos (Firebase, Email)
├── features/       # Módulos de dominio (Lógica de negocio principal)
├── shared/         # Código reutilizable en toda la aplicación
├── hooks/          # Hooks globales (ej. useIsMobile)
├── styles/         # Estilos globales
├── App.jsx         # Componente raíz y configuración de rutas
└── main.jsx        # Punto de entrada de React
```

## Detalle de Carpetas

### `src/features/`
Contiene la lógica de negocio dividida por dominios. Cada carpeta aquí representa una funcionalidad completa.

*   **auth/**: Autenticación, login, registro, recuperación de contraseña.
*   **exam/**: Lógica de exámenes, simulacros, resultados.
*   **learning/**: Material de estudio, lecciones.
*   **logros/**: Gamificación, medallas, niveles.
*   **user/**: Perfil de usuario, configuración.
*   **store/**: Planes de suscripción, pagos.
*   **progress/**: Seguimiento del progreso del estudiante.

**Estructura interna de una feature:**
```text
features/nombre-feature/
├── components/     # Componentes UI específicos de esta feature
├── pages/          # Páginas (Rutas) de esta feature
├── services/       # Servicios de comunicación con API/Firebase
├── hooks/          # Hooks personalizados de esta feature
└── index.js        # (Opcional) Barril de exportaciones públicas
```

### `src/shared/`
Código agnóstico al dominio, utilidades y componentes base.

*   **components/**: UI Kit (Botones, Modales, Inputs genéricos).
*   **constants/**: Constantes globales (ej. Información de Áreas).
*   **data/**: Datos estáticos (ej. Preguntas hardcodeadas, Materiales).
*   **utils/**: Funciones puras (Formateadores, validadores).

### `src/config/`
Configuraciones de entorno y clientes de servicios.
*   `firebase.js`: Inicialización de Firebase.

### `src/core/` (⚠️ DEPRECADO)
Antigua ubicación de constantes y datos.
*   **Nota:** El contenido ha sido movido a `src/shared`. Esta carpeta está programada para eliminación.

### `src/services/` (⚠️ DEPRECADO)
Antigua ubicación centralizada de servicios.
*   `FirestoreServices.js`: Archivo legacy que re-exporta servicios.
*   **Nota:** Los servicios ahora residen dentro de sus respectivas `features`.
