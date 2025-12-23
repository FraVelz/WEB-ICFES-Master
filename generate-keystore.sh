#!/bin/bash

# Script para generar keystore de firma para Play Store
# Uso: ./generate-keystore.sh

KEYSTORE_PATH="android/app/my-release-key.keystore"
KEY_ALIAS="my-key-alias"
VALIDITY_DAYS=36500  # 100 años

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Generador de Keystore para Play Store ===${NC}\n"

# Verificar si el keystore ya existe
if [ -f "$KEYSTORE_PATH" ]; then
    echo -e "${RED}⚠️  ADVERTENCIA: El keystore ya existe en $KEYSTORE_PATH${NC}"
    echo -e "${RED}Si continúas, PERDERÁS la clave anterior.${NC}\n"
    read -p "¿Deseas continuar? (s/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        echo "Operación cancelada."
        exit 1
    fi
fi

echo -e "${YELLOW}Generando keystore...${NC}\n"

# Generar el keystore
# IMPORTANTE: Usa contraseña fuerte. La recomendación es: MinimoPasswordDeJeden12Caracteres
keytool -genkey \
    -v \
    -keystore "$KEYSTORE_PATH" \
    -keyalg RSA \
    -keysize 2048 \
    -validity $VALIDITY_DAYS \
    -alias "$KEY_ALIAS"

if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}✅ Keystore generado exitosamente en: $KEYSTORE_PATH${NC}"
    echo -e "${YELLOW}⚠️  IMPORTANTE:${NC}"
    echo "  1. Guarda esta carpeta en un lugar seguro (backup)"
    echo "  2. NO publiques el keystore en Git (ya está en .gitignore)"
    echo "  3. Guarda la contraseña en un lugar seguro"
    echo "  4. Esta clave DEBE ser la misma para todas las versiones de la app"
    echo ""
    
    # Mostrar información del keystore
    echo -e "${YELLOW}Información del keystore:${NC}"
    keytool -list -v -keystore "$KEYSTORE_PATH" -alias "$KEY_ALIAS"
else
    echo -e "${RED}❌ Error generando el keystore${NC}"
    exit 1
fi
