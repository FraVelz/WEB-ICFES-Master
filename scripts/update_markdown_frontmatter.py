#!/usr/bin/env python3
"""
Script para actualizar el frontmatter de todos los archivos markdown.
Establece xp: 500 y coins: 250 en todos los archivos.
Actualiza archivos existentes o agrega los campos si no existen.
"""

import os
import re
import logging
from pathlib import Path

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

def update_markdown_file(file_path: Path):
    """
    Actualiza un archivo markdown individual.
    Establece xp: 500 y coins: 250.
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Verificar si tiene frontmatter (empieza con ---)
        if not content.startswith('---'):
            logger.warning(f"  {file_path.name}: No tiene frontmatter, omitiendo")
            return False
        
        # Buscar el final del frontmatter (segundo ---)
        frontmatter_end = content.find('\n---', 3)
        if frontmatter_end == -1:
            logger.warning(f"  {file_path.name}: Frontmatter mal formado, omitiendo")
            return False
        
        frontmatter_section = content[4:frontmatter_end]  # Saltar primer ---
        body_content = content[frontmatter_end + 5:]  # Saltar \n---
        
        # Actualizar o agregar xp
        if re.search(r'^xp:\s*\d+', frontmatter_section, re.MULTILINE):
            # Reemplazar xp existente
            frontmatter_section = re.sub(
                r'^xp:\s*\d+',
                'xp: 500',
                frontmatter_section,
                flags=re.MULTILINE
            )
            logger.info(f"  {file_path.name}: Actualizado xp a 500")
        else:
            # Agregar xp después de summary o published
            if re.search(r'^summary:', frontmatter_section, re.MULTILINE):
                frontmatter_section = re.sub(
                    r'^(summary:.*)$',
                    r'\1\nxp: 500',
                    frontmatter_section,
                    flags=re.MULTILINE
                )
            elif re.search(r'^published:', frontmatter_section, re.MULTILINE):
                frontmatter_section = re.sub(
                    r'^(published:.*)$',
                    r'\1\nxp: 500',
                    frontmatter_section,
                    flags=re.MULTILINE
                )
            else:
                # Agregar al final del frontmatter antes del cierre
                frontmatter_section += '\nxp: 500'
            logger.info(f"  {file_path.name}: Agregado xp: 500")
        
        # Actualizar o agregar coins
        if re.search(r'^coins:\s*\d+', frontmatter_section, re.MULTILINE):
            # Reemplazar coins existente
            frontmatter_section = re.sub(
                r'^coins:\s*\d+',
                'coins: 250',
                frontmatter_section,
                flags=re.MULTILINE
            )
            logger.info(f"  {file_path.name}: Actualizado coins a 250")
        else:
            # Agregar coins después de xp
            if re.search(r'^xp:', frontmatter_section, re.MULTILINE):
                frontmatter_section = re.sub(
                    r'^(xp:.*)$',
                    r'\1\ncoins: 250',
                    frontmatter_section,
                    flags=re.MULTILINE
                )
            else:
                # Agregar al final del frontmatter antes del cierre
                frontmatter_section += '\ncoins: 250'
            logger.info(f"  {file_path.name}: Agregado coins: 250")
        
        # Reconstruir el archivo
        new_content = f"---\n{frontmatter_section}\n---{body_content}"
        
        # Solo escribir si hubo cambios
        if new_content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            return True
        
        return False
        
    except Exception as e:
        logger.error(f"Error procesando {file_path.name}: {e}")
        return False

def update_markdown_files(markdown_dir: str):
    """
    Actualiza todos los archivos markdown en el directorio especificado.
    Establece xp: 500 y coins: 250 en todos los archivos.
    """
    markdown_path = Path(markdown_dir)
    
    if not markdown_path.exists():
        logger.error(f"El directorio {markdown_dir} no existe.")
        return
    
    # Buscar todos los archivos .md (excluir here.md u otros archivos especiales)
    md_files = [f for f in markdown_path.glob("*.md") if f.name != "here.md"]
    
    if not md_files:
        logger.warning(f"No se encontraron archivos .md en {markdown_dir}")
        return
    
    logger.info(f"Procesando {len(md_files)} archivos markdown...")
    
    updated_count = 0
    error_count = 0
    
    for md_file in sorted(md_files):
        if update_markdown_file(md_file):
            updated_count += 1
        else:
            error_count += 1
    
    # Resumen
    print("\n" + "="*50)
    print("RESUMEN DE ACTUALIZACIÓN")
    print("="*50)
    print(f"Total de archivos procesados: {len(md_files)}")
    print(f"Archivos actualizados: {updated_count}")
    print(f"Archivos con errores o sin cambios: {error_count}")
    print("\nTodos los archivos ahora tienen:")
    print("  - xp: 500")
    print("  - coins: 250")
    print("="*50 + "\n")

if __name__ == "__main__":
    import sys
    
    # Obtener el directorio de markdown
    script_dir = os.path.dirname(os.path.abspath(__file__))
    markdown_dir = os.path.join(script_dir, "markdown")
    
    # Permitir especificar otro directorio como argumento
    if len(sys.argv) > 1:
        markdown_dir = sys.argv[1]
    
    update_markdown_files(markdown_dir)
