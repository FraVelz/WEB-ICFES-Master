import type { StaticImageData } from 'next/image';

import screenshot from './images/screenshot.png';

export const BRAND_IMAGES = {
  screenshot,
} as const satisfies Record<string, StaticImageData>;
