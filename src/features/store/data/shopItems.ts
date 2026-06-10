import type { ImageSource } from '@/assets';
import { SHOP_LOGO_ITEMS } from './shopLogoItems';

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  icon: string;
  color: string;
  image?: ImageSource;
}

const BASE_SHOP_ITEMS: ShopItem[] = [
  {
    id: 'powerup_double_xp',
    name: 'Doble XP (1h)',
    description: 'Gana el doble de experiencia por 1 hora.',
    price: 300,
    category: 'powerup',
    icon: 'bolt',
    color: 'from-yellow-400 to-orange-500',
  },
  {
    id: 'powerup_shield',
    name: 'Protector de Racha',
    description: 'Salva tu racha si fallas un día. Puedes tener hasta 3.',
    price: 400,
    category: 'powerup',
    icon: 'shield-alt',
    color: 'from-green-400 to-emerald-600',
  },
  {
    id: 'badge_vip',
    name: 'Insignia VIP',
    description: 'Borde dorado en tu perfil y en la clasificatoria.',
    price: 5000,
    category: 'badge',
    icon: 'crown',
    color: 'from-yellow-300 to-yellow-600',
  },
];

export const SHOP_ITEMS: ShopItem[] = [...BASE_SHOP_ITEMS, ...SHOP_LOGO_ITEMS];
