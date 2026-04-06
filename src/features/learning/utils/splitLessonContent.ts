/**
 * Divide el contenido markdown en secciones navegables.
 * Cada sección agrupa 2 subtítulos (## o ###) para navegación tipo Duolingo.
 */
export function splitLessonContent(content: string): string[] {
  if (!content || typeof content !== 'string') return [];

  const trimmed = content.trim();
  if (!trimmed) return [];

  // Dividir por ## o ### (cada encabezado = un bloque)
  const parts = trimmed.split(/\n(?=#{2,3}\s)/);

  if (parts.length <= 1) return [trimmed];

  // Agrupar de 2 en 2: cada sección = 2 subtítulos
  const sections: string[] = [];
  for (let i = 0; i < parts.length; i += 2) {
    const pair = parts.slice(i, i + 2);
    sections.push(pair.join('\n\n'));
  }
  return sections;
}

/**
 * Extrae el primer encabezado (## o ###) de una sección para el globo de la mascota.
 */
export function extractSectionTitle(section: string): string {
  const match = section.match(/^#{2,3}\s+(.+?)(?:\n|$)/);
  return match ? match[1].trim() : '';
}

/**
 * Elimina el primer encabezado de la sección si coincide con el título del globo,
 * para evitar duplicar el título en pantalla.
 */
export function stripFirstHeadingIfDuplicate(section: string, bubbleTitle: string): string {
  if (!bubbleTitle || !section.trim()) return section;
  const match = section.match(/^(#{2,3}\s+.+?)(?:\n\n|\n|$)/);
  if (!match) return section;
  const firstLine = match[1];
  const extracted = extractSectionTitle(section);
  if (extracted && extracted === bubbleTitle) {
    return section.slice(firstLine.length).trim();
  }
  return section;
}
