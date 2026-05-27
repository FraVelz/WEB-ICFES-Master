import Link from 'next/link';
import { Icon } from '@/shared/components/Icon';
import { AvatarImage } from '@/features/user/components/AvatarImage';
import { cn } from '@/utils/cn';
import type { UserProfile, UserRank } from '@/services/persistence';
import { FOCUS_RING, mainNavOptions, secondaryNavOptions } from './constants';
import { ExpandableSidebarText } from './ExpandableSidebarText';
import { SidebarNavLink } from './SidebarNavLink';

type DesktopSidebarProps = {
  className?: string;
  sidebarExpanded: boolean;
  onToggleSidebar: () => void;
  pathname: string;
  isLockedInDemo: (path: string) => boolean;
  user: UserProfile | null;
  rank: UserRank | null;
  virtualMoney: number;
};

export function DesktopSidebar({
  className,
  sidebarExpanded,
  onToggleSidebar,
  pathname,
  isLockedInDemo,
  user,
  rank,
  virtualMoney,
}: DesktopSidebarProps) {
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
          <ExpandableSidebarText
            expanded={sidebarExpanded}
            className="flex w-full items-center gap-3 px-3 font-bold text-amber-400"
          >
            <Icon name="coins" className="text-amber-400" />
            {virtualMoney}
          </ExpandableSidebarText>
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
          <ExpandableSidebarText expanded={sidebarExpanded} className="absolute left-16 overflow-hidden">
            <p className="max-w-[140px] truncate text-sm font-bold text-white">{user?.username || 'Usuario'}</p>
            <p className="text-app-accent text-xs">{rank?.name || 'Novato'}</p>
          </ExpandableSidebarText>
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
