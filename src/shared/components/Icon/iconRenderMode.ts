import { ICON_SOURCES } from './iconSources';

export type IconRenderMode = 'stroke' | 'fill';

/** Derives stroke vs fill from icons0 collection prefix and solid variants. */
export function getIconRenderMode(name: keyof typeof ICON_SOURCES | string): IconRenderMode {
  const source = ICON_SOURCES[name as keyof typeof ICON_SOURCES];
  if (!source) return 'stroke';

  if (source.startsWith('simple-icons:')) return 'fill';
  if (source.startsWith('lucide:')) return 'stroke';
  if (source.includes('-solid')) return 'fill';
  if (name === 'play-circle') return 'fill';
  if (name === 'camera') return 'fill';
  if (name === 'cog') return 'fill';

  return 'stroke';
}
