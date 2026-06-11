import { ICONS } from './iconRegistry';
import { ICON_SOURCES } from './iconSources';

export type IconGalleryEntry = {
  name: keyof typeof ICONS;
  source: string;
};

/** Sorted list for the dev icon gallery and audits. */
export const ICON_GALLERY_ENTRIES: IconGalleryEntry[] = (Object.keys(ICONS) as (keyof typeof ICONS)[])
  .sort()
  .map((name) => ({
    name,
    source: ICON_SOURCES[name as keyof typeof ICON_SOURCES] ?? 'unknown',
  }));
