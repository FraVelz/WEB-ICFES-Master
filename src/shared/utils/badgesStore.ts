// Badge shop (virtual currency)
import { getVirtualMoney, removeVirtualMoney } from './userProfile';

const STORAGE_KEY = 'icfes_badges_store';

/**
 * Shop catalog
 * Higher tiers stay locked until the previous badge is purchased
 */
export const BADGES_CATALOG = [
  {
    id: 1,
    name: 'Iniciador',
    icon: '🌱',
    description: 'Tu primer paso en ICFES Master',
    price: 100,
    tier: 1,
    color: 'from-green-400 to-green-600',
    borderColor: 'border-green-500',
    requiresPrevious: null,
  },
  {
    id: 2,
    name: 'Estudiante Dedicado',
    icon: '📚',
    description: 'Completaste 5 exámenes',
    price: 250,
    tier: 2,
    color: 'from-blue-400 to-blue-600',
    borderColor: 'border-blue-500',
    requiresPrevious: 1,
  },
  {
    id: 3,
    name: 'Experto en Matemáticas',
    icon: '📐',
    description: 'Domina el área de Matemáticas',
    price: 350,
    tier: 3,
    color: 'from-yellow-400 to-yellow-600',
    borderColor: 'border-yellow-500',
    requiresPrevious: 2,
  },
  {
    id: 4,
    name: 'Maestro Lector',
    icon: '📖',
    description: 'Perfecciona tu Lectura Crítica',
    price: 350,
    tier: 3,
    color: 'from-cyan-400 to-cyan-600',
    borderColor: 'border-cyan-500',
    requiresPrevious: 2,
  },
  {
    id: 5,
    name: 'Científico Brillante',
    icon: '🔬',
    description: 'Domina las Ciencias Naturales',
    price: 350,
    tier: 3,
    color: 'from-green-400 to-green-600',
    borderColor: 'border-green-500',
    requiresPrevious: 2,
  },
  {
    id: 6,
    name: 'Ciudadano Ilustrado',
    icon: '🌍',
    description: 'Aprende sobre Sociales y Ciudadanía',
    price: 350,
    tier: 3,
    color: 'from-orange-400 to-orange-600',
    borderColor: 'border-orange-500',
    requiresPrevious: 2,
  },
  {
    id: 7,
    name: 'Campeón ICFES',
    icon: '🏆',
    description: 'Alcanza 90% de precisión',
    price: 500,
    tier: 4,
    color: 'from-purple-400 to-purple-600',
    borderColor: 'border-purple-500',
    requiresPrevious: 3,
  },
  {
    id: 8,
    name: 'Leyenda Académica',
    icon: '👑',
    description: 'El máximo logro posible',
    price: 750,
    tier: 5,
    color: 'from-yellow-300 to-yellow-500',
    borderColor: 'border-yellow-400',
    requiresPrevious: 7,
  },
];

/**
 * Purchased badge IDs
 */
export const getUserBadges = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

/**
 * Purchased badges with full catalog rows
 */
export const getUserBadgesWithDetails = () => {
  const purchasedIds = getUserBadges();
  return BADGES_CATALOG.filter((badge) => purchasedIds.includes(badge.id));
};

/**
 * Whether the user already owns a badge
 */
export const isBadgePurchased = (badgeId: string | number) => {
  return getUserBadges().includes(String(badgeId));
};

/**
 * Purchase eligibility (previous tier satisfied when required)
 */
export const canPurchaseBadge = (badgeId: string | number) => {
  const badge = BADGES_CATALOG.find((b) => String(b.id) === String(badgeId));
  if (!badge) return false;

  // Already owned
  if (isBadgePurchased(badgeId)) return false;

  // Starter tier
  if (badge.requiresPrevious === null) return true;

  // Require previous tier
  return isBadgePurchased(badge.requiresPrevious);
};

/**
 * Full catalog with purchased / locked flags
 */
export const getAllBadgesWithStatus = () => {
  return BADGES_CATALOG.map((badge) => ({
    ...badge,
    purchased: isBadgePurchased(String(badge.id)),
    canPurchase: canPurchaseBadge(badge.id),
    locked: !canPurchaseBadge(badge.id) && !isBadgePurchased(badge.id),
  }));
};

/**
 * Purchase a badge (deducts virtual currency)
 */
export const purchaseBadge = (badgeId: string | number) => {
  const badge = BADGES_CATALOG.find((b) => String(b.id) === String(badgeId));
  if (!badge) {
    throw new Error('Insignia no encontrada');
  }

  // Duplicate check
  if (isBadgePurchased(badgeId)) {
    throw new Error('Ya has comprado esta insignia');
  }

  // Eligibility
  if (!canPurchaseBadge(badgeId)) {
    throw new Error('Debes comprar la insignia anterior primero');
  }

  // Balance check
  const currentMoney = getVirtualMoney();

  if (currentMoney < badge.price) {
    throw new Error(`No tienes suficiente dinero. Necesitas ${badge.price} y tienes ${currentMoney}`);
  }

  // Debit
  removeVirtualMoney(badge.price);

  // Record purchase
  const badges = getUserBadges();
  badges.push(badgeId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(badges));

  return badge;
};

/**
 * Reset purchases (testing)
 */
export const clearBadges = () => {
  localStorage.removeItem(STORAGE_KEY);
};
