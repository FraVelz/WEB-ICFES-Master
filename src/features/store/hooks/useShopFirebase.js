import { useState, useEffect } from 'react';
import { db } from '@/config/firebase';
import { doc, collection, onSnapshot, runTransaction, serverTimestamp, query, getDocs } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { SHOP_ITEMS } from '../data/shopItems';

export const useShopFirebase = () => {
  const { user } = useAuth();
  const [coins, setCoins] = useState(0);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Escuchar cambios en monedas y compras
  useEffect(() => {
    if (!user?.uid) return;

    setLoading(true);

    // 1. Escuchar monedas del usuario
    const userUnsub = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setCoins(userData.virtualMoney || 0);
      }
    });

    // 2. Escuchar compras
    const purchasesQuery = collection(db, 'users', user.uid, 'purchases');
    const purchasesUnsub = onSnapshot(purchasesQuery, (snapshot) => {
      const purchasedItems = snapshot.docs.map(doc => doc.data().itemId);
      setPurchases(purchasedItems);
      setLoading(false);
    });

    return () => {
      userUnsub();
      purchasesUnsub();
    };
  }, [user?.uid]);

  /**
   * Realizar compra de un ítem
   */
  const buyItem = async (item) => {
    if (!user?.uid) throw new Error("Usuario no autenticado");
    if (purchases.includes(item.id) && item.category !== 'powerup') {
      throw new Error("Ya tienes este artículo");
    }
    if (coins < item.price) {
      throw new Error("Monedas insuficientes");
    }

    setProcessing(true);

    try {
      await runTransaction(db, async (transaction) => {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await transaction.get(userRef);

        if (!userDoc.exists()) {
          throw new Error("Usuario no encontrado");
        }

        const currentCoins = userDoc.data().virtualMoney || 0;
        if (currentCoins < item.price) {
          throw new Error("Monedas insuficientes");
        }

        // 1. Descontar monedas
        transaction.update(userRef, {
          virtualMoney: currentCoins - item.price
        });

        // 2. Registrar compra
        // Usamos el ID del item como ID del documento para evitar duplicados en items únicos
        // Para consumibles (powerups), usamos un ID único generado
        const purchaseId = item.category === 'powerup' 
          ? `${item.id}_${Date.now()}` 
          : item.id;
          
        const purchaseRef = doc(db, 'users', user.uid, 'purchases', purchaseId);
        
        transaction.set(purchaseRef, {
          itemId: item.id,
          name: item.name,
          price: item.price,
          category: item.category,
          purchasedAt: serverTimestamp()
        });
      });

      setProcessing(false);
      return true;
    } catch (error) {
      console.error("Error en compra:", error);
      setProcessing(false);
      throw error;
    }
  };

  return {
    coins,
    purchases,
    loading,
    processing,
    buyItem,
    shopItems: SHOP_ITEMS // Exportamos los items estáticos por ahora
  };
};
