import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faLock, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useUser } from '@/features/user/hooks/useUser';
import {
  getAllBadgesWithStatus,
  purchaseBadge,
  getUserBadgesWithDetails
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
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-linear-to-br from-gray-800 to-gray-900 border-2 border-purple-500/50 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-linear-to-r from-purple-600 to-pink-600 p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-3xl font-black text-white flex items-center gap-3">
            <span className="text-4xl">🎖️</span>
            Tienda de Insignias
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="text-2xl" />
          </button>
        </div>

        {/* Current Money and Badges Display */}
        <div className="p-6 border-b border-white/10 bg-gray-900/50">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Money Display */}
            <div className="flex items-center gap-4 bg-linear-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-4 flex-1">
              <FontAwesomeIcon icon={faCoins} className="text-yellow-400 text-3xl" />
              <div>
                <p className="text-gray-400 text-sm">Tu Dinero Virtual</p>
                <p className="text-white font-bold text-2xl">{virtualMoney}</p>
              </div>
            </div>

            {/* Badges Count */}
            <div className="flex items-center gap-4 bg-linear-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-4 flex-1">
              <span className="text-4xl">🎖️</span>
              <div>
                <p className="text-gray-400 text-sm">Insignias Compradas</p>
                <p className="text-white font-bold text-2xl">{userBadges.length}/{badges.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        {purchaseMessage && (
          <div
            className={`mx-6 mt-6 p-4 rounded-lg border-l-4 ${
              messageType === 'success'
                ? 'bg-green-500/20 border-green-500 text-green-300'
                : 'bg-red-500/20 border-red-500 text-red-300'
            }`}
          >
            {purchaseMessage}
          </div>
        )}

        {/* Badges Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`relative rounded-2xl border-2 p-6 transition-all duration-300 ${
                badge.purchased
                  ? `bg-linear-to-br ${badge.color} ${badge.borderColor} opacity-100 hover:scale-105 cursor-default`
                  : badge.canPurchase
                  ? `bg-gray-800 border-white/20 hover:border-purple-500 hover:bg-gray-700/50 hover:scale-105 cursor-pointer`
                  : `bg-gray-800/50 border-gray-600/50 opacity-60 cursor-not-allowed`
              }`}
            >
              {/* Lock Icon for Locked Badges */}
              {badge.locked && (
                <div className="absolute top-2 right-2 bg-red-600 rounded-full p-2">
                  <FontAwesomeIcon icon={faLock} className="text-white text-lg" />
                </div>
              )}

              {/* Purchased Badge */}
              {badge.purchased && (
                <div className="absolute top-2 right-2 bg-green-600 rounded-full px-3 py-1 text-white text-xs font-bold flex items-center gap-1">
                  <FontAwesomeIcon icon={faCheck} className="text-xs" />
                  COMPRADA
                </div>
              )}

              {/* Badge Icon */}
              <div className="text-5xl mb-4 text-center">{badge.icon}</div>

              {/* Badge Info */}
              <h3 className={`font-bold text-lg mb-2 ${badge.purchased ? 'text-white' : 'text-white'}`}>
                {badge.name}
              </h3>

              <p className={`text-sm mb-4 ${badge.purchased ? 'text-white/80' : 'text-gray-400'}`}>
                {badge.description}
              </p>

              {/* Tier Info */}
              <div className={`text-xs font-semibold mb-4 ${badge.purchased ? 'text-white/70' : 'text-gray-500'}`}>
                Nivel {badge.tier}
              </div>

              {/* Purchase Button or Status */}
              {badge.purchased ? (
                <div className="text-center text-white font-bold">Tu insignia</div>
              ) : badge.canPurchase ? (
                <button
                  onClick={() => handlePurchase(badge)}
                  className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon icon={faCoins} />
                  <span>{badge.price}</span>
                </button>
              ) : (
                <div className="w-full bg-gray-600/50 text-gray-300 font-bold py-3 rounded-lg text-center cursor-not-allowed opacity-50">
                  Bloqueada
                </div>
              )}

              {/* Requirements Info */}
              {badge.locked && badge.requiresPrevious && (
                <div className="mt-4 text-xs text-yellow-300 bg-yellow-500/20 border border-yellow-500/30 rounded p-2 text-center">
                  Requiere: "{badges.find(b => b.id === badge.requiresPrevious)?.name}"
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
