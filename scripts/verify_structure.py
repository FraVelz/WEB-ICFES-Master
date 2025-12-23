#!/usr/bin/env python3
"""
Script para verificar que todos los archivos markdown tengan la estructura completa
"""
import os
import re
from pathlib import Path
from collections import defaultdict

MARKDOWN_DIR = "/home/fravelz/Documentos/scripts/markdown"

REQUIRED_FIELDS = {
    'id': True,
    'title': True,
    'area': True,
    'order': True,
    'type': 'lesson',
    'published': True,
    'summary': True,
    'xp': 15,
    'coins': 10,
    'questions': True
}

REQUIRED_QUESTION_FIELDS = ['id', 'type', 'question', 'options', 'correct_answer', 'explanation', 'difficulty']

def verify_file(filepath):
    """Verifica que un archivo tenga toda la estructura requerida"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    filename = os.path.basename(filepath)
    issues = []
    
    # Extraer frontmatter
    frontmatter_match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not frontmatter_match:
        return filename, ['❌ No tiene frontmatter válido']
    
    frontmatter_text = frontmatter_match.group(1)
    
    # Verificar campos requeridos
    for field, expected_value in REQUIRED_FIELDS.items():
        if field == 'questions':
            # Verificar que existe questions:
            if 'questions:' not in frontmatter_text:
                issues.append(f'❌ Falta campo: questions')
            else:
                # Verificar estructura de preguntas
                questions_match = re.search(r'questions:\s*\n((?:\s+-\s+id:.*?\n(?:\s+.*?\n)*?)+)', frontmatter_text, re.DOTALL)
                if not questions_match:
                    issues.append(f'❌ questions existe pero no tiene preguntas válidas')
                else:
                    questions_text = questions_match.group(1)
                    # Contar preguntas
                    question_blocks = re.findall(r'-\s+id:\s*(\S+).*?(?=-\s+id:|\Z)', questions_text, re.DOTALL)
                    if len(question_blocks) == 0:
                        issues.append(f'❌ questions no tiene ninguna pregunta')
                    else:
                        # Verificar cada pregunta
                        for i, q_block in enumerate(question_blocks, 1):
                            q_text = re.search(rf'-\s+id:\s*{re.escape(q_block)}.*?(?=-\s+id:|\Z)', questions_text, re.DOTALL)
                            if q_text:
                                q_content = q_text.group(0)
                                for q_field in REQUIRED_QUESTION_FIELDS:
                                    if q_field == 'options':
                                        if 'options:' not in q_content:
                                            issues.append(f'❌ Pregunta {i} ({q_block}) falta: options')
                                        else:
                                            # Verificar que tenga al menos 2 opciones
                                            options_match = re.search(r'options:\s*\n((?:\s+-\s+.*?\n)+)', q_content)
                                            if options_match:
                                                options = re.findall(r'-\s+"([^"]+)"', options_match.group(1))
                                                if len(options) < 2:
                                                    issues.append(f'❌ Pregunta {i} ({q_block}) tiene menos de 2 opciones')
                                    else:
                                        if f'{q_field}:' not in q_content:
                                            issues.append(f'❌ Pregunta {i} ({q_block}) falta: {q_field}')
        else:
            # Verificar campo simple
            pattern = rf'^{field}:\s*(.+)$'
            match = re.search(pattern, frontmatter_text, re.MULTILINE)
            if not match:
                issues.append(f'❌ Falta campo: {field}')
            else:
                value = match.group(1).strip()
                if expected_value is True:
                    # Solo verificar que existe
                    pass
                elif isinstance(expected_value, (int, str)):
                    # Verificar valor específico
                    if str(value) != str(expected_value):
                        issues.append(f'⚠️  Campo {field} tiene valor "{value}" pero se esperaba "{expected_value}"')
    
    # Verificar orden del frontmatter (summary debe estar después de published y antes de xp)
    lines = frontmatter_text.split('\n')
    published_idx = None
    summary_idx = None
    xp_idx = None
    
    for i, line in enumerate(lines):
        if line.startswith('published:'):
            published_idx = i
        elif line.startswith('summary:'):
            summary_idx = i
        elif line.startswith('xp:'):
            xp_idx = i
    
    if published_idx is not None and summary_idx is not None and xp_idx is not None:
        if not (published_idx < summary_idx < xp_idx):
            issues.append(f'⚠️  Orden incorrecto: summary debe estar después de published y antes de xp')
    
    return filename, issues

def main():
    """Función principal"""
    markdown_dir = Path(MARKDOWN_DIR)
    if not markdown_dir.exists():
        print(f"Error: Directorio {MARKDOWN_DIR} no existe")
        return
    
    md_files = list(markdown_dir.glob('*.md'))
    md_files = [f for f in md_files if f.name != 'here.md']  # Excluir here.md
    
    print(f"Verificando estructura de {len(md_files)} archivos markdown...\n")
    
    files_with_issues = []
    files_ok = []
    
    for md_file in sorted(md_files):
        filename, issues = verify_file(md_file)
        if issues:
            files_with_issues.append((filename, issues))
        else:
            files_ok.append(filename)
    
    # Mostrar resultados
    if files_ok:
        print(f"✅ Archivos correctos ({len(files_ok)}):")
        for f in files_ok:
            print(f"   ✓ {f}")
        print()
    
    if files_with_issues:
        print(f"❌ Archivos con problemas ({len(files_with_issues)}):")
        for filename, issues in files_with_issues:
            print(f"\n📄 {filename}:")
            for issue in issues:
                print(f"   {issue}")
        print()
    
    print(f"\n{'='*60}")
    print(f"Resumen: {len(files_ok)} correctos, {len(files_with_issues)} con problemas")
    print(f"{'='*60}")

if __name__ == "__main__":
    main()

