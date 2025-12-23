# ⚡ QUICK START - APK EN 3 PASOS

## 🎯 Objetivo
Generar APK/AAB firmado para Play Store en minutos.

---

## ⚡ Paso 1: Generar Keystore (5 min)

```bash
./generate-keystore.sh
```

Te pedirá información personal. Cuando pida contraseña, usa algo fuerte:
```
Contraseña: MiContraseña123456789Strong!
```

**Resultado:** Se crea `android/app/my-release-key.keystore`

⚠️ **GUARDA ESTE ARCHIVO EN LUGAR SEGURO**

---

## ⚡ Paso 2: Configurar Contraseñas (2 min)

```bash
cp android/app/signing.properties.example android/app/signing.properties
nano android/app/signing.properties
```

Edita y rellena con las contraseñas del Paso 1:

```properties
storeFile=my-release-key.keystore
storePassword=MiContraseña123456789Strong!
keyAlias=my-key-alias
keyPassword=MiContraseña123456789Strong!
```

Guarda: `Ctrl+O` → Enter → `Ctrl+X`

---

## ⚡ Paso 3: Compilar APK/AAB (15 min)

```bash
# Para Play Store (RECOMENDADO)
./build-release.sh aab

# O para pruebas en dispositivo
./build-release.sh apk

# O ambos
./build-release.sh ambos
```

**Resultado:**
```
✅ APK:  android/app/build/outputs/apk/release/app-release.apk
✅ AAB:  android/app/build/outputs/bundle/release/app-release.aab
```

---

## 🎉 ¡LISTO!

Ahora tienes el APK/AAB. Puedes:

### Opción A: Subir a Play Store
1. Ve a https://play.google.com/console
2. Crea una app
3. Sube el archivo `.aab`
4. Completa información
5. Envía para revisión

👉 **Lee:** `GUIA_PLAY_STORE_PASO_A_PASO.md` (instrucciones detalladas)

### Opción B: Instalar en dispositivo (solo APK)
```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

---

## 📖 Guías Disponibles

- **`APK_CONFIGURADO.md`** ← Estado completo del proyecto
- **`GUIA_PLAY_STORE_PASO_A_PASO.md`** ← Guía completa con capturas
- **`COMANDOS_RAPIDOS_MOBILE.md`** ← Referencia rápida
- **Este archivo** ← Quick start

---

## 💡 Comandos Útiles

```bash
# Ver tamaño del APK
ls -lh android/app/build/outputs/apk/release/app-release.apk

# Instalar APK en dispositivo conectado
adb install -r android/app/build/outputs/apk/release/app-release.apk

# Abrir Android Studio
pnpm run mobile:open

# Sincronizar cambios web → Android
pnpm run mobile:sync

# Ver logs del emulador
adb logcat
```

---

## ⚠️ Problemas?

### Keystore no encontrado
```bash
./generate-keystore.sh
```

### JDK no instalado
```bash
# Ubuntu/Debian
sudo apt install openjdk-11-jdk

# macOS
brew install openjdk@11
```

### Android SDK no configurado
```bash
export ANDROID_HOME=~/Android/Sdk
```

---

**¡A por Play Store! 🚀**
