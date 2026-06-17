'use client';

import Link from 'next/link';
import type { ImageSource } from '@/assets';
import { Icon } from '@/shared/components/Icon';
import { AvatarImage } from '@/features/user/components/AvatarImage';
import { cn } from '@/utils/cn';
import { FOCUS_RING, isNavPathActive, SIDEBAR_NAV_HOVER } from './constants';

type DesktopSidebarFooterProps = {
  sidebarExpanded: boolean;
  pathname: string;
  username?: string | null;
  rankName?: string | null;
  avatarSrc?: ImageSource | null;
  isLockedInDemo: (path: string) => boolean;
};

export function DesktopSidebarFooter({
  sidebarExpanded,
  pathname,
  username,
  rankName,
  avatarSrc,
  isLockedInDemo,
}: DesktopSidebarFooterProps) {
  const isProfileActive = isNavPathActive(pathname, '/perfil');
  const isSettingsActive = isNavPathActive(pathname, '/configuracion');

  return (
    <div
      className={cn(
        'border-app-ring/10 shrink-0 border-t',
        sidebarExpanded ? 'bg-transparent p-4' : 'bg-surface-elevated/50 px-2 py-4'
      )}
    >
      <Link
        href="/perfil"
        title={!sidebarExpanded ? username || 'Perfil' : undefined}
        aria-current={isProfileActive ? 'page' : undefined}
        className={cn(
          'group/profile flex items-center overflow-hidden rounded-xl p-2 transition-colors',
          sidebarExpanded ? 'gap-3' : 'justify-center',
          FOCUS_RING,
          isProfileActive ? 'bg-app-ring/15 ring-app-accent/45 ring-2' : SIDEBAR_NAV_HOVER,
          isLockedInDemo('/perfil') && 'opacity-70'
        )}
      >
        <div
          className={cn(
            'bg-surface-overlay relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2',
            isProfileActive ? 'border-app-accent' : 'border-app-ring/30'
          )}
        >
          <AvatarImage src={avatarSrc} alt="Profile" sizes="40px" />
        </div>
        {sidebarExpanded && (
          <span className="min-w-0 overflow-hidden whitespace-nowrap">
            <p className="text-on-surface max-w-[140px] truncate text-sm font-bold">{username || 'Usuario'}</p>
            <p className="text-app-accent text-xs">{rankName || 'Novato'}</p>
          </span>
        )}
      </Link>

      <Link
        href="/configuracion"
        aria-current={isSettingsActive ? 'page' : undefined}
        className={cn(
          'mt-2 flex h-10 items-center rounded-xl p-2 transition-colors',
          sidebarExpanded ? 'gap-3 px-3' : 'justify-center',
          FOCUS_RING,
          isSettingsActive
            ? 'bg-app-ring/15 text-app-accent ring-app-accent/45 ring-2'
            : cn(SIDEBAR_NAV_HOVER, 'text-on-surface-muted'),
          isLockedInDemo('/configuracion') && 'opacity-70'
        )}
        title={!sidebarExpanded ? (isLockedInDemo('/configuracion') ? 'Requiere cuenta' : 'Configuración') : undefined}
      >
        <Icon
          name="cog"
          size="lg"
          className={cn('shrink-0', isSettingsActive && 'drop-shadow-[0_0_8px_currentColor]')}
        />
        {sidebarExpanded && (
          <span className="font-medium whitespace-nowrap">
            Configuración
            {isLockedInDemo('/configuracion') && (
              <Icon name="lock" size="sm" className="text-on-surface-muted ml-1.5 inline" />
            )}
          </span>
        )}
      </Link>
    </div>
  );
}
