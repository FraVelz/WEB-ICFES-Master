/** Math delimiters in document order ($$…$$ blocks and $…$ inline). */
const MATH_IN_ORDER_RE = /\$\$([\s\S]+?)\$\$|(?<!\$)\$(?!\$)((?:\\.|[^$\\])+)\$(?!\$)/g;

export function extractMathLabels(markdown: string): string[] {
  const labels: string[] = [];
  for (const match of markdown.matchAll(MATH_IN_ORDER_RE)) {
    const raw = (match[1] ?? match[2] ?? '').trim();
    if (raw) labels.push(raw);
  }
  return labels;
}

function truncateForAria(label: string, max = 160): string {
  const normalized = label.replace(/\s+/g, ' ').trim();
  if (normalized.length <= max) return normalized;
  return `${normalized.slice(0, max - 1)}…`;
}

export function collectKatexNodes(root: HTMLElement): Element[] {
  return Array.from(root.querySelectorAll('.katex-display, .katex')).filter(
    (el) => el.classList.contains('katex-display') || !el.closest('.katex-display')
  );
}

export function annotateKatexNodes(root: HTMLElement, markdown: string): void {
  const labels = extractMathLabels(markdown);
  const nodes = collectKatexNodes(root);

  nodes.forEach((node, index) => {
    const source = labels[index];
    const label = source ? truncateForAria(source) : 'Fórmula matemática';
    node.setAttribute('role', 'math');
    node.setAttribute('aria-label', label);
  });
}
