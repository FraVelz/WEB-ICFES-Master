'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/shared/components/Icon';
import { useUser } from '@/features/user/hooks/useUser';

export const Header = () => {
  const pathname = usePathname();
  const { user, rank, virtualMoney } = useUser();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileOptionsMenuOpen, setMobileOptionsMenuOpen] = useState(false);

  const mainOptions = [
    { path: '/ruta-aprendizaje', label: 'Aprendizaje', icon: 'graduation-cap' },
    { path: '/logros', label: 'Logros', icon: 'medal' },
    { path: '/clasificatoria', label: 'Clasificatoria', icon: 'trophy' },
  ];

  const mobileMenuOptions = [
    { path: '/perfil', label: 'Perfil', icon: 'circle-user' },
    { path: '/desafios-diarios', label: 'Desafíos Diarios', icon: 'fire' },
    { path: '/configuracion', label: 'Configuración', icon: 'cog' },
  ];

  return (
    <>
      {/* Header Desktop - Sidebar Izquierda */}
      <header className="group sticky top-0 z-50 hidden h-screen w-20 flex-col border-r border-cyan-500/20 bg-slate-950/95 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl transition-all duration-300 hover:w-72 lg:flex">
        {/* 1. Logo & Brand */}
        <div className="relative flex h-24 shrink-0 items-center justify-center border-b border-cyan-500/10">
          <Link
            href="/"
            className="absolute left-[18px] flex items-center gap-3 transition-all duration-300"
          >
            <div className="z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-cyan-500 via-blue-500 to-purple-600 shadow-lg shadow-cyan-500/30">
              <Icon name="rocket" size="lg" className="text-white" />
            </div>
            <span className="bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text pl-2 text-xl font-bold whitespace-nowrap text-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              ICFES Master
            </span>
          </Link>
        </div>

        {/* 2. Navigation Links */}
        <nav className="custom-scrollbar flex flex-1 flex-col gap-2 overflow-x-hidden overflow-y-auto px-3 py-6">
          {/* Main Options */}
          {mainOptions.map((option) => (
            <Link
              key={option.path}
              href={option.path}
              className={`group/item relative flex h-12 items-center rounded-xl px-3 transition-all duration-300 ${
                pathname === option.path
                  ? 'bg-cyan-500/10 text-cyan-400 shadow-lg shadow-cyan-500/5'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex w-6 shrink-0 justify-center">
                <Icon name={option.icon} size="lg" />
              </div>
              <span className="absolute left-14 font-medium whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {option.label}
              </span>

              {/* Active Indicator */}
              {pathname === option.path && (
                <div className="absolute top-1/2 right-0 h-6 w-1 -translate-y-1/2 rounded-l-full bg-cyan-500" />
              )}
            </Link>
          ))}

          <div className="mx-2 my-2 border-t border-slate-800/50" />

          {/* Secondary Options */}
          <Link
            href="/desafios-diarios"
            className={`group/item relative flex h-12 items-center rounded-xl px-3 transition-all duration-300 ${
              pathname === '/desafios-diarios'
                ? 'bg-orange-500/10 text-orange-400'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex w-6 shrink-0 justify-center">
              <Icon name="fire" size="lg" />
            </div>
            <span className="absolute left-14 font-medium whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              Desafíos
            </span>
          </Link>
        </nav>

        {/* 3. User Profile Section (Bottom) */}
        <div className="border-t border-cyan-500/10 bg-slate-900/50 p-4">
          {/* Coins Display */}
          <div className="relative mb-4 flex h-10 items-center overflow-hidden rounded-lg border border-amber-500/20 bg-slate-800/50">
            <div className="absolute left-0 flex w-full shrink-0 justify-center transition-all duration-300 group-hover:-left-full">
              <Icon name="coins" className="text-amber-400" />
            </div>
            <div className="flex w-full items-center gap-3 px-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <Icon name="coins" className="text-amber-400" />
              <span className="font-bold whitespace-nowrap text-amber-400">
                {virtualMoney}
              </span>
            </div>
          </div>

          {/* Profile Link */}
          <Link
            href="/perfil"
            className="group/profile relative flex items-center gap-3 overflow-hidden rounded-xl p-2 transition-colors hover:bg-white/5"
          >
            <div className="z-10 h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-cyan-500/30 bg-slate-800">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Icon
                    name="circle-user"
                    size="lg"
                    className="text-slate-400"
                  />
                </div>
              )}
            </div>
            <div className="absolute left-16 overflow-hidden whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <p className="max-w-[140px] truncate text-sm font-bold text-white">
                {user?.username || 'Usuario'}
              </p>
              <p className="text-xs text-cyan-400">{rank?.name || 'Novato'}</p>
            </div>
          </Link>

          {/* Settings Link */}
          <Link
            href="/configuracion"
            className="mt-2 flex h-10 items-center justify-center p-2 text-slate-500 transition-colors hover:text-cyan-400"
          >
            <Icon name="cog" size="lg" />
          </Link>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed right-0 bottom-0 left-0 z-50 border-t border-cyan-500/20 bg-linear-to-t from-slate-950/95 via-slate-950/90 to-slate-950/80 backdrop-blur-xl lg:hidden">
        <div className="flex h-20 items-center justify-around">
          {mainOptions.map((option) => (
            <Link
              key={option.path}
              href={option.path}
              className={`flex h-20 w-16 flex-col items-center justify-center transition-all duration-300 ${
                pathname === option.path
                  ? 'border-t-2 border-cyan-500 text-cyan-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon name={option.icon} size="xl" className="mb-1" />
            </Link>
          ))}
          <button
            onClick={() => setMobileOptionsMenuOpen(!mobileOptionsMenuOpen)}
            className="relative flex h-20 w-16 flex-col items-center justify-center text-slate-400 transition-all duration-300 hover:text-white"
          >
            <Icon name="ellipsis-vertical" size="xl" className="mb-1" />
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
        <div className="fixed right-0 bottom-20 left-0 z-50 h-fit w-screen border-t border-cyan-500/30 bg-slate-900/98 backdrop-blur-xl lg:hidden">
          <div className="flex flex-col divide-y divide-slate-700/50">
            {mobileMenuOptions.map((option) => (
              <Link
                key={option.path}
                href={option.path}
                className="flex items-center gap-4 px-6 py-4 text-slate-300 transition-colors hover:bg-cyan-500/10 active:bg-cyan-500/20"
                onClick={() => setMobileOptionsMenuOpen(false)}
              >
                <Icon name={option.icon} size="xl" className="text-cyan-400" />
                <span className="text-lg font-semibold">{option.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
