/** Línea horizontal Markdown que separa pantallas de la lección. */
const SECTION_DIVIDER = /(?:\r?\n)\s*---\s*(?:\r?\n)/;

/**
 * Divide el markdown en pantallas usando `---` en una línea propia (regla horizontal).
 */
export function splitLessonContent(content: string): string[] {
  if (!content || typeof content !== 'string') return [];

  const trimmed = content.trim();
  if (!trimmed) return [];

  const sections = trimmed
    .split(SECTION_DIVIDER)
    .map((part) => part.trim())
    .filter(Boolean);

  return sections.length > 0 ? sections : [trimmed];
}

/**
 * Primer encabezado ## / ### del apartado (título del globo de la mascota).
 */
export function extractSectionTitle(section: string): string {
  const match = section.match(/#{2,3}\s+(.+?)(?:\n|$)/);
  return match ? match[1].trim() : '';
}

/**
 * Quita el primer encabezado si repite el título del globo (evita duplicar en pantalla).
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
