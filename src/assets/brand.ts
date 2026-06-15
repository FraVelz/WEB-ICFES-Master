import type { StaticImageData } from 'next/image';

import brandMark from './brand/brand-mark.png';
import screenshot from './images/screenshot.png';

export const BRAND_IMAGES = {
  brandMark,
  screenshot,
} as const satisfies Record<string, StaticImageData>;
