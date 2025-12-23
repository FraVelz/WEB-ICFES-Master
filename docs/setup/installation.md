# Guía de Instalación y Configuración

## Requisitos Previos

Asegúrate de tener instalado:
- **Node.js** (v18+)
- **npm** o **pnpm**
- **Java Development Kit (JDK 11+)** (Para Android)
- **Android Studio** (Para emulación y compilación móvil)

## Instalación del Proyecto

1. Clonar el repositorio:
   ```bash
   git clone <url-repo>
   cd WEB-ICFES-Master
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   Crea un archivo `.env` en la raíz basado en `.env.example` (Ver [Configuración](configuration.md)).

## Setup para Desarrollo Móvil (Capacitor)

1. Inicializar Capacitor (si no está configurado):
   ```bash
   npx cap init
   ```

2. Sincronizar proyecto Android:
   ```bash
   npx cap add android
   npx cap sync
   ```

3. Variables de entorno Android:
   Asegúrate de definir `ANDROID_HOME` en tu sistema.
   ```bash
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```
