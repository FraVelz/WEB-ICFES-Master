'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faCoins, faShoppingBag, faRocket, faGraduationCap, faGear, faMedal, faTrophy, faEllipsisVertical, faFire } from '@fortawesome/free-solid-svg-icons';
import { useUser } from '@/features/user/hooks/useUser';

export const Header = () => {
  const pathname = usePathname();
  const { user, rank, virtualMoney } = useUser();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileOptionsMenuOpen, setMobileOptionsMenuOpen] = useState(false);

  const mainOptions = [
    { path: '/ruta-aprendizaje', label: 'Aprendizaje', icon: faGraduationCap },
    { path: '/logros', label: 'Logros', icon: faMedal },
    { path: '/clasificatoria', label: 'Clasificatoria', icon: faTrophy }
  ];

  const mobileMenuOptions = [
    { path: '/perfil', label: 'Perfil', icon: faCircleUser },
    { path: '/desafios-diarios', label: 'Desafíos Diarios', icon: faFire },
    { path: '/configuracion', label: 'Configuración', icon: faGear }
  ];

  return (
    <>
      {/* Header Desktop - Sidebar Izquierda */}
      <header className="hidden lg:flex flex-col sticky top-0 h-screen w-20 hover:w-72 transition-all duration-300 z-50 bg-slate-950/95 backdrop-blur-xl border-r border-cyan-500/20 shadow-2xl shadow-cyan-500/10 group">
        
        {/* 1. Logo & Brand */}
        <div className="h-24 flex items-center justify-center border-b border-cyan-500/10 relative shrink-0">
          <Link href="/" className="flex items-center gap-3 absolute left-[18px] transition-all duration-300">
            <div className="w-11 h-11 bg-linear-to-br from-cyan-500 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30 shrink-0 z-10">
              <FontAwesomeIcon icon={faRocket} className="text-white text-lg" />
            </div>
            <span className="font-bold text-xl bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pl-2">
              ICFES Master
            </span>
          </Link>
        </div>

        {/* 2. Navigation Links */}
        <nav className="flex-1 py-6 flex flex-col gap-2 overflow-y-auto overflow-x-hidden custom-scrollbar px-3">
          {/* Main Options */}
          {mainOptions.map((option) => (
            <Link
              key={option.path}
              href={option.path}
              className={`flex items-center h-12 px-3 rounded-xl transition-all duration-300 relative group/item ${
                pathname === option.path
                  ? 'bg-cyan-500/10 text-cyan-400 shadow-lg shadow-cyan-500/5'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="w-6 flex justify-center shrink-0">
                <FontAwesomeIcon icon={option.icon} className="text-lg" />
              </div>
              <span className="font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap absolute left-14">
                {option.label}
              </span>
              
              {/* Active Indicator */}
              {pathname === option.path && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-500 rounded-l-full" />
              )}
            </Link>
          ))}

          <div className="my-2 border-t border-slate-800/50 mx-2" />

          {/* Secondary Options */}
           <Link
              href="/desafios-diarios"
              className={`flex items-center h-12 px-3 rounded-xl transition-all duration-300 relative group/item ${
                pathname === '/desafios-diarios'
                  ? 'bg-orange-500/10 text-orange-400'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="w-6 flex justify-center shrink-0">
                <FontAwesomeIcon icon={faFire} className="text-lg" />
              </div>
              <span className="font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap absolute left-14">
                Desafíos
              </span>
            </Link>
        </nav>

        {/* 3. User Profile Section (Bottom) */}
        <div className="p-4 border-t border-cyan-500/10 bg-slate-900/50">
            {/* Coins Display */}
            <div className="mb-4 flex items-center h-10 bg-slate-800/50 rounded-lg border border-amber-500/20 relative overflow-hidden">
                <div className="w-full flex justify-center shrink-0 absolute left-0 group-hover:left-[-100%] transition-all duration-300">
                     <FontAwesomeIcon icon={faCoins} className="text-amber-400" />
                </div>
                <div className="flex items-center gap-3 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full">
                    <FontAwesomeIcon icon={faCoins} className="text-amber-400" />
                    <span className="font-bold text-amber-400 whitespace-nowrap">
                        {virtualMoney}
                    </span>
                </div>
            </div>

            {/* Profile Link */}
            <Link href="/perfil" className="flex items-center gap-3 group/profile hover:bg-white/5 p-2 rounded-xl transition-colors relative overflow-hidden">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-cyan-500/30 shrink-0 z-10 bg-slate-800">
                     {user?.profileImage ? (
                        <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <FontAwesomeIcon icon={faCircleUser} className="text-slate-400" />
                        </div>
                     )}
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden whitespace-nowrap absolute left-16">
                    <p className="text-sm font-bold text-white truncate max-w-[140px]">{user?.username || 'Usuario'}</p>
                    <p className="text-xs text-cyan-400">{rank?.name || 'Novato'}</p>
                </div>
            </Link>
            
            {/* Settings Link */}
             <Link href="/configuracion" className="mt-2 flex items-center justify-center p-2 text-slate-500 hover:text-cyan-400 transition-colors h-10">
                <FontAwesomeIcon icon={faGear} className="text-lg" />
             </Link>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 lg:hidden z-50 bg-linear-to-t from-slate-950/95 via-slate-950/90 to-slate-950/80 border-t border-cyan-500/20 backdrop-blur-xl">
        <div className="flex items-center justify-around h-20">
          {mainOptions.map((option) => (
            <Link
              key={option.path}
              href={option.path}
              className={`flex flex-col items-center justify-center w-16 h-20 transition-all duration-300 ${
                pathname === option.path
                  ? 'text-cyan-400 border-t-2 border-cyan-500'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FontAwesomeIcon icon={option.icon} className="text-2xl mb-1" />
            </Link>
          ))}
          <button
            onClick={() => setMobileOptionsMenuOpen(!mobileOptionsMenuOpen)}
            className="flex flex-col items-center justify-center w-16 h-20 transition-all duration-300 text-slate-400 hover:text-white relative"
          >
            <FontAwesomeIcon icon={faEllipsisVertical} className="text-2xl mb-1" />
          </button>
        </div>
      </nav>

      {/* Mobile Options Menu Overlay */}
      {mobileOptionsMenuOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setMobileOptionsMenuOpen(false)}
        />
      )}

      {/* Mobile Options Menu Dropdown */}
      {mobileOptionsMenuOpen && (
        <div className="fixed bottom-20 left-0 right-0 w-screen h-fit z-50 lg:hidden bg-slate-900/98 border-t border-cyan-500/30 backdrop-blur-xl">
          <div className="flex flex-col divide-y divide-slate-700/50">
            {mobileMenuOptions.map((option) => (
              <Link
                key={option.path}
                href={option.path}
                className="flex items-center gap-4 px-6 py-4 text-slate-300 hover:bg-cyan-500/10 transition-colors active:bg-cyan-500/20"
                onClick={() => setMobileOptionsMenuOpen(false)}
              >
                <FontAwesomeIcon icon={option.icon} className="text-cyan-400 text-xl" />
                <span className="text-lg font-semibold">{option.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
