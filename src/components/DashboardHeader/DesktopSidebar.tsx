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
      title={!sidebarExpanded ? option.label : undefined}
      className={cn(
        'group/item relative flex h-12 items-center rounded-xl transition-all duration-300 focus-visible:z-10',
        sidebarExpanded ? 'gap-3 px-3' : 'justify-center px-0',
        FOCUS_RING,
        isActive
          ? accent === 'orange'
            ? 'bg-orange-500/10 text-orange-400'
            : 'bg-app-ring/10 text-app-accent shadow-app-ring/5 shadow-lg'
          : 'text-on-surface-muted hover:bg-surface-elevated/60 hover:text-on-surface',
        isLocked && 'opacity-70'
      )}
    >
      <Icon name={option.icon} size="lg" className="shrink-0" />
      {sidebarExpanded && (
        <span className="font-medium whitespace-nowrap">
          {option.label}
          {isLocked && <Icon name="lock" size="sm" className="ml-1.5 inline text-slate-500" />}
        </span>
      )}
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
          title={!sidebarExpanded ? 'ICFES Master' : undefined}
          className={cn(
            'flex shrink-0 items-center rounded-xl transition-all duration-300',
            FOCUS_RING,
            sidebarExpanded ? 'absolute left-[18px] gap-3' : 'justify-center'
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
          {sidebarExpanded && (
            <span
              className={cn(
                'from-cta-text-start via-cta-text-via to-cta-text-end bg-linear-to-r bg-clip-text pl-2',
                'text-xl font-bold whitespace-nowrap text-transparent'
              )}
            >
              ICFES Master
            </span>
          )}
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

      <nav
        className={cn(
          'custom-scrollbar flex min-h-0 flex-1 flex-col gap-2 overflow-x-hidden overflow-y-auto py-6',
          sidebarExpanded ? 'px-3' : 'px-2'
        )}
      >
        {mainNavOptions.map((option) => (
          <SidebarNavLink
            key={option.path}
            option={option}
            pathname={pathname}
            sidebarExpanded={sidebarExpanded}
            isLocked={isLockedInDemo(option.path)}
          />
        ))}

        <div className={cn('my-2 border-t border-slate-800/50', sidebarExpanded ? 'mx-2' : 'mx-0')} />

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

      <div
        className={cn(
          'border-app-ring/10 bg-surface-elevated/50 shrink-0 border-t',
          sidebarExpanded ? 'p-4' : 'px-2 py-4'
        )}
      >
        {sidebarExpanded && (
          <div className="bg-surface-elevated/80 mb-4 flex h-10 items-center gap-3 rounded-lg border border-amber-500/20 px-3">
            <Icon name="coins" className="shrink-0 text-amber-400" />
            <span className="font-bold whitespace-nowrap text-amber-400">{virtualMoney}</span>
          </div>
        )}

        <Link
          href="/perfil"
          title={!sidebarExpanded ? user?.username || 'Perfil' : undefined}
          className={cn(
            'group/profile hover:bg-on-surface/5 flex items-center overflow-hidden rounded-xl p-2 transition-colors',
            sidebarExpanded ? 'gap-3' : 'justify-center',
            FOCUS_RING,
            isLockedInDemo('/perfil') && 'opacity-70'
          )}
        >
          <div className="border-app-ring/30 h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 bg-slate-800">
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
          {sidebarExpanded && (
            <span className="min-w-0 overflow-hidden whitespace-nowrap">
              <p className="text-on-surface max-w-[140px] truncate text-sm font-bold">{user?.username || 'Usuario'}</p>
              <p className="text-app-accent text-xs">{rank?.name || 'Novato'}</p>
            </span>
          )}
        </Link>

        <Link
          href="/configuracion"
          className={cn(
            'hover:text-app-accent mt-2 flex h-10 items-center rounded-xl p-2 text-slate-500 transition-colors',
            sidebarExpanded ? 'gap-1 px-2' : 'justify-center',
            FOCUS_RING,
            isLockedInDemo('/configuracion') && 'opacity-70'
          )}
          title={isLockedInDemo('/configuracion') ? 'Requiere cuenta' : 'Configuración'}
        >
          <Icon name="cog" size="lg" />
          {sidebarExpanded && isLockedInDemo('/configuracion') && <Icon name="lock" size="sm" />}
        </Link>
      </div>
    </header>
  );
}
