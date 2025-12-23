import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

/**
 * Página de redirección para links de Firebase
 * Firebase envía enlaces a su dominio, esta página los intercepta
 * y redirige a tu página personalizada manteniendo los parámetros
 */
export const FirebaseRedirectPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener parámetros de Firebase (puede estar en query o hash)
    let mode = searchParams.get('mode');
    let oobCode = searchParams.get('oobCode');

    // Si no está en query params, intentar en el hash
    if (!oobCode && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      mode = hashParams.get('mode');
      oobCode = hashParams.get('oobCode');
    }

    console.log('Firebase Redirect - Mode:', mode, 'OobCode:', oobCode?.substring(0, 10) + '...');

    // Redirigir según el modo de Firebase
    if (mode === 'resetPassword' && oobCode) {
      // Redirigir a tu página personalizada de reset
      console.log('Redirigiendo a /reset-password');
      navigate(`/reset-password?oobCode=${encodeURIComponent(oobCode)}`, { replace: true });
    } else if (mode === 'verifyEmail' && oobCode) {
      // Puedes agregar más modos si lo necesitas
      navigate(`/verify-email?oobCode=${encodeURIComponent(oobCode)}`, { replace: true });
    } else if (mode === 'signIn' && oobCode) {
      navigate(`/sign-in?oobCode=${encodeURIComponent(oobCode)}`, { replace: true });
    } else {
      // Si no reconoce el modo, redirige al login
      console.warn('Modo de Firebase no reconocido:', mode, 'OobCode presente:', !!oobCode);
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1500);
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-[100dvh] bg-linear-to-b from-black via-slate-950 to-black text-white flex items-center justify-center px-6">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 text-center space-y-4">
        <FontAwesomeIcon 
          icon={faSpinner} 
          className="text-4xl text-cyan-400 animate-spin mx-auto"
        />
        <p className="text-xl text-slate-300">Procesando tu solicitud...</p>
        <p className="text-sm text-slate-400">Serás redirigido en un momento</p>
      </div>
    </div>
  );
};
