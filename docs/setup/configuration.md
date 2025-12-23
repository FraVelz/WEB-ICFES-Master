# 🔧 ARCHIVOS DE CONFIGURACIÓN

## 1. capacitor.config.ts

Crea este archivo en la raíz del proyecto:

```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.icfes.pruebas',
  appName: 'Pruebas ICFES',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    hostname: 'localhost'
  },
  android: {
    allowMixedContent: true,
    webContentsDebuggingEnabled: false
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      showSpinner: false
    },
    CapacitorHTTP: {
      enabled: true
    }
  },
  ios: {
    contentInset: 'automatic'
  }
};

export default config;
```

---

## 2. firebase.json

Crea este archivo en la raíz del proyecto:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css|woff|woff2)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      },
      {
        "source": "index.html",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=0, no-cache, no-store, must-revalidate"
          }
        ]
      }
    ]
  }
}
```

---

## 3. .firebaserc

Crea este archivo en la raíz del proyecto:

```json
{
  "projects": {
    "default": "tu-proyecto-firebase"
  },
  "targets": {},
  "etags": {}
}
```

Reemplaza `tu-proyecto-firebase` con tu proyecto real.

---

## 4. package.json - Scripts Actualizados

Agrega estos scripts a tu `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "build:mobile": "npm run build && npx cap copy android && npx cap sync android",
    "preview": "vite preview",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "web:deploy": "npm run build && firebase deploy",
    "android:dev": "npm run build:mobile && npx cap open android",
    "android:build": "cd android && ./gradlew bundleRelease",
    "capacitor:sync": "npx cap sync",
    "capacitor:copy": "npx cap copy",
    "capacitor:open": "npx cap open android"
  }
}
```

---

## 5. .gitignore - Agregar Líneas

Asegúrate de que tu `.gitignore` incluya:

```
# Capacitor
android/
ios/
*.keystore
my-release-key.keystore

# Build
dist/
.env.local
.env.*.local

# Dependencies
node_modules/

# IDEs
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Firebase
.firebase/
firebase-debug.log
```

---

## 6. .env.example

Crea este archivo para documentar variables de entorno:

```env
# Firebase
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# Build
VITE_API_URL=https://your-backend.com
```

---

## 7. AndroidManifest.xml Importante

En `/android/app/src/main/AndroidManifest.xml`, asegúrate que esté:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.icfes.pruebas">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher"
        android:allowBackup="true"
        android:usesCleartextTraffic="true"
        android:supportsRtl="true">

        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

---

## 8. build.gradle - Versión Android

En `/android/app/build.gradle`:

```gradle
android {
    namespace "com.icfes.pruebas"
    compileSdk 34

    defaultConfig {
        applicationId "com.icfes.pruebas"
        minSdk 24
        targetSdk 34
        versionCode 1
        versionName "1.0.0"
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
            signingConfig signingConfigs.release
        }
    }

    signingConfigs {
        release {
            storeFile file(System.getenv('KEYSTORE_FILE') ?: 'my-release-key.keystore')
            storePassword System.getenv('KEYSTORE_PASSWORD')
            keyAlias System.getenv('KEYSTORE_ALIAS') ?: 'my-key-alias'
            keyPassword System.getenv('KEYSTORE_ALIAS_PASSWORD')
        }
    }
}
```

---

## 9. ACTUALIZAR VERSIÓN

Cuando hagas update de la app:

### En `/android/app/build.gradle`:
```gradle
versionCode 2          # Incrementa número
versionName "1.0.1"    # Incrementa versión
```

### En Play Console:
- Gestión de versiones → Nueva versión
- Versión: 1.0.1
- Código de versión: 2

---

## 🔗 REFERENCIAS RÁPIDAS

| Archivo | Ubicación | Propósito |
|---------|-----------|----------|
| capacitor.config.ts | `./` | Config Capacitor |
| firebase.json | `./` | Config Firebase hosting |
| .firebaserc | `./` | Proyecto Firebase |
| AndroidManifest.xml | `./android/app/src/main/` | Permisos Android |
| build.gradle | `./android/app/` | Build Android |
| package.json | `./` | Scripts npm |
| .env.local | `./` | Variables locales (NO SUBIR) |

---

## ⚡ COPIA Y PEGA RÁPIDA

Si necesitas crear los archivos rápidamente:

```bash
# Crear capacitor.config.ts
cat > capacitor.config.ts << 'EOF'
import type { CapacitorConfig } from '@capacitor/cli';
const config: CapacitorConfig = {
  appId: 'com.icfes.pruebas',
  appName: 'Pruebas ICFES',
  webDir: 'dist',
  server: { androidScheme: 'https' },
  plugins: { SplashScreen: { launchShowDuration: 0 } },
};
export default config;
EOF

# Crear firebase.json
cat > firebase.json << 'EOF'
{
  "hosting": {
    "public": "dist",
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  }
}
EOF
```

