'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/shared/components/Icon';
import { AvatarImage } from '@/features/user/components/AvatarImage';
import { isAccountOnlyPath } from '@/features/auth/constants/accountOnlyRoutes';
import { useUser } from '@/features/user/hooks/useUser';
import { useAppSelector } from '@/store/hooks';
import { cn } from '@/utils/cn';
import { FOCUS_RING, mainNavOptions, secondaryNavOptions, type NavOption } from './constants';

type DesktopSidebarProps = {
  className?: string;
  sidebarExpanded: boolean;
  onToggleSidebar: () => void;
};

function SidebarNavLink({
  option,
  pathname,
  sidebarExpanded,
  isLocked,
}: {
  option: NavOption;
  pathname: string;
  sidebarExpanded: boolean;
  isLocked: boolean;
}) {
  const isActive = pathname === option.path;
  const accent = option.accent ?? 'default';

  return (
    <Link
      href={option.path}
      className={cn(
        'group/item relative flex h-12 items-center rounded-xl px-3 transition-all duration-300 focus-visible:z-10',
        FOCUS_RING,
        isActive
          ? accent === 'orange'
            ? 'bg-orange-500/10 text-orange-400'
            : 'bg-app-ring/10 text-app-accent shadow-app-ring/5 shadow-lg'
          : 'text-slate-400 hover:bg-white/5 hover:text-white',
        isLocked && 'opacity-70'
      )}
    >
      <div className="flex w-6 shrink-0 justify-center">
        <Icon name={option.icon} size="lg" />
      </div>
      <span
        className={cn(
          'absolute left-14 font-medium whitespace-nowrap transition-opacity duration-300',
          sidebarExpanded ? 'opacity-100' : 'opacity-0'
        )}
      >
        {option.label}
        {isLocked && <Icon name="lock" size="sm" className="ml-1.5 inline text-slate-500" />}
      </span>
      {isActive && option.showActiveIndicator !== false && (
        <div className="bg-app-ring absolute top-1/2 right-0 h-6 w-1 -translate-y-1/2 rounded-l-full" />
      )}
    </Link>
  );
}

export function DesktopSidebar({ className, sidebarExpanded, onToggleSidebar }: DesktopSidebarProps) {
  const pathname = usePathname();
  const { user, rank, virtualMoney } = useUser();
  const demoMode = useAppSelector((s) => s.uiSession.demoMode);
  const isLockedInDemo = (path: string) => demoMode && isAccountOnlyPath(path);

  return (
    <header className={cn('min-w-fit', className, sidebarExpanded ? 'w-72' : 'w-20')}>
      <div
        className={cn(
          'border-app-ring/10 relative flex shrink-0 flex-col items-center justify-center gap-0 border-b',
          sidebarExpanded ? 'h-24' : 'h-auto py-4'
        )}
      >
        <Link
          href="/"
          className={cn(
            'flex shrink-0 items-center gap-3 rounded-xl transition-all duration-300',
            FOCUS_RING,
            sidebarExpanded ? 'absolute left-[18px]' : 'justify-center'
          )}
        >
          <div
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br',
              'from-cta-from shadow-app-ring/30 via-blue-500 to-purple-600 shadow-lg'
            )}
          >
            <Icon name="rocket" size="lg" className="text-white" />
          </div>
          <span
            className={cn(
              'from-cta-text-start via-cta-text-via to-cta-text-end bg-linear-to-r bg-clip-text text-xl font-bold',
              'whitespace-nowrap text-transparent transition-opacity duration-300',
              sidebarExpanded ? 'pl-2 opacity-100' : 'w-0 overflow-hidden opacity-0'
            )}
          >
            ICFES Master
          </span>
        </Link>
        <button
          type="button"
          onClick={onToggleSidebar}
          className={cn(
            'flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-400',
            'hover:text-app-accent transition-colors hover:bg-white/10',
            FOCUS_RING,
            sidebarExpanded ? 'absolute top-1/2 right-2 -translate-y-1/2' : 'mt-3'
          )}
          aria-label={sidebarExpanded ? 'Cerrar barra lateral' : 'Abrir barra lateral'}
        >
          <Icon name={sidebarExpanded ? 'chevron-left' : 'chevron-right'} size="lg" />
        </button>
      </div>

      <nav className="custom-scrollbar flex flex-1 flex-col gap-2 overflow-x-hidden overflow-y-auto px-3 py-6">
        {mainNavOptions.map((option) => (
          <SidebarNavLink
            key={option.path}
            option={option}
            pathname={pathname}
            sidebarExpanded={sidebarExpanded}
            isLocked={isLockedInDemo(option.path)}
          />
        ))}

        <div className="mx-2 my-2 border-t border-slate-800/50" />

        {secondaryNavOptions.map((option) => (
          <SidebarNavLink
            key={option.path}
            option={option}
            pathname={pathname}
            sidebarExpanded={sidebarExpanded}
            isLocked={isLockedInDemo(option.path)}
          />
        ))}
      </nav>

      <div className="border-app-ring/10 border-t bg-slate-900/50 p-4">
        <div className="relative mb-4 flex h-10 items-center overflow-hidden rounded-lg border border-amber-500/20 bg-slate-800/50">
          <div
            className={cn(
              'absolute left-0 flex w-full shrink-0 justify-center transition-all duration-300',
              sidebarExpanded && '-left-full'
            )}
          >
            <Icon name="coins" className="text-amber-400" />
          </div>
          <span
            className={cn(
              'flex w-full items-center gap-3 px-3 font-bold text-amber-400 whitespace-nowrap transition-opacity duration-300',
              sidebarExpanded ? 'opacity-100' : 'opacity-0'
            )}
          >
            <Icon name="coins" className="text-amber-400" />
            {virtualMoney}
          </span>
        </div>

        <Link
          href="/perfil"
          className={cn(
            'group/profile relative flex items-center gap-3 overflow-hidden rounded-xl p-2 transition-colors hover:bg-white/5',
            'min-w-fit',
            FOCUS_RING,
            isLockedInDemo('/perfil') && 'opacity-70'
          )}
        >
          <div className="border-app-ring/30 relative z-10 h-10 w-10 min-w-fit shrink-0 overflow-hidden rounded-full border-2 bg-slate-800">
            {user?.profileImage ? (
              <AvatarImage
                src={user.profileImage}
                alt="Profile"
                fallback={
                  <div className="flex h-full w-full items-center justify-center">
                    <Icon name="circle-user" size="lg" className="text-slate-400" />
                  </div>
                }
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Icon name="circle-user" size="lg" className="text-slate-400" />
              </div>
            )}
          </div>
          <span
            className={cn(
              'absolute left-16 overflow-hidden whitespace-nowrap transition-opacity duration-300',
              sidebarExpanded ? 'opacity-100' : 'opacity-0'
            )}
          >
            <p className="max-w-[140px] truncate text-sm font-bold text-white">{user?.username || 'Usuario'}</p>
            <p className="text-app-accent text-xs">{rank?.name || 'Novato'}</p>
          </span>
        </Link>

        <Link
          href="/configuracion"
          className={cn(
            'mt-2 flex h-10 items-center justify-center gap-1 rounded-xl p-2 text-slate-500 transition-colors',
            'hover:text-app-accent',
            FOCUS_RING,
            isLockedInDemo('/configuracion') && 'opacity-70'
          )}
          title={isLockedInDemo('/configuracion') ? 'Requiere cuenta' : 'Configuración'}
        >
          <Icon name="cog" size="lg" />
          {isLockedInDemo('/configuracion') && <Icon name="lock" size="sm" />}
        </Link>
      </div>
    </header>
  );
}
