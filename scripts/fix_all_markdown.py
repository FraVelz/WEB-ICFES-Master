#!/usr/bin/env python3
"""
Script para actualizar TODOS los archivos markdown con:
- xp: 500 (si no existe o es diferente)
- coins: 250 (si no existe o es diferente)
- description: (renombrar de summary si existe, o agregar si falta)
- Asegurar formato correcto del frontmatter
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

def fix_markdown_file(file_path: Path):
    """
    Actualiza un archivo markdown con todas las correcciones necesarias.
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        changes_made = []
        
        # Verificar si tiene frontmatter (empieza con ---)
        if not content.startswith('---'):
            logger.warning(f"  {file_path.name}: No tiene frontmatter, omitiendo")
            return False
        
        # Buscar el final del frontmatter (segundo ---)
        # Buscar patrón --- seguido de salto de línea y luego otro ---
        frontmatter_end = content.find('\n---', 3)
        
        # Si no se encuentra el patrón normal, buscar alternativas
        if frontmatter_end == -1:
            # Buscar --- seguido de # (sin salto de línea)
            frontmatter_match = re.search(r'\n---\s*#', content)
            if frontmatter_match:
                frontmatter_end = frontmatter_match.start()
            else:
                # Buscar --- seguido directamente de texto (sin salto de línea, caso especial)
                frontmatter_match = re.search(r'\n---\s*[A-Z]', content)
                if frontmatter_match:
                    frontmatter_end = frontmatter_match.start()
                else:
                    logger.warning(f"  {file_path.name}: Frontmatter mal formado, omitiendo")
                    return False
        
        frontmatter_section = content[4:frontmatter_end]  # Saltar primer ---
        
        # Extraer contenido del cuerpo
        # Buscar dónde termina realmente el frontmatter
        body_start = frontmatter_end + 4  # Saltar \n---
        
        # Si después de --- hay más ---, buscar el siguiente
        if body_start < len(content) and content[body_start:body_start+3] == '---':
            body_start += 4  # Saltar otro ---
        
        body_content = content[body_start:] if body_start < len(content) else ""
        
        # 1. Renombrar summary a description si existe
        if re.search(r'^summary:', frontmatter_section, re.MULTILINE):
            frontmatter_section = re.sub(r'^summary:', 'description:', frontmatter_section, flags=re.MULTILINE)
            changes_made.append("summary → description")
        
        # 2. Actualizar o agregar xp: 500
        if re.search(r'^xp:\s*\d+', frontmatter_section, re.MULTILINE):
            xp_match = re.search(r'^xp:\s*(\d+)', frontmatter_section, re.MULTILINE)
            if xp_match and int(xp_match.group(1)) != 500:
                frontmatter_section = re.sub(r'^xp:\s*\d+', 'xp: 500', frontmatter_section, flags=re.MULTILINE)
                changes_made.append("xp actualizado a 500")
        else:
            # Agregar xp después de description o published
            if re.search(r'^description:', frontmatter_section, re.MULTILINE):
                frontmatter_section = re.sub(r'^(description:.*)$', r'\1\nxp: 500', frontmatter_section, flags=re.MULTILINE)
            elif re.search(r'^published:', frontmatter_section, re.MULTILINE):
                frontmatter_section = re.sub(r'^(published:.*)$', r'\1\nxp: 500', frontmatter_section, flags=re.MULTILINE)
            else:
                # Agregar al final del frontmatter antes del cierre
                frontmatter_section += '\nxp: 500'
            changes_made.append("xp: 500 agregado")
        
        # 3. Actualizar o agregar coins: 250
        if re.search(r'^coins:\s*\d+', frontmatter_section, re.MULTILINE):
            coins_match = re.search(r'^coins:\s*(\d+)', frontmatter_section, re.MULTILINE)
            if coins_match and int(coins_match.group(1)) != 250:
                frontmatter_section = re.sub(r'^coins:\s*\d+', 'coins: 250', frontmatter_section, flags=re.MULTILINE)
                changes_made.append("coins actualizado a 250")
        else:
            # Agregar coins después de xp
            if re.search(r'^xp:', frontmatter_section, re.MULTILINE):
                frontmatter_section = re.sub(r'^(xp:.*)$', r'\1\ncoins: 250', frontmatter_section, flags=re.MULTILINE)
            else:
                # Agregar al final del frontmatter antes del cierre
                frontmatter_section += '\ncoins: 250'
            changes_made.append("coins: 250 agregado")
        
        # 4. Corregir formato ---# a ---\n\n# (dentro del frontmatter)
        if re.search(r'---\s*#', frontmatter_section):
            frontmatter_section = re.sub(r'---\s*#', '---\n\n#', frontmatter_section)
            changes_made.append("formato ---# corregido")
        
        # 5. Corregir formato al final del frontmatter: --- seguido de texto sin #
        # Si el body_content empieza con --- seguido de texto (sin #), corregirlo
        if body_content:
            # Buscar patrón --- seguido de espacio y texto (título)
            if re.match(r'^---\s+[A-Z]', body_content):
                # Reemplazar --- Título por # Título
                body_content = re.sub(r'^---\s+([A-Z][^\n]*)', r'# \1', body_content, count=1)
                changes_made.append("formato --- Título corregido a # Título")
            elif re.match(r'^---[A-Z]', body_content):
                # Caso sin espacio: ---Título
                body_content = re.sub(r'^---([A-Z][^\n]*)', r'# \1', body_content, count=1)
                changes_made.append("formato ---Título corregido a # Título")
        
        # 5. Asegurar que description existe (si no existe, intentar extraer del contenido o usar un placeholder)
        if not re.search(r'^description:', frontmatter_section, re.MULTILINE):
            # Intentar extraer del contenido (primer párrafo después del título)
            description = ""
            if body_content:
                lines = body_content.split('\n')
                for line in lines[:10]:  # Buscar en las primeras 10 líneas
                    line_clean = line.strip()
                    if line_clean and not line_clean.startswith('#') and len(line_clean) > 20:
                        description = line_clean[:150]  # Primeros 150 caracteres
                        break
            
            if description:
                # Agregar description después de summary o published
                if re.search(r'^published:', frontmatter_section, re.MULTILINE):
                    frontmatter_section = re.sub(
                        r'^(published:.*)$',
                        f'\\1\ndescription: {description[:100]}...',
                        frontmatter_section,
                        flags=re.MULTILINE
                    )
                else:
                    frontmatter_section += f'\ndescription: {description[:100]}...'
                changes_made.append("description agregado desde contenido")
            else:
                # Agregar placeholder
                if re.search(r'^published:', frontmatter_section, re.MULTILINE):
                    frontmatter_section = re.sub(
                        r'^(published:.*)$',
                        '\\1\ndescription: Descripción de la lección',
                        frontmatter_section,
                        flags=re.MULTILINE
                    )
                else:
                    frontmatter_section += '\ndescription: Descripción de la lección'
                changes_made.append("description placeholder agregado")
        
        # Corregir formato del cuerpo si empieza con --- seguido de texto
        if body_content:
            # Limpiar líneas vacías al inicio
            body_content = body_content.lstrip('\n')
            
            # Patrón: --- seguido directamente de texto (sin espacio o con espacio)
            # Buscar líneas que empiecen con --- seguido de texto
            lines = body_content.split('\n')
            fixed_lines = []
            title_fixed = False
            
            for i, line in enumerate(lines):
                line_stripped = line.strip()
                # Si es la primera línea no vacía y empieza con --- o -- seguido de texto
                if not title_fixed and line_stripped:
                    if re.match(r'^---\s*[A-Z]', line_stripped):
                        # Reemplazar --- Título por # Título
                        fixed_line = re.sub(r'^---\s*([A-Z][^\n]*)', r'# \1', line_stripped)
                        fixed_lines.append(fixed_line)
                        title_fixed = True
                        changes_made.append("formato --- Título corregido a # Título")
                    elif re.match(r'^--\s*[A-Z]', line_stripped):
                        # Reemplazar -- Título por # Título (caso con dos guiones)
                        fixed_line = re.sub(r'^--\s*([A-Z][^\n]*)', r'# \1', line_stripped)
                        fixed_lines.append(fixed_line)
                        title_fixed = True
                        changes_made.append("formato -- Título corregido a # Título")
                    else:
                        fixed_lines.append(line)
                else:
                    fixed_lines.append(line)
            
            body_content = '\n'.join(fixed_lines)
        
        # Limpiar el frontmatter: remover --- duplicados al final
        frontmatter_section = frontmatter_section.rstrip()
        if frontmatter_section.endswith('---'):
            frontmatter_section = frontmatter_section[:-3].rstrip()
        
        # Limpiar el body_content: remover --- duplicados al inicio
        if body_content:
            body_content = body_content.lstrip()
            # Si empieza con ---, removerlo (ya está en el separador)
            if body_content.startswith('---'):
                body_content = body_content[3:].lstrip()
        
        # Reconstruir el archivo con formato correcto
        new_content = f"---\n{frontmatter_section}\n---\n\n{body_content}"
        
        # Solo escribir si hubo cambios
        if new_content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            logger.info(f"  {file_path.name}: {', '.join(changes_made)}")
            return True
        
        return False
        
    except Exception as e:
        logger.error(f"Error procesando {file_path.name}: {e}")
        import traceback
        logger.error(traceback.format_exc())
        return False

def fix_all_markdown_files(markdown_dir: str):
    """
    Actualiza todos los archivos markdown en el directorio especificado.
    """
    markdown_path = Path(markdown_dir)
    
    if not markdown_path.exists():
        logger.error(f"El directorio {markdown_dir} no existe.")
        return
    
    # Buscar todos los archivos .md (excluir here.md)
    md_files = [f for f in markdown_path.glob("*.md") if f.name != "here.md"]
    
    if not md_files:
        logger.warning(f"No se encontraron archivos .md en {markdown_dir}")
        return
    
    logger.info(f"Procesando {len(md_files)} archivos markdown...")
    
    updated_count = 0
    error_count = 0
    skipped_count = 0
    
    for md_file in sorted(md_files):
        result = fix_markdown_file(md_file)
        if result:
            updated_count += 1
        elif result is False and md_file.name != "here.md":
            skipped_count += 1
        else:
            error_count += 1
    
    # Resumen
    print("\n" + "="*50)
    print("RESUMEN DE ACTUALIZACIÓN COMPLETA")
    print("="*50)
    print(f"Total de archivos procesados: {len(md_files)}")
    print(f"Archivos actualizados: {updated_count}")
    print(f"Archivos sin cambios: {skipped_count}")
    print(f"Archivos con errores: {error_count}")
    print("\nCambios aplicados:")
    print("  ✓ xp: 500 (actualizado o agregado)")
    print("  ✓ coins: 250 (actualizado o agregado)")
    print("  ✓ description: (renombrado de summary o agregado)")
    print("  ✓ Formato frontmatter corregido (---# → ---\\n\\n#)")
    print("="*50 + "\n")

if __name__ == "__main__":
    import sys
    
    # Obtener el directorio de markdown
    script_dir = os.path.dirname(os.path.abspath(__file__))
    markdown_dir = os.path.join(script_dir, "markdown")
    
    # Permitir especificar otro directorio como argumento
    if len(sys.argv) > 1:
        markdown_dir = sys.argv[1]
    
    fix_all_markdown_files(markdown_dir)

