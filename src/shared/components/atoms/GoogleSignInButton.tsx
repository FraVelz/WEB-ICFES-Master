import { useState } from 'react';
import { Icon } from '@/shared/components/Icon';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export const GoogleSignInButton = () => {
  const { loginWithGoogle, error } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      setLocalError('');
      setIsLoading(true);
      await loginWithGoogle();
      // Redirigir al dashboard después del login exitoso
      router.push('/dashboard');
    } catch (err) {
      setLocalError('No se pudo iniciar sesión con Google. Intenta de nuevo.');
      console.error('Error en Google Sign-In:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const displayError = localError || error;

  return (
    <div className="space-y-3">
      {/* Divisor */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-black text-slate-400">O continúa con</span>
        </div>
      </div>

      {/* Botón Google */}
      <button
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        type="button"
        className="cursor-pointer w-full py-3 px-4 bg-white text-black font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-gray-300"
      >
        {isLoading ? (
          <>
            <Icon name="spinner" className="animate-spin" />
            Conectando...
          </>
        ) : (
          <>
            <Icon name="google" className="text-red-500" />
            Continuar con Google
          </>
        )}
      </button>

      {/* Error Message */}
      {displayError && (
        <div className="flex items-start gap-3 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
          <Icon name="exclamation-circle" className="text-red-400 mt-0.5 shrink-0" />
          <p className="text-sm text-red-400">{displayError}</p>
        </div>
      )}
    </div>
  );
};
