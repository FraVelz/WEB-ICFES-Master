'use client';
import { MascotaCircle } from "@/shared/components/MascotaCircle";

export const HomePageMobile = ({ isInitialLoad, onDemoAccess, isModalOpen, setIsModalOpen, expandedFaq, setExpandedFaq }) => {
  return (
    <div className="h-dvh w-screen bg-linear-to-b from-black via-slate-950 to-black text-white flex flex-col">
      {/* Background glow effects - Optimizado para móvil */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-blue-500/30 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-purple-500/30 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-2/3 left-3/4 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl animate-pulse"></div>
      </div>

      {/* Main Content - Centro */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4 px-6">
          {/* Logo */}
          <MascotaCircle 
          src='/avatars/logo.webp'
          size="md" interactive={false} bobbing={true} className="" />
         
          {/* App Name */}
          <h1 className="text-3xl font-bold text-white">ICFES Master</h1>
          
          {/* Tagline */}
          <p className="text-center text-gray-300 text-sm max-w-xs">
            Domina el examen ICFES con nuestras plataforma, y diviertete mientras aprendes.
          </p>
        </div>
      </div>

      {/* Bottom Buttons - Pegado abajo */}
      <div className="relative z-10 w-full px-6 py-6 gap-3 flex flex-col">
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              localStorage.setItem('demoMode', 'true');
              window.location.href = '/ruta-aprendizaje';
            }
          }}
          className="w-full bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 text-center block"
        >
          Probar Demo
        </button>
        
        <a
          href="/login"
          className="w-full bg-transparent border-2 border-blue-500 text-blue-400 hover:bg-blue-500/10 font-semibold py-3 rounded-lg transition-all duration-200 text-center block"
        >
          Iniciar Sesión
        </a>
      </div>
    </div>
  );
};
