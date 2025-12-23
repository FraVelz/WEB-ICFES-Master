# ⚡ COMANDOS RÁPIDOS - Web + Móvil + Play Store

## 🔧 SETUP INICIAL (UNA SOLA VEZ)

```bash
# 1. Instalar dependencias globales
npm install -g @capacitor/cli firebase-tools

# 2. Ir al proyecto
cd /home/fravelz/Documentos/WEB-ICFES-Master

# 3. Instalar Capacitor localmente
npm install @capacitor/core @capacitor/cli @capacitor/android

# 4. Inicializar Capacitor
npx cap init
# Respuestas:
# App name: Pruebas ICFES
# App Package ID: com.icfes.pruebas
# Default directory: dist

# 5. Agregar Android
npx cap add android

# 6. Configurar Firebase
firebase init hosting
# Default directory: dist
# Single-page app: y
```

---

## 🚀 FLUJO DE TRABAJO DIARIO

### Versión Web (Hosting)

```bash
# 1. Hacer cambios en el código
# 2. Compilar
npm run build

# 3. Deployar a Firebase
firebase deploy

# ¡Listo! Tu web está actualizada en https://tu-proyecto.web.app
```

### Versión Móvil (Android)

```bash
# 1. Hacer cambios en el código
# 2. Compilar web
npm run build

# 3. Copiar a Android
npx cap copy android
npx cap sync android

# 4. Abrir en Android Studio
npx cap open android

# 5. En Android Studio:
#    - Build → Build Bundle(s) / APK(s) → Build Bundle(s)
#    - Espera a que termine
#    - Verás mensaje "Build successful"

# 6. Subir bundle a Play Store
#    - Play Console → Gestión de versiones → Crear versión
#    - Carga el .aab
#    - Incrementa versión (1.0.0 → 1.0.1)
#    - Enviar para revisión
```

---

## 📦 GENERAR BUILD (COMANDOS DIRECTOS)

### Web Build
```bash
npm run build
# Output: dist/
```

### Android Debug APK
```bash
cd android
./gradlew assembleDebug
cd ..
# Output: android/app/build/outputs/apk/debug/app-debug.apk
# Para probar en emulador
```

### Android Release Bundle (Para Play Store)
```bash
cd android
./gradlew bundleRelease
cd ..
# Output: android/app/build/outputs/bundle/release/app-release.aab
# ¡ESTO es lo que subes a Play Store!
```

---

## 📂 RUTAS IMPORTANTES

| Qué | Ruta |
|-----|------|
| Código fuente | `/src/` |
| Build web | `/dist/` |
| Proyecto Android | `/android/` |
| Config Capacitor | `/capacitor.config.ts` |
| Firma (keystore) | `~/my-release-key.keystore` |
| APK debug | `/android/app/build/outputs/apk/debug/` |
| Bundle release | `/android/app/build/outputs/bundle/release/` |

---

## 🎯 PUBLICAR EN PLAY STORE (PRIMERA VEZ)

```bash
# 1. Generar keystore (UNA SOLA VEZ)
# Abrir Android Studio → Build → Generate Signed Bundle/APK
# Seguir asistente, guardar contraseña en lugar seguro

# 2. Crear app en Play Console
# https://play.google.com/console → Create app

# 3. Generar bundle firmado
# Android Studio → Build → Build Bundle(s)

# 4. Subir a Play Console
# Gestión de versiones → Crear versión → Cargar .aab

# 5. Esperar 24-48 horas para revisión
```

---

## 🔄 ACTUALIZAR EN PLAY STORE

```bash
# Workflow:
npm run build                    # Compilar web
npx cap copy android            # Copiar cambios
npx cap sync android            # Sincronizar
npx cap open android            # Abrir en Android Studio

# En Android Studio:
# Build → Build Bundle(s) / APK(s) → Build Bundle(s)
# (Usa MISMO keystore de antes, contraseña guardada)

# En Play Console:
# - Nueva versión
# - Cargar .aab
# - Cambiar número: 1.0.0 → 1.0.1
# - Enviar revisión
```

---

## 🌍 HOSTING OPCIONES

### Firebase (RECOMENDADO)
```bash
firebase deploy
# Web: https://tu-proyecto.web.app
```

### Netlify
```bash
netlify deploy --prod --dir=dist
# Web: https://tu-dominio.netlify.app
```

### GitHub Pages
```bash
npm run deploy
# Web: https://tu-usuario.github.io/WEB-ICFES-Master
```

---

## 🐛 AYUDA RÁPIDA

| Problema | Solución |
|----------|----------|
| ANDROID_HOME no encontrado | `export ANDROID_HOME=$HOME/Android/Sdk` |
| Gradle no sincroniza | Android Studio → File → Invalidate Caches → Restart |
| App no carga datos | Verifica `.env` y FirebaseConfig |
| Cambios no aparecen | `npm run build` → `npx cap sync android` |
| Olvidé contraseña keystore | No se puede recuperar, genera uno nuevo |
| Bundle muy grande (>100MB) | Elimina recursos innecesarios |

---

## ✅ CHECKLIST PRE-LANZAMIENTO

- [ ] Código compilado sin errores
- [ ] Probado en emulador Android
- [ ] Screenshots listos (1080x1920 píxeles)
- [ ] Descripción de app escrita
- [ ] Política de privacidad en URL
- [ ] Número de versión incrementado
- [ ] Keystore guardado en lugar seguro
- [ ] Build bundle generado y firmado
- [ ] Upload a Play Console

---

## 💾 GUARDAR CONTRASEÑAS

Crea archivo `.env.local` (NO SUBIR A GIT):

```bash
# .env.local
KEYSTORE_PASSWORD=tu-contraseña-super-segura
KEYSTORE_ALIAS=my-key-alias
KEYSTORE_ALIAS_PASSWORD=tu-contraseña-super-segura
```

Agregar a `.gitignore`:
```
.env.local
my-release-key.keystore
```

---

## 📱 EMULAR ANTES DE PUBLICAR

```bash
# Crear emulador en Android Studio
# Tools → Device Manager → Create device

# Luego:
npm run build
npx cap copy android
npx cap open android

# En Android Studio:
# Select emulator → Run → Run 'app'
```

