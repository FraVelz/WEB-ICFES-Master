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
          <span className="bg-black px-2 text-slate-400">O continúa con</span>
        </div>
      </div>

      {/* Botón Google */}
      <button
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        type="button"
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 font-bold text-black transition-all duration-300 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
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
        <div className="flex items-start gap-3 rounded-lg border border-red-500/50 bg-red-500/20 p-3">
          <Icon
            name="exclamation-circle"
            className="mt-0.5 shrink-0 text-red-400"
          />
          <p className="text-sm text-red-400">{displayError}</p>
        </div>
      )}
    </div>
  );
};
