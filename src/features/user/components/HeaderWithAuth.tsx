import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Icon } from '@/shared/components/Icon';
import { useUser } from '@/features/user/hooks/useUser';
import { useAuth } from '@/context/AuthContext';

export const HeaderWithAuth = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user: authUser, logout } = useAuth();
  const { user, rank, virtualMoney } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const mainOptions = [
    { path: '/', label: 'Inicio', icon: 'home' },
    { path: '/aprendizaje', label: 'Aprendizaje', icon: 'book' },
    { path: '/progreso', label: 'Progreso', icon: 'bar-chart' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <>
      {/* Header Desktop */}
      <header className="sticky top-0 z-50 border-b border-cyan-500/20 bg-linear-to-r from-slate-950/80 via-black/80 to-slate-950/80 shadow-lg shadow-cyan-500/10 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-3 md:px-6">
          <div className="flex items-center justify-between">
            {/* Logo/Brand */}
            <Link
              href="/"
              className="flex items-center gap-3 transition-opacity duration-300 hover:opacity-80"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-cyan-500 via-blue-500 to-purple-600 shadow-lg shadow-cyan-500/30 transition-transform duration-300 hover:scale-110">
                <span className="text-xl font-bold text-white">🚀</span>
              </div>
              <span className="hidden bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-xl font-bold text-transparent sm:inline">
                ICFES Master
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-8 md:flex">
              {mainOptions.map((option) => (
                <Link
                  key={option.path}
                  href={option.path}
                  className={`flex items-center gap-2 border-b-2 pb-2 font-semibold transition-all duration-300 ${
                    pathname === option.path
                      ? 'border-b-cyan-500 text-cyan-400 shadow-lg shadow-cyan-500/20'
                      : 'border-b-transparent text-slate-300 hover:border-b-cyan-400/50 hover:text-white'
                  }`}
                >
                  <Icon name={option.icon} size="sm" className="text-sm" />
                  <span>{option.label}</span>
                </Link>
              ))}
            </nav>

            {/* Right Section: Stats + Profile */}
            <div className="flex items-center gap-4 md:gap-6">
              {/* Virtual Money - Desktop Only */}
              {user && (
                <div className="hidden items-center gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 md:flex">
                  <Icon name="coins" className="text-yellow-400" />
                  <span className="font-bold text-yellow-400">
                    {virtualMoney || 0}
                  </span>
                </div>
              )}

              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 rounded-lg px-4 py-2 transition-colors hover:bg-slate-800/50"
                >
                  <Icon
                    name="circle-user"
                    size="2xl"
                    className="text-2xl text-cyan-400"
                  />
                  {authUser && (
                    <>
                      <div className="hidden text-left sm:block">
                        <p className="text-sm font-semibold text-white">
                          {authUser.displayName || authUser.email}
                        </p>
                        {rank && (
                          <p className="text-xs text-slate-400">
                            Rango: {rank}
                          </p>
                        )}
                      </div>
                      <Icon
                        name="chevron-down"
                        size="sm"
                        className={`text-xs transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`}
                      />
                    </>
                  )}
                </button>

                {/* Dropdown Menu */}
                {profileMenuOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-56 rounded-lg border border-slate-700 bg-slate-900 shadow-xl">
                    {/* User Info */}
                    {authUser && (
                      <div className="border-b border-slate-700 px-4 py-3">
                        <p className="text-sm font-semibold text-white">
                          {authUser.displayName || authUser.email}
                        </p>
                        <p className="truncate text-xs text-slate-400">
                          {authUser.email}
                        </p>
                      </div>
                    )}

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        href="/perfil"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-slate-300 transition-colors hover:bg-slate-800/50 hover:text-white"
                      >
                        <Icon name="user" />
                        <span>Mi Perfil</span>
                      </Link>
                      <Link
                        href="/configuracion"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-slate-300 transition-colors hover:bg-slate-800/50 hover:text-white"
                      >
                        <Icon name="cog" />
                        <span>Configuración</span>
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-slate-700 py-2">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-2 font-semibold text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                      >
                        <Icon name="sign-out" />
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-slate-800 md:hidden"
              >
                <Icon
                  name={mobileMenuOpen ? 'times' : 'bars'}
                  size="xl"
                  className="text-xl text-cyan-400"
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed top-16 right-0 left-0 z-40 border-b border-slate-700 bg-slate-900 md:hidden">
          <nav className="mx-auto max-w-7xl space-y-2 px-4 py-4">
            {mainOptions.map((option) => (
              <Link
                key={option.path}
                href={option.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                  pathname === option.path
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <Icon name={option.icon} />
                <span>{option.label}</span>
              </Link>
            ))}

            {user && (
              <div className="my-2 flex items-center gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-3">
                <Icon name="coins" className="text-yellow-400" />
                <span className="font-bold text-yellow-400">
                  {virtualMoney || 0}
                </span>
              </div>
            )}
          </nav>
        </div>
      )}
    </>
  );
};
