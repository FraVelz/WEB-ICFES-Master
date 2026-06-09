'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/shared/components/Icon';
import { ModalOverlay } from '@/shared/components/ModalOverlay';
import { isAccountOnlyPath } from '@/features/auth/constants/accountOnlyRoutes';
import { useUiSessionStore } from '@/store/uiSessionStore';
import { cn } from '@/utils/cn';
import { FOCUS_RING, isNavOptionActive, isNavPathActive, mainNavOptions, mobileMenuOptions, type NavOption } from './constants';

type MobileNavProps = {
  menuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
};

export function MobileNav({ menuOpen, onToggleMenu, onCloseMenu }: MobileNavProps) {
  const pathname = usePathname();
  const demoMode = useUiSessionStore((s) => s.demoMode);
  const isLockedInDemo = (path: string) => demoMode && isAccountOnlyPath(path);
  const isOverflowRouteActive = mobileMenuOptions.some((option) => isNavOptionActive(pathname, option));

  return (
    <>
      <nav
        className={cn(
          'border-app-ring/20 border-t bg-linear-to-t',
          'from-surface-elevated/95 via-surface-elevated/90 to-surface-elevated/80 backdrop-blur-xl lg:hidden'
        )}
      >
        <div className="flex h-20 items-center justify-around">
          {mainNavOptions.map((option) => {
            const isActive = isNavPathActive(pathname, option.path);
            return (
              <Link
                key={option.path}
                href={option.path}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex h-20 w-16 flex-col items-center justify-center rounded-lg transition-all duration-300',
                  FOCUS_RING,
                  isActive
                    ? 'border-app-ring text-app-accent bg-app-ring/10 border-t-2'
                    : 'text-on-surface-muted hover:text-on-surface'
                )}
              >
                <Icon
                  name={option.icon}
                  size="xl"
                  className={cn(
                    'mb-1 transition-all duration-300',
                    isActive && 'scale-110 drop-shadow-[0_0_8px_currentColor]'
                  )}
                />
              </Link>
            );
          })}
          <button
            type="button"
            onClick={onToggleMenu}
            aria-label={menuOpen ? 'Cerrar menú' : 'Más opciones'}
            aria-expanded={menuOpen}
            className={cn(
              'relative flex h-20 w-16 flex-col items-center justify-center rounded-lg transition-all duration-300',
              'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none',
              'focus-visible:ring-offset-surface focus-visible:ring-offset-2',
              isOverflowRouteActive
                ? 'border-app-ring text-app-accent bg-app-ring/10 border-t-2'
                : 'text-on-surface-muted hover:text-on-surface'
            )}
          >
            <Icon
              name="ellipsis-vertical"
              size="xl"
              className={cn(
                'mb-1 transition-all duration-300',
                isOverflowRouteActive && 'scale-110 drop-shadow-[0_0_8px_currentColor]'
              )}
            />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <>
          <ModalOverlay onClose={onCloseMenu} className="lg:hidden" />
          <div
            className={cn(
              'border-app-ring/30 fixed right-0 bottom-20 left-0 z-50 h-fit w-screen border-t',
              'bg-surface-elevated/98 backdrop-blur-xl lg:hidden'
            )}
          >
            <div className="flex flex-col divide-y divide-slate-700/50">
              {mobileMenuOptions.map((option: NavOption) => {
                const isLocked = isLockedInDemo(option.path);
                const isActive = isNavOptionActive(pathname, option);
                return (
                  <Link
                    key={option.path}
                    href={option.path}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'flex items-center gap-4 px-6 py-4 transition-colors',
                      'focus-visible:ring-app-accent rounded-lg focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset',
                      isActive
                        ? 'bg-app-ring/10 border-app-accent border-l-4 text-on-surface'
                        : 'text-on-surface hover:bg-app-ring/10 active:bg-app-ring/20',
                      isLocked && 'opacity-70'
                    )}
                    onClick={onCloseMenu}
                  >
                    <Icon
                      name={option.icon}
                      size="xl"
                      className={cn(
                        isActive
                          ? 'text-app-accent drop-shadow-[0_0_8px_currentColor]'
                          : 'text-on-surface-muted'
                      )}
                    />
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
