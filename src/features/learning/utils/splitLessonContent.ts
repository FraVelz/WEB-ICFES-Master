/**
 * Divide el contenido markdown en secciones navegables (sub-subtítulos).
 * Cada ## o ### crea una sección independiente para navegación tipo Duolingo.
 */
export function splitLessonContent(content: string): string[] {
  if (!content || typeof content !== 'string') return [];

  const trimmed = content.trim();
  if (!trimmed) return [];

  // Dividir por ## o ### (cada encabezado = una sección)
  const parts = trimmed.split(/\n(?=#{2,3}\s)/);

  if (parts.length <= 1) return [trimmed];
  return parts;
}

/**
 * Extrae el primer encabezado (## o ###) de una sección para el globo de la mascota.
 */
export function extractSectionTitle(section: string): string {
  const match = section.match(/^#{2,3}\s+(.+?)(?:\n|$)/);
  return match ? match[1].trim() : '';
}
