import os
import json
import argparse
import logging
import datetime
from typing import List, Dict, Any, Optional

# Run: python scripts/ingest_content.py --format md
# O con ruta personalizada: python scripts/ingest_content.py --format md --key /path/to/credentials.json
# La ruta también se puede configurar con la variable de entorno FIREBASE_ADMIN_SDK_CREDENTIALS_PATH

# Librerías externas (ver requirements.txt)
import firebase_admin
from firebase_admin import credentials, firestore
import frontmatter  # Para leer metadatos de Markdown
# import fitz  # PyMuPDF para PDFs - Deshabilitado para evitar problemas de instalación

# Configuración de Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

class ContentIngestor:
    def __init__(self, service_account_path: str):
        """
        Inicializa la conexión a Firebase y configura el entorno.
        """
        self.base_path = os.path.dirname(os.path.abspath(__file__))
        
        # Inicializar Firebase solo si no está inicializado
        if not firebase_admin._apps:
            try:
                if os.path.exists(service_account_path):
                    cred = credentials.Certificate(service_account_path)
                    logger.info(f"Usando credenciales de archivo: {service_account_path}")
                else:
                    logger.warning(f"No se encontró {service_account_path}, intentando Application Default Credentials...")
                    cred = credentials.ApplicationDefault()
                
                firebase_admin.initialize_app(cred)
                logger.info("Firebase Admin SDK inicializado correctamente.")
            except Exception as e:
                logger.error(f"Error inicializando Firebase: {e}")
                raise e
        
        self.db = firestore.client()

    def normalize_area(self, area: str) -> str:
        """
        Normaliza el nombre del área para consistencia en Firestore.
        Convierte espacios y guiones a guiones bajos.
        Mapea áreas según lo esperado por el frontend.
        """
        if not area:
            return area
        
        # Normalizar: convertir espacios a guiones bajos y todo a minúsculas
        normalized = area.lower().replace(' ', '_').replace('-', '_')
        
        # Mapeos específicos para áreas comunes
        # IMPORTANTE: El frontend espera 'sociales' (sin _y_ciudadanas) para la colección learning_sociales
        area_mappings = {
            'sociales_y_ciudadanas': 'sociales',  # Mapea a 'sociales' para colección learning_sociales
            'sociales-ciudadanas': 'sociales',     # Mapea a 'sociales' para colección learning_sociales
            'sociales': 'sociales',                # Ya está normalizado
            'lectura_critica': 'lectura_critica',
            'lectura-critica': 'lectura_critica',
            'ciencias_naturales': 'ciencias_naturales',
            'ciencias-naturales': 'ciencias_naturales',
        }
        
        return area_mappings.get(normalized, normalized)

    def validate_model(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Valida y normaliza los datos al Modelo JSON Unificado.
        Rellena valores por defecto si faltan.
        """
        required_fields = ['title', 'area']
        for field in required_fields:
            if field not in data or not data.get(field):
                # Intentar inferir area del nombre del archivo si no está en frontmatter
                # Esto se maneja mejor antes de llamar a validate_model, pero por seguridad:
                if field == 'area':
                    # Intentar inferir área una vez más como último recurso
                    filename = data.get('metadata', {}).get('filename', '')
                    if filename:
                        filename_lower = filename.lower()
                        if filename_lower.startswith('matematicas'):
                            data['area'] = 'matematicas'
                        elif filename_lower.startswith('lectura'):
                            data['area'] = 'lectura_critica'
                        elif filename_lower.startswith('sociales'):
                            data['area'] = 'sociales'  # Mapea a 'sociales' para colección learning_sociales
                        elif filename_lower.startswith('ciencias'):
                            data['area'] = 'ciencias_naturales'
                        elif filename_lower.startswith('ingles'):
                            data['area'] = 'ingles'
                
                if field not in data or not data.get(field):
                    raise ValueError(f"El campo '{field}' es obligatorio.")

        # Normalizar área
        area = self.normalize_area(data.get("area", ""))
        
        # Validar y normalizar preguntas
        questions = data.get("questions", [])
        validated_questions = []
        for q in questions:
            if isinstance(q, dict):
                # Validar estructura mínima de pregunta
                if 'question' in q and 'options' in q and 'correct_answer' in q:
                    validated_questions.append({
                        "id": q.get("id", ""),
                        "type": q.get("type", "opcion_multiple"),
                        "question": q.get("question", ""),
                        "options": q.get("options", []),
                        "correct_answer": int(q.get("correct_answer", 0)),
                        "explanation": q.get("explanation", ""),
                        "difficulty": q.get("difficulty", "media")
                    })
                else:
                    logger.warning(f"Pregunta inválida omitida: {q.get('id', 'sin id')}")
        
        # Modelo Unificado
        unified_model = {
            "id": data.get("id"), # Si es None, Firestore generará uno
            "type": data.get("type", "lesson"),
            "area": area,
            "title": data.get("title"),
            "order": int(data.get("order", 999)),
            "content": data.get("content", ""),
            "description": data.get("description", ""),  # Descripción de la lección
            "xp": int(data.get("xp", 500)),  # Puntos de experiencia (default: 500)
            "coins": int(data.get("coins", 250)),  # Monedas virtuales (default: 250)
            "images": data.get("images", []),
            "questions": validated_questions,
            "metadata": {
                "source": data.get("metadata", {}).get("source", "unknown"),
                "lastUpdated": datetime.datetime.now()
            },
            # Campos adicionales para control de publicación
            "published": data.get("published", True)
            # Nota: createdAt y updatedAt se establecerán con SERVER_TIMESTAMP en upload_batch
        }
        return unified_model

    def parse_json(self, file_path: str) -> Optional[Dict[str, Any]]:
        """Procesa archivos .json"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            data['metadata'] = {"source": "json"}
            return self.validate_model(data)
        except Exception as e:
            logger.error(f"Error procesando JSON {file_path}: {e}")
            return None

    def parse_markdown(self, file_path: str) -> Optional[Dict[str, Any]]:
        """
        Procesa archivos .md usando Frontmatter para metadatos.
        El contenido del MD se convierte al campo 'content'.
        Extrae todos los campos del frontmatter incluyendo xp, coins y questions.
        Establece valores por defecto: xp=500, coins=250 si no están presentes.
        """
        try:
            # Leer el archivo completo primero para detectar problemas de formato
            with open(file_path, 'r', encoding='utf-8') as f:
                raw_content = f.read()
            
            # Verificar si hay problemas con el formato del frontmatter
            # Algunos archivos tienen ---# sin salto de línea al final del frontmatter
            import re
            # Buscar patrón --- seguido de # (en la misma línea o siguiente)
            # Patrón: --- seguido opcionalmente de espacios y luego #
            if re.search(r'---\s*#', raw_content):
                # Corregir: reemplazar ---# o --- # con ---\n\n#
                # Primero buscar el patrón específico al final del frontmatter
                raw_content = re.sub(r'\n---\s*#', '\n---\n\n#', raw_content)
                raw_content = re.sub(r'---\s*#', '---\n\n#', raw_content)
                logger.warning(f"Corregido formato de frontmatter en {os.path.basename(file_path)}")
            
            # Cargar con frontmatter
            post = None
            data = {}
            try:
                post = frontmatter.loads(raw_content)
                data = post.metadata.copy() if post.metadata else {}
            except Exception as e:
                logger.warning(f"Error al parsear frontmatter en {os.path.basename(file_path)}: {e}")
                post = None
            
            # Si el parse falló o no hay datos, intentar parse manual
            if not post or not data:
                logger.warning(f"Parse manual de frontmatter en {os.path.basename(file_path)}")
                if raw_content.startswith('---'):
                    # Buscar el final del frontmatter
                    frontmatter_end = raw_content.find('\n---', 3)
                    if frontmatter_end == -1:
                        # Buscar patrón alternativo: --- seguido de # o salto de línea
                        frontmatter_end = re.search(r'---\s*\n\s*#', raw_content)
                        if frontmatter_end:
                            frontmatter_end = frontmatter_end.start()
                    
                    if frontmatter_end > 0:
                        # Parse básico del frontmatter
                        frontmatter_text = raw_content[4:frontmatter_end]
                        content_text = raw_content[frontmatter_end + 5:] if frontmatter_end + 5 < len(raw_content) else ""
                        
                        # Parsear líneas del frontmatter usando un enfoque más robusto
                        # Intentar usar yaml.safe_load si está disponible para parsear correctamente
                        try:
                            import yaml
                            # Intentar parsear el frontmatter completo con YAML
                            parsed_yaml = yaml.safe_load(frontmatter_text)
                            if parsed_yaml and isinstance(parsed_yaml, dict):
                                data.update(parsed_yaml)
                                logger.info(f"Frontmatter parseado exitosamente con YAML en {os.path.basename(file_path)}")
                            else:
                                raise ValueError("YAML parse retornó None o no es un dict")
                        except Exception as yaml_error:
                            logger.debug(f"YAML parse falló, usando parse manual: {yaml_error}")
                            # Parse manual línea por línea
                            current_list_key = None
                            current_list_item = None
                            in_options_list = False
                            
                            for line in frontmatter_text.split('\n'):
                                line_stripped = line.strip()
                                line_original = line
                                
                                # Saltar líneas vacías y comentarios
                                if not line_stripped or line_stripped.startswith('#'):
                                    continue
                                
                                # Detectar inicio de lista (questions:)
                                if line_stripped.startswith('- '):
                                    if current_list_key == 'questions':
                                        # Es una nueva pregunta
                                        item_text = line_stripped[2:].strip()
                                        if ':' in item_text:
                                            # Es un objeto dentro de la lista
                                            item_dict = {}
                                            # Parsear el primer par clave:valor del item
                                            item_parts = item_text.split(':', 1)
                                            if len(item_parts) == 2:
                                                item_key = item_parts[0].strip()
                                                item_value = item_parts[1].strip().strip('"').strip("'")
                                                item_dict[item_key] = item_value
                                            current_list_item = item_dict
                                            in_options_list = False
                                            if current_list_key not in data:
                                                data[current_list_key] = []
                                            data[current_list_key].append(current_list_item)
                                    elif in_options_list and current_list_item:
                                        # Es una opción dentro de la lista de opciones
                                        option_value = line_stripped[2:].strip().strip('"').strip("'")
                                        if 'options' not in current_list_item:
                                            current_list_item['options'] = []
                                        current_list_item['options'].append(option_value)
                                    continue
                                
                                # Si estamos dentro de un item de lista (línea con indentación)
                                if current_list_item and (line_original.startswith('  ') or line_original.startswith('\t')):
                                    line_clean = line_stripped
                                    
                                    # Detectar si es la clave 'options:' que inicia una lista
                                    if line_clean.startswith('options:'):
                                        in_options_list = True
                                        current_list_item['options'] = []
                                        continue
                                    
                                    # Si estamos en modo options, las líneas con '-' son opciones
                                    if in_options_list and line_clean.startswith('- '):
                                        option_value = line_clean[2:].strip().strip('"').strip("'")
                                        current_list_item['options'].append(option_value)
                                        continue
                                    
                                    # Si encontramos otra clave después de options, salir del modo options
                                    if in_options_list and ':' in line_clean and not line_clean.startswith('- '):
                                        in_options_list = False
                                    
                                    # Parsear propiedad del item (no es una opción)
                                    if ':' in line_clean and not line_clean.startswith('- '):
                                        item_parts = line_clean.split(':', 1)
                                        if len(item_parts) == 2:
                                            item_key = item_parts[0].strip()
                                            item_value = item_parts[1].strip().strip('"').strip("'")
                                            
                                            # Si es 'options:', inicializar lista
                                            if item_key == 'options':
                                                in_options_list = True
                                                current_list_item['options'] = []
                                                continue
                                            
                                            # Convertir tipos
                                            if item_value.lower() == 'true':
                                                item_value = True
                                            elif item_value.lower() == 'false':
                                                item_value = False
                                            elif item_value.isdigit():
                                                item_value = int(item_value)
                                            current_list_item[item_key] = item_value
                                    continue
                                else:
                                    # Ya no estamos en el item, resetear
                                    if not (line_original.startswith('  ') or line_original.startswith('\t')):
                                        current_list_item = None
                                        current_list_key = None
                                        in_options_list = False
                                
                                # Parsear línea normal clave:valor
                                if ':' in line_stripped and not line_stripped.startswith('-'):
                                    parts = line_stripped.split(':', 1)
                                    if len(parts) == 2:
                                        key = parts[0].strip()
                                        value = parts[1].strip()
                                        
                                        # Remover comillas si están presentes
                                        if (value.startswith('"') and value.endswith('"')) or (value.startswith("'") and value.endswith("'")):
                                            value = value[1:-1]
                                        
                                        # Detectar si es inicio de lista (questions:, options:, etc.)
                                        if value == '' or value == '[]' or key == 'questions':
                                            data[key] = []
                                            current_list_key = key
                                            current_list_item = None
                                            continue
                                        
                                        # Detectar si es una propiedad que contiene una lista (options dentro de pregunta)
                                        if current_list_item and key == 'options':
                                            # Inicializar lista de opciones en el item actual
                                            current_list_item[key] = []
                                            continue
                                        
                                        # Convertir valores booleanos
                                        if value.lower() == 'true':
                                            value = True
                                        elif value.lower() == 'false':
                                            value = False
                                        # Convertir valores numéricos
                                        elif value.isdigit():
                                            value = int(value)
                                        
                                        data[key] = value
                                        current_list_key = None
                                        current_list_item = None
                        
                        # Crear objeto post simulado
                        class MockPost:
                            def __init__(self, metadata, content):
                                self.metadata = metadata
                                self.content = content
                        post = MockPost(data, content_text)
                    else:
                        # Si no se encuentra frontmatter, usar todo como contenido
                        class MockPost:
                            def __init__(self, metadata, content):
                                self.metadata = metadata
                                self.content = content
                        post = MockPost({}, raw_content)
            
            # Asegurar que data existe
            if not data:
                data = post.metadata.copy() if hasattr(post, 'metadata') and post.metadata else {}
            
            # Establecer valores por defecto para xp y coins si no están presentes
            if 'xp' not in data:
                data['xp'] = 500
                logger.info(f"Estableciendo xp=500 por defecto en {os.path.basename(file_path)}")
            if 'coins' not in data:
                data['coins'] = 250
                logger.info(f"Estableciendo coins=250 por defecto en {os.path.basename(file_path)}")
            
            # El contenido del markdown va al campo content
            data['content'] = post.content
            
            # Preservar metadata existente o crear nueva
            if 'metadata' not in data:
                data['metadata'] = {}
            data['metadata']['source'] = 'markdown'
            data['metadata']['filename'] = os.path.basename(file_path)
            
            # Si no hay id en frontmatter, intentar inferirlo del nombre del archivo
            if 'id' not in data:
                filename_without_ext = os.path.splitext(os.path.basename(file_path))[0]
                data['id'] = filename_without_ext
                logger.info(f"ID inferido del nombre de archivo: {data['id']}")
            
            # Si no hay área en frontmatter, intentar inferirla del nombre del archivo
            if 'area' not in data:
                filename = os.path.basename(file_path).lower()
                # Intentar detectar área del nombre del archivo
                if filename.startswith('matematicas'):
                    data['area'] = 'matematicas'
                elif filename.startswith('lectura'):
                    data['area'] = 'lectura_critica'
                elif filename.startswith('sociales'):
                    data['area'] = 'sociales'  # Mapea a 'sociales' para colección learning_sociales
                elif filename.startswith('ciencias'):
                    data['area'] = 'ciencias_naturales'
                elif filename.startswith('ingles'):
                    data['area'] = 'ingles'
                else:
                    logger.warning(f"No se pudo inferir área del archivo {file_path}")
            
            # Si no hay título en frontmatter, intentar extraer del primer H1
            if 'title' not in data or not data.get('title'):
                # Buscar en el contenido del markdown
                lines = post.content.split('\n')
                for line in lines:
                    # Buscar H1 con formato # Título o ---# Título (caso especial)
                    line_clean = line.strip()
                    if line_clean.startswith('# '):
                        data['title'] = line_clean.replace('# ', '').strip()
                        logger.info(f"Título inferido del contenido: {data['title']}")
                        break
                    elif line_clean.startswith('---# '):
                        data['title'] = line_clean.replace('---# ', '').strip()
                        logger.info(f"Título inferido del contenido (formato especial): {data['title']}")
                        break
                
                # Si aún no hay título, usar el ID como fallback
                if 'title' not in data or not data.get('title'):
                    if 'id' in data:
                        # Convertir ID a título legible (ej: lectura_tipos_texto -> Tipos de texto)
                        title_from_id = data['id'].replace('_', ' ').replace('-', ' ')
                        # Capitalizar primera letra de cada palabra
                        data['title'] = ' '.join(word.capitalize() for word in title_from_id.split())
                        logger.warning(f"Título generado desde ID: {data['title']}")
                    else:
                        # Último recurso: usar el nombre del archivo
                        filename_without_ext = os.path.splitext(os.path.basename(file_path))[0]
                        title_from_filename = filename_without_ext.replace('_', ' ').replace('-', ' ')
                        data['title'] = ' '.join(word.capitalize() for word in title_from_filename.split())
                        logger.warning(f"Título generado desde nombre de archivo: {data['title']}")
            
            # Validar y normalizar preguntas
            if 'questions' in data:
                if not isinstance(data['questions'], list):
                    logger.warning(f"Campo 'questions' no es una lista en {os.path.basename(file_path)}, inicializando como lista vacía")
                    data['questions'] = []
                
                validated_questions = []
                for i, q in enumerate(data['questions']):
                    if not isinstance(q, dict):
                        logger.warning(f"Pregunta {i} en {file_path} no es un diccionario, omitiendo")
                        continue
                    
                    # Validar campos requeridos
                    if 'question' not in q or 'options' not in q or 'correct_answer' not in q:
                        logger.warning(f"Pregunta {q.get('id', i)} en {file_path} falta campos requeridos (question, options, correct_answer), omitiendo")
                        continue
                    
                    # Asegurar que correct_answer sea un entero
                    if 'correct_answer' in q:
                        try:
                            q['correct_answer'] = int(q['correct_answer'])
                        except (ValueError, TypeError):
                            logger.warning(f"correct_answer inválido en pregunta {q.get('id', i)} de {file_path}, omitiendo pregunta")
                            continue
                    
                    # Asegurar que options sea una lista
                    if not isinstance(q.get('options'), list):
                        logger.warning(f"options no es una lista en pregunta {q.get('id', i)} de {file_path}, omitiendo pregunta")
                        continue
                    
                    validated_questions.append(q)
                
                data['questions'] = validated_questions
            
            return self.validate_model(data)
        except Exception as e:
            logger.error(f"Error procesando Markdown {file_path}: {e}")
            import traceback
            logger.error(traceback.format_exc())
            return None

    def parse_pdf(self, file_path: str) -> Optional[Dict[str, Any]]:
        """
        Procesa archivos .pdf.
        Deshabilitado temporalmente.
        """
        logger.warning("Procesamiento de PDF deshabilitado.")
        return None
        # try:
        #     doc = fitz.open(file_path)
        # ... (resto del código comentado)

    def upload_batch(self, data_list: List[Dict[str, Any]]):
        """
        Sube una lista de documentos a Firestore usando Batch Writes.
        Agrupa por area y sube a learning_{area}.
        """
        if not data_list:
            logger.warning("No hay datos para subir.")
            return

        # Agrupar por area
        data_by_area = {}
        for item in data_list:
            area = item.get('area')
            if not area:
                logger.warning(f"Item sin area: {item.get('title')}")
                continue
            if area not in data_by_area:
                data_by_area[area] = []
            data_by_area[area].append(item)

        total_stats = {}

        for area, items in data_by_area.items():
            collection_name = f"learning_{area}"
            collection_ref = self.db.collection(collection_name)
            batch = self.db.batch()
            
            count_created = 0
            count_updated = 0
            
            # Firestore permite max 500 operaciones por batch.
            # Aquí asumimos < 500 por area para simplificar.
            
            for item in items:
                doc_id = item.get("id")
                
                # Preparar datos para Firestore
                firestore_data = item.copy()
                
                # Remover campos None antes de subir
                firestore_data = {k: v for k, v in firestore_data.items() if v is not None}
                
                if doc_id:
                    doc_ref = collection_ref.document(doc_id)
                    # Para actualizaciones, usar merge=True
                    # Establecer updatedAt con SERVER_TIMESTAMP
                    firestore_data['updatedAt'] = firestore.SERVER_TIMESTAMP
                    # No sobrescribir createdAt si ya existe
                    batch.set(doc_ref, firestore_data, merge=True)
                    count_updated += 1
                    logger.debug(f"Actualizando documento {doc_id} en {collection_name}")
                else:
                    doc_ref = collection_ref.document()
                    firestore_data['id'] = doc_ref.id
                    # Para nuevos documentos, establecer ambos timestamps
                    firestore_data['createdAt'] = firestore.SERVER_TIMESTAMP
                    firestore_data['updatedAt'] = firestore.SERVER_TIMESTAMP
                    batch.set(doc_ref, firestore_data)
                    count_created += 1
                    logger.debug(f"Creando nuevo documento {firestore_data['id']} en {collection_name}")

            try:
                batch.commit()
                logger.info(f"Batch completado para area '{area}' en '{collection_name}'.")
                total_stats[area] = len(items)
            except Exception as e:
                logger.error(f"Error al hacer commit del batch para {area}: {e}")

        # Imprimir resumen final
        print("\n" + "="*50)
        print("RESUMEN FINAL DE CARGA")
        print("="*50)
        print(f"Total de documentos procesados: {len(data_list)}")
        print(f"Documentos creados: {sum(1 for item in data_list if not item.get('id'))}")
        print(f"Documentos actualizados: {sum(1 for item in data_list if item.get('id'))}")
        print("\nDocumentos por Área:")
        for area, count in total_stats.items():
            print(f"  - {area}: {count} documentos (Colección: learning_{area})")
        print("\nEstructura de documentos (ejemplo):")
        print("  id, type, area, title, order, content, description, xp, coins, images, questions, metadata, published, createdAt, updatedAt")
        print("\nCampos extraídos del frontmatter:")
        print("  - id, title, area, order, type, published, description")
        print("  - xp (puntos de experiencia, default: 500)")
        print("  - coins (monedas virtuales, default: 250)")
        print("  - questions (array con: id, type, question, options, correct_answer, explanation, difficulty)")
        print("\nValores por defecto aplicados:")
        print("  - Si xp no está en frontmatter: se establece 500")
        print("  - Si coins no está en frontmatter: se establece 250")
        print("="*50 + "\n")

    def run(self, format_type: str):
        """
        Método principal que orquesta la lectura y subida.
        """
        source_dir = os.path.join(self.base_path, format_type)
        
        if not os.path.exists(source_dir):
            logger.error(f"El directorio {source_dir} no existe.")
            return

        if format_type == 'markdown':
            files = [f for f in os.listdir(source_dir) if f.endswith('.md') or f.endswith('.markdown')]
        else:
            files = [f for f in os.listdir(source_dir) if f.endswith(f".{format_type}" if format_type != 'pdf' else '.pdf')]
        
        if not files:
            logger.warning(f"No se encontraron archivos .{format_type} en {source_dir}")
            return

        logger.info(f"Procesando {len(files)} archivos de tipo {format_type}...")
        
        processed_data = []
        
        for filename in files:
            # Excluir archivos especiales o problemáticos
            if filename == 'here.md' or filename == 'here.markdown':
                logger.info(f"Omitiendo archivo especial: {filename}")
                continue
                
            file_path = os.path.join(source_dir, filename)
            result = None
            
            if format_type == 'json':
                result = self.parse_json(file_path)
            elif format_type == 'markdown' or format_type == 'md':
                result = self.parse_markdown(file_path)
            elif format_type == 'pdf':
                result = self.parse_pdf(file_path)
            
            if result:
                processed_data.append(result)

        self.upload_batch(processed_data)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Ingesta de contenido educativo a Firestore')
    
    parser.add_argument('--format', type=str, required=True, choices=['json', 'md', 'pdf'],
                        help='Formato de los archivos a procesar (json, md, pdf)')
    
    # collection ya no es requerido, se infiere del area
    parser.add_argument('--collection', type=str, required=False,
                        help='(Obsoleto) Nombre de la colección en Firestore. Se usa learning_{area}.')
    
    # Prioridad: 1) --key, 2) Variable de entorno, 3) default
    default_key = os.getenv('FIREBASE_ADMIN_SDK_CREDENTIALS_PATH', 'serviceAccountKey.json')
    parser.add_argument('--key', type=str, default=default_key,
                        help=f'Ruta al archivo de credenciales de Firebase (default: usa FIREBASE_ADMIN_SDK_CREDENTIALS_PATH o {default_key})')

    args = parser.parse_args()

    # Mapeo de 'md' a 'markdown' para carpetas
    fmt = 'markdown' if args.format == 'md' else args.format

    try:
        ingestor = ContentIngestor(args.key)
        ingestor.run(fmt)
    except Exception as e:
        logger.critical(f"Fallo crítico en la ejecución: {e}")

