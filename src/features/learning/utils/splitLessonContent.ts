/**
 * Split markdown into navigable chunks (pairs of ## / ### headings, Duolingo-style).
 */
export function splitLessonContent(content: string): string[] {
  if (!content || typeof content !== 'string') return [];

  const trimmed = content.trim();
  if (!trimmed) return [];

  // Split on ## or ### headings
  const parts = trimmed.split(/\n(?=#{2,3}\s)/);

  if (parts.length <= 1) return [trimmed];

  // Pair consecutive blocks: one section = two headings
  const sections: string[] = [];
  for (let i = 0; i < parts.length; i += 2) {
    const pair = parts.slice(i, i + 2);
    sections.push(pair.join('\n\n'));
  }
  return sections;
}

/**
 * First ##/### heading in a chunk (mascot bubble title).
 */
export function extractSectionTitle(section: string): string {
  const match = section.match(/^#{2,3}\s+(.+?)(?:\n|$)/);
  return match ? match[1].trim() : '';
}

/**
 * Strip the first heading when it duplicates the bubble title (avoid duplicate headings on screen).
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
