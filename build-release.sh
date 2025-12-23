#!/bin/bash

# Script para compilar la app en modo release y generar APK/AAB
# Uso: ./build-release.sh [apk|aab|ambos]

set -e

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Parámetro: tipo de build (apk, aab, o ambos)
BUILD_TYPE="${1:-ambos}"

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🔨 COMPILADOR DE RELEASE - PRUEBAS ICFES${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}\n"

# Paso 1: Verificar que estamos en la carpeta correcta
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json no encontrado. Ejecuta este script desde la raíz del proyecto.${NC}"
    exit 1
fi

# Paso 2: Verificar que el keystore existe
if [ ! -f "android/app/my-release-key.keystore" ]; then
    echo -e "${RED}❌ Error: Keystore no encontrado en android/app/my-release-key.keystore${NC}"
    echo -e "${YELLOW}Genera el keystore primero ejecutando: ./generate-keystore.sh${NC}"
    exit 1
fi

# Paso 3: Compilar la web app
echo -e "${YELLOW}[1/4] Compilando aplicación web...${NC}"
pnpm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error en compilación web${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Aplicación web compilada${NC}\n"

# Paso 4: Sincronizar assets con Android
echo -e "${YELLOW}[2/4] Sincronizando assets con Android...${NC}"
npx cap sync android
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error sincronizando con Android${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Assets sincronizados${NC}\n"

# Paso 5: Compilar APK si es solicitado
if [ "$BUILD_TYPE" == "apk" ] || [ "$BUILD_TYPE" == "ambos" ]; then
    echo -e "${YELLOW}[3/4] Compilando APK release...${NC}"
    cd android
    ./gradlew assembleRelease
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Error compilando APK${NC}"
        cd ..
        exit 1
    fi
    cd ..
    
    APK_PATH="android/app/build/outputs/apk/release/app-release.apk"
    if [ -f "$APK_PATH" ]; then
        SIZE=$(du -h "$APK_PATH" | cut -f1)
        echo -e "${GREEN}✅ APK generado: $APK_PATH (${SIZE})${NC}\n"
    fi
fi

# Paso 6: Compilar AAB si es solicitado
if [ "$BUILD_TYPE" == "aab" ] || [ "$BUILD_TYPE" == "ambos" ]; then
    echo -e "${YELLOW}[3/4] Compilando Android App Bundle (AAB) para Play Store...${NC}"
    cd android
    ./gradlew bundleRelease
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Error compilando AAB${NC}"
        cd ..
        exit 1
    fi
    cd ..
    
    AAB_PATH="android/app/build/outputs/bundle/release/app-release.aab"
    if [ -f "$AAB_PATH" ]; then
        SIZE=$(du -h "$AAB_PATH" | cut -f1)
        echo -e "${GREEN}✅ AAB generado: $AAB_PATH (${SIZE})${NC}\n"
    fi
fi

# Paso 7: Resumen final
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}✅ ¡Compilación completada!${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}\n"

if [ "$BUILD_TYPE" == "apk" ] || [ "$BUILD_TYPE" == "ambos" ]; then
    echo -e "${GREEN}📦 APK generado:${NC}"
    echo -e "   Ruta: ${YELLOW}android/app/build/outputs/apk/release/app-release.apk${NC}"
    echo -e "   Para instalar: ${YELLOW}adb install android/app/build/outputs/apk/release/app-release.apk${NC}\n"
fi

if [ "$BUILD_TYPE" == "aab" ] || [ "$BUILD_TYPE" == "ambos" ]; then
    echo -e "${GREEN}🎁 Android App Bundle (AAB) generado:${NC}"
    echo -e "   Ruta: ${YELLOW}android/app/build/outputs/bundle/release/app-release.aab${NC}"
    echo -e "   ${YELLOW}Este archivo se sube directamente a Google Play Console${NC}\n"
fi

echo -e "${YELLOW}📝 Próximos pasos:${NC}"
echo -e "   1. Descarga el archivo (APK o AAB)"
echo -e "   2. Ve a Google Play Console"
echo -e "   3. Crea una nueva app"
echo -e "   4. Sube el archivo en la sección 'Build > Release'"
echo -e "   5. Completa los datos de la app (screenshots, descripción, etc.)"
echo -e "   6. Envía para revisión\n"

echo -e "${GREEN}¡Listo para Play Store! 🎉${NC}"
