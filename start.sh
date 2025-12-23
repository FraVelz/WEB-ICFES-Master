#!/bin/bash

# Script de inicio rápido para ICFES Master

echo "🎓 ICFES Master - Script de Inicio"
echo "========================================="
echo ""

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
  echo "❌ Node.js no está instalado. Por favor instálalo desde https://nodejs.org"
  exit 1
fi

echo "✅ Node.js detectado: $(node --version)"
echo ""

# Verificar si estamos en el directorio correcto
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json no encontrado"
  echo "Por favor ejecuta este script desde la raíz del proyecto"
  exit 1
fi

echo "✅ Proyecto detectado"
echo ""

# Instalar dependencias si no existen
if [ ! -d "node_modules" ]; then
  echo "📦 Instalando dependencias..."
  npm install
  echo ""
fi

echo "🚀 Iniciando servidor de desarrollo..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📍 La aplicación estará disponible en:"
echo "   http://localhost:5174/"
echo ""
echo "Presiona Ctrl+C para detener el servidor"
echo ""

npm run dev
