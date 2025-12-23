#!/bin/bash

# Script para deploy a GitHub Pages
# Uso: ./deploy.sh

set -e

echo "🔨 Building application..."
npm run build

echo ""
echo "✅ Build complete!"
echo ""
echo "📦 Contenido en dist/:"
ls -lh dist/

echo ""
echo "🚀 Próximos pasos:"
echo ""
echo "Opción 1: Deploy en rama gh-pages (recomendado)"
echo "  git branch -D gh-pages 2>/dev/null || true"
echo "  git checkout --orphan gh-pages"
echo "  git add dist/"
echo "  git commit -m 'Deploy to GitHub Pages'"
echo "  git push origin gh-pages --force"
echo "  git checkout main  # Vuelve a main"
echo ""
echo "Opción 2: Deploy en rama main + /dist"
echo "  git add dist/"
echo "  git commit -m 'Update build files'"
echo "  git push origin main"
echo "  # Luego en Settings > Pages: source = main, /dist"
echo ""
