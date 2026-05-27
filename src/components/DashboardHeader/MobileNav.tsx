import { Icon } from '@/shared/components/Icon';
import { cn } from '@/utils/cn';
import { mainNavOptions, mobileMenuOptions } from './constants';
import { MobileBottomNavLink } from './MobileBottomNavLink';
import { MobileMenuLink } from './MobileMenuLink';

type MobileNavProps = {
  pathname: string;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  isLockedInDemo: (path: string) => boolean;
};

export function MobileNav({ pathname, menuOpen, onToggleMenu, onCloseMenu, isLockedInDemo }: MobileNavProps) {
  return (
    <>
      <nav
        className={cn(
          'border-app-ring/20 border-t bg-linear-to-t',
          'from-slate-950/95 via-slate-950/90 to-slate-950/80 backdrop-blur-xl lg:hidden'
        )}
      >
        <div className="flex h-20 items-center justify-around">
          {mainNavOptions.map((option) => (
            <MobileBottomNavLink key={option.path} option={option} pathname={pathname} />
          ))}
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
          <div className="fixed inset-0 z-40 lg:hidden" onClick={onCloseMenu} />
          <div
            className={cn(
              'border-app-ring/30 fixed right-0 bottom-20 left-0 z-50 h-fit w-screen border-t',
              'bg-slate-900/98 backdrop-blur-xl lg:hidden'
            )}
          >
            <div className="flex flex-col divide-y divide-slate-700/50">
              {mobileMenuOptions.map((option) => (
                <MobileMenuLink
                  key={option.path}
                  option={option}
                  isLocked={isLockedInDemo(option.path)}
                  onNavigate={onCloseMenu}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
