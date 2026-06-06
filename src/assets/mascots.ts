import type { StaticImageData } from 'next/image';

import celebrando from './avatars/celebrando.webp';
import celebrando2 from './avatars/celebrando-2.webp';
import depcecionado from './avatars/depcecionado.webp';
import logo from './avatars/logo.webp';
import neutral from './avatars/neutral.webp';
import pensativo from './avatars/pensativo.webp';
import saludando from './avatars/saludando.webp';
import triste from './avatars/triste.webp';

export const MASCOT_IMAGES = {
  logo,
  celebrando,
  celebrando2,
  depcecionado,
  neutral,
  pensativo,
  saludando,
  triste,
} as const satisfies Record<string, StaticImageData>;

export type MascotImageKey = keyof typeof MASCOT_IMAGES;

export function mascotSrc(key: MascotImageKey): StaticImageData {
  return MASCOT_IMAGES[key];
}
