import type { StaticImageData } from 'next/image';

import logoNimbus from './shop/logos/logo-1.webp';
import logoInferno from './shop/logos/logo-2.webp';
import logoVolcan from './shop/logos/logo-3.webp';
import logoEstratega from './shop/logos/logo-4.webp';
import logoAcademia from './shop/logos/logo-5.webp';
import logoSakura from './shop/logos/logo-6.webp';
import logoFrio from './shop/logos/logo-7.webp';
import logoAjedrez from './shop/logos/logo-8.webp';
import logoSombra from './shop/logos/logo-9.webp';
import logoHoja from './shop/logos/logo-10.webp';
import logoElite from './shop/logos/logo-11.webp';
import logoDragon from './shop/logos/logo-12.webp';

/** Logos de tienda importados como assets (optimizados por Next.js). */
export const SHOP_LOGO_IMAGES = {
  logo_nimbus: logoNimbus,
  logo_inferno: logoInferno,
  logo_volcan: logoVolcan,
  logo_estratega: logoEstratega,
  logo_academia: logoAcademia,
  logo_sakura: logoSakura,
  logo_frio: logoFrio,
  logo_ajedrez: logoAjedrez,
  logo_sombra: logoSombra,
  logo_hoja: logoHoja,
  logo_elite: logoElite,
  logo_dragon: logoDragon,
} as const satisfies Record<string, StaticImageData>;

export type ShopLogoImageKey = keyof typeof SHOP_LOGO_IMAGES;

export function shopLogoSrc(key: ShopLogoImageKey): StaticImageData {
  return SHOP_LOGO_IMAGES[key];
}
