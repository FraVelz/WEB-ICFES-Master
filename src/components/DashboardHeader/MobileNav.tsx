'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/shared/components/Icon';
import { ModalOverlay } from '@/shared/components/ModalOverlay';
import { isAccountOnlyPath } from '@/features/auth/constants/accountOnlyRoutes';
import { useAppSelector } from '@/store/hooks';
import { cn } from '@/utils/cn';
import { FOCUS_RING, mainNavOptions, mobileMenuOptions, type NavOption } from './constants';

type MobileNavProps = {
  menuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
};

export function MobileNav({ menuOpen, onToggleMenu, onCloseMenu }: MobileNavProps) {
  const pathname = usePathname();
  const demoMode = useAppSelector((s) => s.uiSession.demoMode);
  const isLockedInDemo = (path: string) => demoMode && isAccountOnlyPath(path);

  return (
    <>
      <nav
        className={cn(
          'border-app-ring/20 border-t bg-linear-to-t',
          'from-slate-950/95 via-slate-950/90 to-slate-950/80 backdrop-blur-xl lg:hidden'
        )}
      >
        <div className="flex h-20 items-center justify-around">
          {mainNavOptions.map((option) => {
            const isActive = pathname === option.path;
            return (
              <Link
                key={option.path}
                href={option.path}
                className={cn(
                  'flex h-20 w-16 flex-col items-center justify-center rounded-lg transition-all duration-300',
                  FOCUS_RING,
                  isActive ? 'border-app-ring text-app-accent border-t-2' : 'text-slate-400 hover:text-white'
                )}
              >
                <Icon name={option.icon} size="xl" className="mb-1" />
              </Link>
            );
          })}
          <button
            type="button"
            onClick={onToggleMenu}
            aria-label={menuOpen ? 'Cerrar menú' : 'Más opciones'}
            aria-expanded={menuOpen}
            className={cn(
              'relative flex h-20 w-16 flex-col items-center justify-center rounded-lg text-slate-400 transition-all duration-300',
              'focus-visible:ring-app-accent hover:text-white focus-visible:ring-2 focus-visible:outline-none',
              'focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950'
            )}
          >
            <Icon name="ellipsis-vertical" size="xl" className="mb-1" />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <>
          <ModalOverlay onClose={onCloseMenu} className="lg:hidden" />
          <div
            className={cn(
              'border-app-ring/30 fixed right-0 bottom-20 left-0 z-50 h-fit w-screen border-t',
              'bg-slate-900/98 backdrop-blur-xl lg:hidden'
            )}
          >
            <div className="flex flex-col divide-y divide-slate-700/50">
              {mobileMenuOptions.map((option: NavOption) => {
                const isLocked = isLockedInDemo(option.path);
                return (
                  <Link
                    key={option.path}
                    href={option.path}
                    className={cn(
                      'hover:bg-app-ring/10 active:bg-app-ring/20 flex items-center gap-4 px-6 py-4 text-slate-300 transition-colors',
                      'focus-visible:ring-app-accent rounded-lg focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset',
                      isLocked && 'opacity-70'
                    )}
                    onClick={onCloseMenu}
                  >
                    <Icon name={option.icon} size="xl" className="text-app-accent" />
                    <span className="flex flex-1 items-center justify-between text-lg font-semibold">
                      {option.label}
                      {isLocked && <Icon name="lock" className="text-slate-500" />}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}
