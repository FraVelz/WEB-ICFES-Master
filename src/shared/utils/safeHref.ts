const BLOCKED_PROTOCOLS = ['javascript:', 'data:', 'vbscript:'];

export function isSafeHref(href: string | undefined): boolean {
  if (!href) return false;
  const trimmed = href.trim().toLowerCase();
  if (trimmed.startsWith('#') || trimmed.startsWith('/')) return true;
  if (BLOCKED_PROTOCOLS.some((protocol) => trimmed.startsWith(protocol))) return false;
  return trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('mailto:');
}
