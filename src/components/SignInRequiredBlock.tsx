'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faSignInAlt, faTimes } from '@fortawesome/free-solid-svg-icons';

interface SignInRequiredBlockProps {
  title?: string;
  message?: string;
}

export default function SignInRequiredBlock({
  title = 'Inicia sesión para continuar',
  message = 'Esta sección requiere que inicies sesión con tu cuenta para poder utilizarla.',
}: SignInRequiredBlockProps) {
  const handleCloseDemo = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('demoMode');
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center p-6 bg-linear-to-b from-black via-slate-950 to-black">
      <div className="max-w-md w-full bg-slate-800/50 border border-slate-700 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-cyan-500/20 border-2 border-cyan-500/50 flex items-center justify-center">
          <FontAwesomeIcon icon={faLock} className="text-3xl text-cyan-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>
        <p className="text-slate-400 mb-8">{message}</p>
        <div className="flex flex-col gap-3">
          <Link
            href="/login"
            className="w-full py-3 px-6 bg-linear-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faSignInAlt} />
            Iniciar Sesión
          </Link>
          <button
            onClick={handleCloseDemo}
            className="w-full py-3 px-6 bg-transparent border-2 border-slate-600 text-slate-400 hover:border-slate-500 hover:text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faTimes} />
            Cerrar Demo
          </button>
        </div>
      </div>
    </div>
  );
}
