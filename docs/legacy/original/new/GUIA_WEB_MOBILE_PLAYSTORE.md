# 📱 GUÍA COMPLETA: Web + App Móvil (Capacitor) + Play Store

## 📋 Tabla de Contenidos
1. [Configuración Inicial](#configuración-inicial)
2. [Setup Capacitor](#setup-capacitor)
3. [Compilar para Web](#compilar-para-web)
4. [Build para Android](#build-para-android)
5. [Subir a Play Store](#subir-a-play-store)
6. [Hosting Web](#hosting-web)
7. [Actualizar la App](#actualizar-la-app)

---

## 🚀 CONFIGURACIÓN INICIAL

### Paso 1: Requisitos Previos

Necesitas tener instalado:

```bash
# Node.js (v18+)
node --version

# npm o pnpm
npm --version
# o
pnpm --version

# Java Development Kit (JDK 11+)
java -version

# Android Studio (para emulador y SDK)
# Descarga desde: https://developer.android.com/studio

# Git
git --version
```

### Paso 2: Variables de Entorno (Android)

Después de instalar Android Studio, agrega a tu `.bashrc`, `.zshrc` o variables de entorno:

```bash
# En ~/.zshrc (macOS/Linux) o panel de control (Windows)
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin:$ANDROID_HOME/platform-tools
```

Luego recarga:
```bash
source ~/.zshrc
# o en Windows, reinicia la terminal
```

---

## ⚙️ SETUP CAPACITOR

### Paso 3: Instalar Capacitor

```bash
cd /home/fravelz/Documentos/WEB-ICFES-Master

# Instalar Capacitor CLI globalmente
npm install -g @capacitor/cli

# O con pnpm
pnpm add -g @capacitor/cli

# Instalar Capacitor localmente en el proyecto
npm install @capacitor/core @capacitor/cli

# Instalar iOS y Android (solo Android es obligatorio para Play Store)
npm install @capacitor/android
npm install @capacitor/ios  # Opcional, solo si quieres app para iOS
```

### Paso 4: Inicializar Capacitor

```bash
# En la raíz del proyecto
npx cap init

# Te pedirá:
# App name: Pruebas ICFES
# App Package ID: com.icfes.pruebas
# Default directory: dist  (deja por defecto, es donde va el build)
# Overwrite capacitor.config.ts? y
```

Esto creará `capacitor.config.ts`

### Paso 5: Configurar capacitor.config.ts

Abre `/capacitor.config.ts` y asegúrate de que esté así:

```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.icfes.pruebas',
  appName: 'Pruebas ICFES',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
};

export default config;
```

---

## 🌐 COMPILAR PARA WEB

### Paso 6: Build Web Optimizado

```bash
# Generar build para producción
npm run build

# O con pnpm
pnpm build

# Esto crea la carpeta dist/ con tu app web lista
```

La carpeta `dist/` es la que subirás a hosting.

---

## 📦 BUILD PARA ANDROID

### Paso 7: Preparar Android

```bash
# Agregar plataforma Android a Capacitor
npx cap add android

# Esto crea la carpeta android/ con el proyecto nativo
```

### Paso 8: Copiar Build a Android

Después de compilar:

```bash
# Copiar dist/ al proyecto Android
npx cap copy android

# Sincronizar todo
npx cap sync android
```

### Paso 9: Abrir en Android Studio

```bash
# Abrir Android Studio para compilar
npx cap open android
```

Esto abrirá Android Studio. En Android Studio:

1. Espera a que se sincronice Gradle (puede tardar 2-5 min)
2. Ve a **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
3. Espera a que compile (5-10 minutos)
4. Verás un mensaje: "Build successful"

El APK estará en: `android/app/build/outputs/apk/debug/app-debug.apk`

### Paso 10: Build Release para Play Store

Esto es **MÁS IMPORTANTE**:

```bash
# En Android Studio:
# Build → Build Bundle(s) / APK(s) → Build Bundle(s)
# O desde terminal:
cd android
./gradlew bundleRelease
cd ..
```

El Bundle estará en: `android/app/build/outputs/bundle/release/app-release.aab`

---

## 🎯 SUBIR A PLAY STORE

### Paso 11: Crear Cuenta de Desarrollador Google Play

1. Ve a: https://play.google.com/console/
2. Haz clic en **"Crear cuenta"**
3. Paga $25 USD (es de una sola vez)
4. Completa tu perfil como desarrollador

### Paso 12: Crear Aplicación en Play Console

1. En Play Console, haz clic en **"Crear aplicación"**
2. Nombre: **Pruebas ICFES**
3. Selecciona **Aplicación**
4. Acepta las políticas

### Paso 13: Generar Firma Digital (Key Store)

**IMPORTANTE: Este proceso solo se hace UNA VEZ**

En Android Studio:
1. Ve a **Build** → **Generate Signed Bundle/APK**
2. Selecciona **Android App Bundle**
3. Haz clic en **New** para crear nueva keystore
4. Rellena:
   - **Key store path**: `~/my-release-key.keystore`
   - **Password**: Crea una contraseña fuerte (guárdala)
   - **Key alias**: `my-key-alias`
   - **Key password**: (misma contraseña)
   - **Validity**: 50 años
5. Haz clic en **Create**

**NUNCA PIERDAS ESTE ARCHIVO** (`my-release-key.keystore`). Lo necesitarás para actualizar la app.

### Paso 14: Crear Build Firmado

Después de crear el keystore:

1. En **"Choose destination folder"**: selecciona una carpeta
2. Haz clic en **Create**
3. Android Studio compilará y firmará el bundle

Resultado: `app-release.aab` firmado

### Paso 15: Subir a Play Store

En Play Console:

1. Ve a **Gestión de versiones** → **Producción**
2. Haz clic en **Crear versión**
3. Carga el archivo `.aab` que generaste
4. Completa:
   - **Notas de la versión**: "Primera versión de Pruebas ICFES"
   - **Número de versión**: 1.0.0
5. Revisa y **Enviar para revisión**

Google revisará (24-48 horas) y publicará.

---

## 🌍 HOSTING WEB

### Opción 1: Firebase Hosting (RECOMENDADO - Gratis)

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Autenticarse
firebase login

# Inicializar Firebase
firebase init hosting

# Te pregunta:
# Select a default Firebase project: (elige tu proyecto)
# What do you want to use as your public directory? dist
# Configure as a single-page app? y
# Set up automatic builds and deploys with GitHub? (opcional)

# Deploy
firebase deploy
```

Tu app estará en: `https://tu-proyecto.web.app`

### Opción 2: Netlify (TAMBIÉN GRATIS)

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Autenticarse
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

Tu app estará en un dominio de Netlify.

### Opción 3: GitHub Pages

```bash
# Agregar a package.json:
"deploy": "npm run build && gh-pages -d dist"

# Instalar gh-pages
npm install -g gh-pages

# Deploy
npm run deploy
```

Tu app estará en: `https://tu-usuario.github.io/WEB-ICFES-Master`

---

## 🔄 ACTUALIZAR LA APP

### Actualizar Versión Web

```bash
# Hacer cambios en el código
npm run build
firebase deploy
# o
netlify deploy --prod --dir=dist
```

### Actualizar App Móvil

```bash
# 1. Hacer cambios
# 2. Compilar
npm run build

# 3. Copiar cambios a Android
npx cap copy android
npx cap sync android

# 4. Abrir en Android Studio
npx cap open android

# 5. Build → Build Bundle(s) / APK(s) → Build Bundle(s)
# (Usa el mismo keystore de antes)

# 6. En Play Console:
#    - Ve a Gestión de versiones
#    - Crea nueva versión
#    - Sube el .aab
#    - Incrementa número de versión (1.0.1, 1.0.2, etc.)
```

---

## 📊 ESTRUCTURA FINAL

```
WEB-ICFES-Master/
├── src/                    ← Código fuente
├── dist/                   ← Build web (para hosting)
├── android/                ← Proyecto Android (Capacitor)
├── package.json
├── capacitor.config.ts     ← Config de Capacitor
└── my-release-key.keystore ← Firma (MANTENER SEGURO)
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Configuración Inicial
- [ ] Descargar Android Studio
- [ ] Instalar JDK
- [ ] Configurar variables de entorno (ANDROID_HOME)
- [ ] Instalar Capacitor

### Web
- [ ] `npm run build` genera dist/
- [ ] Subir dist/ a Firebase Hosting
- [ ] Verificar sitio web funciona

### App Móvil
- [ ] `npx cap add android`
- [ ] `npx cap copy android && npx cap sync android`
- [ ] Probar en emulador Android
- [ ] Generar keystore (UNA SOLA VEZ)
- [ ] Crear app en Google Play Console
- [ ] Generar bundle firmado (.aab)

### Play Store
- [ ] Cuenta de desarrollador Google ($25)
- [ ] Crear aplicación en Play Console
- [ ] Subir bundle firmado
- [ ] Llenar tienda (descripciones, screenshots)
- [ ] Enviar para revisión

---

## 🐛 TROUBLESHOOTING

### Error: "ANDROID_HOME not set"
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools
```

### Error: "Gradle sync failed"
En Android Studio: **File** → **Invalidate Caches** → **Restart**

### Error: "No JDK found"
Instala JDK 11+: https://www.oracle.com/java/technologies/downloads/

### App no muestra datos
Asegúrate de que FirebaseConfig esté correctamente configurado en `.env`

### Capacitor no ve cambios
```bash
npm run build
npx cap copy
npx cap sync
```

---

## 💡 TIPS IMPORTANTES

1. **KeyStore**: Guarda `my-release-key.keystore` en lugar seguro. Sin él, no puedes actualizar.
2. **Versionado**: Incrementa siempre el número de versión en Play Store.
3. **Testing**: Prueba la app en emulador antes de publicar.
4. **Certificados**: Capacitor genera certificados automáticamente.
5. **Tamaño**: Si es > 100MB, Google puede rechazarlo.

---

## 📞 SIGUIENTE PASO

Cuando hayas instalado todo, corre:

```bash
npm run build
npx cap sync android
npx cap open android
```

Desde aquí, todo es UI en Android Studio.

