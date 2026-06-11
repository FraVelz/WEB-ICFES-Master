'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/shared/components/Icon';
import { isAccountOnlyPath } from '@/features/auth/constants/accountOnlyRoutes';
import { useUser } from '@/features/user/hooks/useUser';
import { useResolvedProfileAvatar } from '@/features/user/hooks/useResolvedProfileAvatar';
import { useUiSessionStore } from '@/store/uiSessionStore';
import { cn } from '@/utils/cn';
import { FOCUS_RING, mainNavOptions, secondaryNavOptions } from './constants';
import { SidebarNavLink } from './SidebarNavLink';
import { DesktopSidebarFooter } from './DesktopSidebarFooter';

type DesktopSidebarProps = {
  className?: string;
  sidebarExpanded: boolean;
  onToggleSidebar: () => void;
};

export function DesktopSidebar({ className, sidebarExpanded, onToggleSidebar }: DesktopSidebarProps) {
  const pathname = usePathname();
  const { user, rank, coinsBalance } = useUser();
  const avatarSrc = useResolvedProfileAvatar(user?.profileImage);
  const demoMode = useUiSessionStore((s) => s.demoMode);
  const isLockedInDemo = (path: string) => demoMode && isAccountOnlyPath(path);

  return (
    <header
      className={cn(
        'hidden min-h-0 flex-col lg:flex',
        'lg:sticky lg:top-0 lg:h-dvh lg:max-h-dvh lg:shrink-0 lg:overflow-y-auto',
        className,
        sidebarExpanded ? 'w-72' : 'w-20'
      )}
    >
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
            'text-on-surface-muted flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg',
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
        aria-label="Navegación principal"
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

        <div className={cn('border-surface-border/50 my-2 border-t', sidebarExpanded ? 'mx-2' : 'mx-0')} />

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

      <DesktopSidebarFooter
        sidebarExpanded={sidebarExpanded}
        pathname={pathname}
        username={user?.username}
        rankName={rank?.name}
        avatarSrc={avatarSrc}
        coinsBalance={coinsBalance}
        isLockedInDemo={isLockedInDemo}
      />
    </header>
  );
}
