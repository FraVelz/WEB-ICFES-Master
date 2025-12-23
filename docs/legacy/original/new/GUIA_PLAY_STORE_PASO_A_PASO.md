# 📱 GUÍA: Generar APK y Subir a Play Store

## ⚡ Resumen Rápido

```bash
# 1. Generar keystore (UNA SOLA VEZ)
./generate-keystore.sh

# 2. Configurar contraseñas
cp android/app/signing.properties.example android/app/signing.properties
# Editar el archivo con tus contraseñas

# 3. Compilar APK/AAB
./build-release.sh ambos

# 4. Subir a Play Store
# - Ve a Google Play Console
# - Sube el archivo .aab
# - Completa los datos de la app
```

---

## 📋 Requisitos Previos

Antes de empezar, asegúrate que tengas:

- ✅ JDK 11+ instalado
- ✅ Android SDK instalado (ANDROID_HOME configurado)
- ✅ Gradle disponible (viene con Android SDK)
- ✅ Proyecto React compilado (`pnpm run build` ejecutado)
- ✅ Capacitor inicializado (`npx cap add android` ejecutado)

Verifica:
```bash
# Verificar JDK
java -version

# Verificar Android SDK
echo $ANDROID_HOME

# Verificar Gradle
cd android && ./gradlew --version && cd ..
```

---

## 🔑 Paso 1: Generar Keystore (MUY IMPORTANTE)

El keystore es el archivo que firma la app. **Solo necesitas generarlo una vez**, pero **NO LO PIERDAS**.

### 1.1 Ejecutar script de generación

```bash
./generate-keystore.sh
```

### 1.2 El script te pedirá información:

```
What is your first and last name?
  > Tu Nombre

What is the name of your organizational unit?
  > Desarrollo

What is the name of your organization?
  > ICFES

What is the name of your City or Locality?
  > Bogotá

What is the name of your State or Province?
  > Bogotá

What is the two-letter country code for this unit?
  > CO

Is CN=Tu Nombre, OU=Desarrollo, O=ICFES, L=Bogotá, ST=Bogotá, C=CO correct?
  > yes

Enter key password for <my-key-alias>
  (Press ENTER if same as keystore password):
  > [Presiona ENTER para usar la misma contraseña]
```

### 1.3 Resultado

Se crea el archivo:
```
android/app/my-release-key.keystore
```

⚠️ **IMPORTANTE:**
- Guarda este archivo en un lugar SEGURO (backup externo)
- NO publiques en Git (ya está en .gitignore)
- La contraseña debe ser fuerte (mínimo 12 caracteres)
- Esta clave DEBE ser la MISMA para todas las versiones

---

## 🔐 Paso 2: Configurar Contraseñas

### 2.1 Copiar archivo de ejemplo

```bash
cp android/app/signing.properties.example android/app/signing.properties
```

### 2.2 Editar con tus contraseñas

```bash
nano android/app/signing.properties
```

Rellena así:
```properties
storeFile=my-release-key.keystore
storePassword=TU_CONTRASEÑA_FUERTE_123456
keyAlias=my-key-alias
keyPassword=TU_CONTRASEÑA_FUERTE_123456
```

⚠️ **CRÍTICO:**
- Usa la MISMA contraseña que generaste en Paso 1
- Este archivo está en .gitignore (NO se sube a Git)
- Guarda en lugar seguro también

---

## 🔨 Paso 3: Compilar APK/AAB

Ahora compilamos la app con la firma real para Play Store.

### 3.1 Opción A: Compilar APK (para pruebas)

```bash
./build-release.sh apk
```

Resultado:
```
android/app/build/outputs/apk/release/app-release.apk
```

**Usarlo para:** Pruebas rápidas en dispositivo

### 3.2 Opción B: Compilar AAB (para Play Store) ⭐ RECOMENDADO

```bash
./build-release.sh aab
```

Resultado:
```
android/app/build/outputs/bundle/release/app-release.aab
```

**Ventajas del AAB:**
- Menor tamaño
- Google Play optimiza automáticamente
- Versiones específicas por dispositivo
- **Obligatorio para nuevas apps desde 2021**

### 3.3 Opción C: Compilar ambos

```bash
./build-release.sh ambos
```

Compila tanto APK como AAB.

---

## 📊 Verificar Compilación

Después de compilar, verifica:

```bash
# Listar archivos generados
ls -lh android/app/build/outputs/apk/release/
ls -lh android/app/build/outputs/bundle/release/

# Ver información del APK
zipinfo android/app/build/outputs/apk/release/app-release.apk | head -20

# Ver información de firma
jarsigner -verify -verbose android/app/build/outputs/apk/release/app-release.apk
```

---

## 📲 Instalar en Dispositivo (Opcional - solo APK)

Si compilaste APK y quieres probar antes de subir a Play Store:

### Con cable USB:
```bash
# Conectar dispositivo y habilitar "Depuración USB"
adb install android/app/build/outputs/apk/release/app-release.apk
```

### Sin cable (APK bajado):
1. Descarga el `app-release.apk`
2. Cópialo a tu dispositivo Android
3. Abre el administrador de archivos
4. Toca el APK
5. Instala (puede pedir permisos desconocidos)

---

## 🎮 Paso 4: Subir a Google Play Console

### 4.1 Crear Cuenta de Google Play

1. Ve a https://play.google.com/console
2. Inicia sesión con tu cuenta Google
3. Paga $25 USD (solo una vez)
4. Espera 24 horas hasta tener acceso

### 4.2 Crear Nueva App

1. Haz clic en "Crear app"
2. Rellena:
   - **Nombre:** "Pruebas ICFES"
   - **Idioma por defecto:** Español
   - **Categoría:** Educación
   - **Tipo de app:** Aplicación

### 4.3 Información de la App

Ve a: **Tienda > Información del anuncio**

Rellena:
- **Título corto:** Pruebas ICFES (máx 50 caracteres)
- **Descripción completa:** (máx 4000 caracteres)
  ```
  App oficial para preparación de Pruebas ICFES
  
  ✨ Características:
  - Preguntas interactivas
  - Simulacros completos
  - Seguimiento de progreso
  - Modo de gamificación
  
  🎯 Mejora tu desempeño en los exámenes ICFES
  ```
- **Catálogo:** Educación

### 4.4 Imágenes y Gráficos

Ve a: **Tienda > Gráficos**

Necesitas:
- **Ícono de app:** 512x512 px (PNG)
- **Capturas de pantalla:** Mínimo 2, máximo 8 (1080x1920 px para phone)
- **Imagen de característica:** 1024x500 px (JPEG o PNG)
- **Video promocional:** (opcional, YouTube URL)

Donde conseguir:
```bash
# El ícono está en:
ls public/android/

# O crearlas con herramientas online:
# - Figma (diseño)
# - Canva (gráficos)
# - Screenshot en emulador (capturas)
```

### 4.5 Información sobre el Contenido

Ve a: **Gobierno y política > Información sobre el contenido**

Rellena la autoevaluación:
- ¿Contiene anuncios publicitarios? NO
- ¿Recopila datos personales? SÍ (análisis, autenticación)
- ¿Datos financieros o de pago? NO
- ¿Contenido de menores? NO
- ¿ESRB? No requerida

### 4.6 Seleccionar Precios y Distribución

Ve a: **Precios y distribución**

- **Precio:** Gratis ✅
- **Países:** Todos (o seleccionar)
- **Contenido restringido:** Sin restricción

### 4.7 Seleccionar Licencias

Ve a: **Gobierno y política > Información sobre licencias**

- **¿Incluye descodificación de contenido protegido?** NO

### 4.8 Subir Build (AAB)

Ve a: **Compilación > Release > Crear Release**

1. Haz clic en "Crear nueva release"
2. En "Compilaciones de aplicaciones Android App Bundle":
   - Haz clic en "Examinar archivos"
   - Selecciona: `app-release.aab`
3. Haz clic en "Continuar"
4. Verifica la información:
   - Código de versión: `1` (aumentar para actualizaciones)
   - Nombre de versión: `1.0`
5. Haz clic en "Guardar"

### 4.9 Revisar Antes de Enviar

Ve a: **Gobierno y política > Revisión de compilaciones**

Google Play verificará automáticamente:
- ✅ Compatibilidad de dispositivos
- ✅ Permisos solicitados
- ✅ Firmas de certificado
- ✅ Antivirus (Malware scan)

### 4.10 Enviar para Revisión

1. Ve a: **Compilación > Release > Production**
2. En tu release, haz clic en "Enviar para revisión"
3. Confirma
4. ¡Listo!

---

## ⏱️ Línea de Tiempo

```
┌─────────────────────────────────────────┐
│ T+0h    Envías a Play Store              │
│ T+1h    Estado: "Pendiente revisión"    │
│ T+24h   Google completa revisión        │
│ T+48h   ✅ App publicada en Play Store   │
│         App visible para usuarios       │
│         Puedes seguir modificando       │
└─────────────────────────────────────────┘
```

**Durante la revisión:**
- Puedes seguir editando (excepto el Build)
- No se pueden hacer cambios en el contenido
- Si hay problemas, Google te avisa por email

---

## 🔄 Actualizar la App Después

Cuando quieras una nueva versión:

### 1. Incrementa versionCode en `android/app/build.gradle`:

```gradle
// ANTES
versionCode 1

// DESPUÉS (para próxima actualización)
versionCode 2
```

### 2. Compila de nuevo:

```bash
./build-release.sh aab
```

### 3. Sube el nuevo AAB a Play Store:

Ve a: **Compilación > Release > Production** → "Crear nueva release"

El número `versionCode` debe aumentar cada vez.

---

## ⚠️ Problemas Comunes

### Error: "Keystore no encontrado"
```
Solución: Ejecuta ./generate-keystore.sh primero
```

### Error: "Contraseña incorrecta"
```
Solución: Verifica signing.properties coincide con generate-keystore
```

### Error: "JDK no encontrado"
```
Solución: Instala JDK 11+
  - Ubuntu: sudo apt install openjdk-11-jdk
  - macOS: brew install openjdk@11
```

### Error: "Android SDK no configurado"
```
Solución: Define ANDROID_HOME
  export ANDROID_HOME=~/Android/Sdk
  echo $ANDROID_HOME  # Debe mostrar la ruta
```

### Error: "Gradle build failed"
```
Solución: 
  1. Limpia build: cd android && ./gradlew clean && cd ..
  2. Vuelve a intentar: ./build-release.sh aab
```

### App rechazada por Google Play
Posibles razones:
- ❌ Contenido ofensivo
- ❌ Privacidad: No explica recopilación de datos
- ❌ Permisos excesivos sin justificación
- ❌ Acceso a datos sensibles sin consentimiento

Solución: Lee el email de Google, corrige, incrementa versionCode, recompila y reenvía.

---

## 📝 Checklist Pre-Lanzamiento

Antes de enviar a Play Store:

- [ ] Keystore generado y guardado en lugar seguro
- [ ] `signing.properties` configurado con contraseñas correctas
- [ ] APK/AAB compilado sin errores
- [ ] Nombre de app decidido: "Pruebas ICFES"
- [ ] Descripción escrita
- [ ] Ícono 512x512 preparado
- [ ] Mínimo 2 capturas de pantalla
- [ ] App probada en dispositivo real (si es posible)
- [ ] Política de privacidad escrita
- [ ] Cuenta Google Play creada ($25 pagados)
- [ ] Información de la app completada en consola
- [ ] Build subido y verificado
- [ ] Contenido revisado

---

## 🎯 Próximos Pasos

```
SEMANA 1
├── [x] Generar keystore
├── [x] Compilar APK/AAB
├── [ ] Crear cuenta Google Play ($25)
├── [ ] Crear app en Google Play Console
└── [ ] Completar información de la app

SEMANA 2
├── [ ] Preparar imágenes/capturas
├── [ ] Subir Build (AAB)
├── [ ] Enviar para revisión
├── [ ] Esperar revisión (24-48h)
└── [ ] ✅ ¡App publicada!
```

---

## 📞 Soporte

Si tienes problemas:

1. Verifica el `.gitignore` (no rastrear keystore ni signing.properties)
2. Revisa el `.env.local` (credenciales de Firebase)
3. Consulta logs: `cd android && ./gradlew build --info`
4. Lee: https://capacitorjs.com/docs/android

---

**¡Listo para jugar en la tienda! 🎮📱**
