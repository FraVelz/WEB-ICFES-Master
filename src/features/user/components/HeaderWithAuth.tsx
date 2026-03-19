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
    { path: '/progreso', label: 'Progreso', icon: 'bar-chart' }
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
      <header className="sticky top-0 z-50 bg-linear-to-r from-slate-950/80 via-black/80 to-slate-950/80 border-b border-cyan-500/20 backdrop-blur-xl shadow-lg shadow-cyan-500/10">
        <div className="max-w-7xl mx-auto px-4 py-3 md:px-6">
          <div className="flex items-center justify-between">
            {/* Logo/Brand */}
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-300">
              <div className="w-12 h-12 bg-linear-to-br from-cyan-500 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30 hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-xl">🚀</span>
              </div>
              <span className="hidden sm:inline font-bold text-xl bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                ICFES Master
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {mainOptions.map((option) => (
                <Link
                  key={option.path}
                  href={option.path}
                  className={`flex items-center gap-2 transition-all duration-300 pb-2 border-b-2 font-semibold ${
                    pathname === option.path
                      ? 'text-cyan-400 border-b-cyan-500 shadow-lg shadow-cyan-500/20'
                      : 'text-slate-300 border-b-transparent hover:text-white hover:border-b-cyan-400/50'
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
                <div className="hidden md:flex items-center gap-2 bg-yellow-500/10 px-4 py-2 rounded-lg border border-yellow-500/30">
                  <Icon name="coins" className="text-yellow-400" />
                  <span className="font-bold text-yellow-400">{virtualMoney || 0}</span>
                </div>
              )}

              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-800/50 transition-colors"
                >
                  <Icon 
                    name="circle-user" 
                    size="2xl"
                    className="text-2xl text-cyan-400" 
                  />
                  {authUser && (
                    <>
                      <div className="hidden sm:block text-left">
                        <p className="text-sm font-semibold text-white">
                          {authUser.displayName || authUser.email}
                        </p>
                        {rank && (
                          <p className="text-xs text-slate-400">Rango: {rank}</p>
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
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50">
                    {/* User Info */}
                    {authUser && (
                      <div className="px-4 py-3 border-b border-slate-700">
                        <p className="text-sm font-semibold text-white">
                          {authUser.displayName || authUser.email}
                        </p>
                        <p className="text-xs text-slate-400 truncate">{authUser.email}</p>
                      </div>
                    )}

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        href="/perfil"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"
                      >
                        <Icon name="user" />
                        <span>Mi Perfil</span>
                      </Link>
                      <Link
                        href="/configuracion"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"
                      >
                        <Icon name="cog" />
                        <span>Configuración</span>
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-slate-700 py-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors font-semibold"
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
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-800 transition-colors"
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
        <div className="md:hidden bg-slate-900 border-b border-slate-700 fixed top-16 left-0 right-0 z-40">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-2">
            {mainOptions.map((option) => (
              <Link
                key={option.path}
                href={option.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  pathname === option.path
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon name={option.icon} />
                <span>{option.label}</span>
              </Link>
            ))}
            
            {user && (
              <div className="flex items-center gap-2 px-4 py-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30 my-2">
                <Icon name="coins" className="text-yellow-400" />
                <span className="font-bold text-yellow-400">{virtualMoney || 0}</span>
              </div>
            )}
          </nav>
        </div>
      )}
    </>
  );
};
