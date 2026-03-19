import { useState, useEffect } from 'react';
import { Icon } from '@/shared/components/Icon';
import { useUser } from '@/features/user/hooks/useUser';
import {
  getAllBadgesWithStatus,
  purchaseBadge,
  getUserBadgesWithDetails,
} from '@/shared/utils/badgesStore';

export const BadgesStore = ({ isOpen, onClose }) => {
  const { virtualMoney, refreshUser } = useUser();
  const [badges, setBadges] = useState([]);
  const [userBadges, setUserBadges] = useState([]);
  const [purchaseMessage, setPurchaseMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' o 'error'

  useEffect(() => {
    if (isOpen) {
      loadBadges();
    }
  }, [isOpen]);

  const loadBadges = () => {
    const allBadges = getAllBadgesWithStatus();
    setBadges(allBadges);
    const purchased = getUserBadgesWithDetails();
    setUserBadges(purchased);
  };

  const handlePurchase = (badge) => {
    try {
      purchaseBadge(badge.id);
      setMessageType('success');
      setPurchaseMessage(`¡Felicidades! Compraste "${badge.name}"`);
      refreshUser();
      loadBadges();
      setTimeout(() => setPurchaseMessage(''), 3000);
    } catch (error) {
      setMessageType('error');
      setPurchaseMessage(error.message);
      setTimeout(() => setPurchaseMessage(''), 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border-2 border-purple-500/50 bg-linear-to-br from-gray-800 to-gray-900">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-white/10 bg-linear-to-r from-purple-600 to-pink-600 p-6">
          <h2 className="flex items-center gap-3 text-3xl font-black text-white">
            <span className="text-4xl">🎖️</span>
            Tienda de Insignias
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-white transition-colors hover:bg-white/20"
          >
            <Icon name="times" className="text-2xl" />
          </button>
        </div>

        {/* Current Money and Badges Display */}
        <div className="border-b border-white/10 bg-gray-900/50 p-6">
          <div className="flex flex-col gap-8 md:flex-row">
            {/* Money Display */}
            <div className="flex flex-1 items-center gap-4 rounded-xl border border-yellow-500/30 bg-linear-to-r from-yellow-500/20 to-orange-500/20 p-4">
              <Icon name="coins" className="text-3xl text-yellow-400" />
              <div>
                <p className="text-sm text-gray-400">Tu Dinero Virtual</p>
                <p className="text-2xl font-bold text-white">{virtualMoney}</p>
              </div>
            </div>

            {/* Badges Count */}
            <div className="flex flex-1 items-center gap-4 rounded-xl border border-purple-500/30 bg-linear-to-r from-purple-500/20 to-pink-500/20 p-4">
              <span className="text-4xl">🎖️</span>
              <div>
                <p className="text-sm text-gray-400">Insignias Compradas</p>
                <p className="text-2xl font-bold text-white">
                  {userBadges.length}/{badges.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        {purchaseMessage && (
          <div
            className={`mx-6 mt-6 rounded-lg border-l-4 p-4 ${
              messageType === 'success'
                ? 'border-green-500 bg-green-500/20 text-green-300'
                : 'border-red-500 bg-red-500/20 text-red-300'
            }`}
          >
            {purchaseMessage}
          </div>
        )}

        {/* Badges Grid */}
        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`relative rounded-2xl border-2 p-6 transition-all duration-300 ${
                badge.purchased
                  ? `bg-linear-to-br ${badge.color} ${badge.borderColor} cursor-default opacity-100 hover:scale-105`
                  : badge.canPurchase
                    ? `cursor-pointer border-white/20 bg-gray-800 hover:scale-105 hover:border-purple-500 hover:bg-gray-700/50`
                    : `cursor-not-allowed border-gray-600/50 bg-gray-800/50 opacity-60`
              }`}
            >
              {/* Lock Icon for Locked Badges */}
              {badge.locked && (
                <div className="absolute top-2 right-2 rounded-full bg-red-600 p-2">
                  <Icon name="lock" className="text-lg text-white" />
                </div>
              )}

              {/* Purchased Badge */}
              {badge.purchased && (
                <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white">
                  <Icon name="check" size="sm" className="text-xs" />
                  COMPRADA
                </div>
              )}

              {/* Badge Icon */}
              <div className="mb-4 flex justify-center text-center text-5xl">
                {typeof badge.icon === 'string' ? (
                  <Icon name={badge.icon} size="2xl" />
                ) : (
                  badge.icon
                )}
              </div>

              {/* Badge Info */}
              <h3
                className={`mb-2 text-lg font-bold ${badge.purchased ? 'text-white' : 'text-white'}`}
              >
                {badge.name}
              </h3>

              <p
                className={`mb-4 text-sm ${badge.purchased ? 'text-white/80' : 'text-gray-400'}`}
              >
                {badge.description}
              </p>

              {/* Tier Info */}
              <div
                className={`mb-4 text-xs font-semibold ${badge.purchased ? 'text-white/70' : 'text-gray-500'}`}
              >
                Nivel {badge.tier}
              </div>

              {/* Purchase Button or Status */}
              {badge.purchased ? (
                <div className="text-center font-bold text-white">
                  Tu insignia
                </div>
              ) : badge.canPurchase ? (
                <button
                  onClick={() => handlePurchase(badge)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-purple-600 to-pink-600 py-3 font-bold text-white transition-all duration-300 hover:from-purple-700 hover:to-pink-700"
                >
                  <Icon name="coins" />
                  <span>{badge.price}</span>
                </button>
              ) : (
                <div className="w-full cursor-not-allowed rounded-lg bg-gray-600/50 py-3 text-center font-bold text-gray-300 opacity-50">
                  Bloqueada
                </div>
              )}

              {/* Requirements Info */}
              {badge.locked && badge.requiresPrevious && (
                <div className="mt-4 rounded border border-yellow-500/30 bg-yellow-500/20 p-2 text-center text-xs text-yellow-300">
                  Requiere: "
                  {badges.find((b) => b.id === badge.requiresPrevious)?.name}"
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
