export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  icon: string;
  color: string;
  image?: string;
}

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'avatar_robot',
    name: 'Robo-Tutor',
    description: 'La inteligencia artificial de tu lado.',
    price: 800,
    category: 'avatar',
    icon: 'robot',
    color: 'from-gray-500 to-slate-600',
    image: 'https://api.dicebear.com/7.x/bottts/svg?seed=Robo',
  },
  {
    id: 'avatar_dragon',
    name: 'Dragón Sabio',
    description: 'Poder ancestral para tus exámenes.',
    price: 1200,
    category: 'avatar',
    icon: 'fire',
    color: 'from-red-500 to-orange-600',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dragon&clothing=graphicShirt',
  },
  {
    id: 'theme_dark_purple',
    name: 'Tema Neón Púrpura',
    description: 'Personaliza tu interfaz con colores neón.',
    price: 1500,
    category: 'theme',
    icon: 'lightbulb',
    color: 'from-purple-500 to-pink-600',
  },
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
    description: 'Evita perder tu racha si fallas un día.',
    price: 400,
    category: 'powerup',
    icon: 'shield-alt',
    color: 'from-green-400 to-emerald-600',
  },
  {
    id: 'badge_vip',
    name: 'Insignia VIP',
    description: 'Destaca en la clasificatoria con un borde dorado.',
    price: 5000,
    category: 'badge',
    icon: 'crown',
    color: 'from-yellow-300 to-yellow-600',
  },
];
