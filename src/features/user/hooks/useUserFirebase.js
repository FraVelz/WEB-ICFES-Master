import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

/**
 * Hook para obtener y sincronizar datos del usuario desde Firestore
 * @returns {Object} userData, loading, error
 */
export const useUserData = () => {
  const { user, getUserData } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setUserData(null);
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const data = await getUserData(user.uid);
        setUserData(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, user?.uid, getUserData]);

  return { userData, loading, error };
};
