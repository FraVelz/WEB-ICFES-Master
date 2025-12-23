# Guía de Despliegue: Web y Play Store

## Compilación Web

Para generar la versión de producción:

```bash
npm run build
```
Esto generará la carpeta `dist/`.

## Despliegue en Firebase Hosting

```bash
firebase deploy
```

## Compilación Android (APK/Bundle)

1. **Preparar assets**:
   ```bash
   npm run build
   npx cap sync android
   ```

2. **Generar APK (Debug)**:
   ```bash
   cd android
   ./gradlew assembleDebug
   ```
   Output: `android/app/build/outputs/apk/debug/app-debug.apk`

3. **Generar Bundle (Release - Play Store)**:
   ```bash
   cd android
   ./gradlew bundleRelease
   ```
   Output: `android/app/build/outputs/bundle/release/app-release.aab`

## Publicación en Play Store

1. Accede a Google Play Console.
2. Ve a **Producción** o **Testing interno**.
3. Crea una nueva versión.
4. Sube el archivo `.aab` generado.
5. Actualiza las notas de la versión.
6. Envía a revisión.

> **Nota**: Recuerda incrementar el `versionCode` y `versionName` en `android/app/build.gradle` antes de cada release.
