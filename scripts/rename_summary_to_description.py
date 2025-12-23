#!/usr/bin/env python3
"""
Script para renombrar el campo 'summary' a 'description' en todos los archivos markdown.
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

def rename_summary_to_description(file_path: Path):
    """
    Renombra 'summary:' a 'description:' en un archivo markdown.
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
        
        # Buscar y reemplazar summary: por description:
        if re.search(r'^summary:', frontmatter_section, re.MULTILINE):
            frontmatter_section = re.sub(
                r'^summary:',
                'description:',
                frontmatter_section,
                flags=re.MULTILINE
            )
            logger.info(f"  {file_path.name}: Renombrado summary: a description:")
            
            # Reconstruir el archivo
            new_content = f"---\n{frontmatter_section}\n---{body_content}"
            
            # Solo escribir si hubo cambios
            if new_content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                return True
        else:
            logger.debug(f"  {file_path.name}: No tiene campo summary, omitiendo")
            return False
        
        return False
        
    except Exception as e:
        logger.error(f"Error procesando {file_path.name}: {e}")
        return False

def rename_all_markdown_files(markdown_dir: str):
    """
    Renombra summary a description en todos los archivos markdown.
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
    skipped_count = 0
    
    for md_file in sorted(md_files):
        if rename_summary_to_description(md_file):
            updated_count += 1
        else:
            skipped_count += 1
    
    # Resumen
    print("\n" + "="*50)
    print("RESUMEN DE RENOMBRADO")
    print("="*50)
    print(f"Total de archivos procesados: {len(md_files)}")
    print(f"Archivos actualizados: {updated_count}")
    print(f"Archivos sin cambios: {skipped_count}")
    print("\nTodos los archivos ahora usan 'description:' en lugar de 'summary:'")
    print("="*50 + "\n")

if __name__ == "__main__":
    import sys
    
    # Obtener el directorio de markdown
    script_dir = os.path.dirname(os.path.abspath(__file__))
    markdown_dir = os.path.join(script_dir, "markdown")
    
    # Permitir especificar otro directorio como argumento
    if len(sys.argv) > 1:
        markdown_dir = sys.argv[1]
    
    rename_all_markdown_files(markdown_dir)

