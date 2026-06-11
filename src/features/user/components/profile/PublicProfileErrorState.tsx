'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from '@/shared/components/Icon';
import { FULL_PAGE_SHELL_CLASS } from '@/shared/constants/pageShell';
import { cn } from '@/utils/cn';
import type { PublicProfileErrorCode } from '@/services/profile/publicProfileView';

type PublicProfileErrorStateProps = {
  errorCode: PublicProfileErrorCode;
  userId?: string | null;
  isOwnProfile?: boolean;
};

const ERROR_CONTENT: Record<
  Exclude<PublicProfileErrorCode, null>,
  { title: string; message: string; icon: string; iconClassName: string }
> = {
  invalid_id: {
    title: 'Enlace inválido',
    message: 'El enlace del perfil no es válido. Comprueba que copiaste la URL completa desde Compartir en tu perfil.',
    icon: 'info-circle',
    iconClassName: 'text-amber-400',
  },
  not_found: {
    title: 'Perfil no encontrado',
    message:
      'No hay un perfil registrado con este identificador. El enlace puede estar ' +
      'desactualizado o el usuario aún no completó su registro en la plataforma.',
    icon: 'user-slash',
    iconClassName: 'text-on-surface-muted',
  },
  unavailable: {
    title: 'Perfil público no disponible',
    message:
      'No se pudo conectar con la base de datos en este entorno. ' +
      'Comprueba la configuración de Supabase o intenta más tarde.',
    icon: 'cog',
    iconClassName: 'text-app-accent',
  },
  server: {
    title: 'Error al cargar el perfil',
    message: 'Ocurrió un problema al consultar la base de datos. Intenta de nuevo en unos segundos.',
    icon: 'exclamation-circle',
    iconClassName: 'text-red-400',
  },
  network: {
    title: 'Sin conexión',
    message: 'No se pudo contactar al servidor. Revisa tu conexión e intenta otra vez.',
    icon: 'cloud',
    iconClassName: 'text-amber-400',
  },
};

const buttonClass = cn(
  'inline-flex cursor-pointer items-center justify-center gap-2 ' +
  'rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors',
  'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
  'focus-visible:ring-offset-surface'
);

export function PublicProfileErrorState({ errorCode, userId, isOwnProfile }: PublicProfileErrorStateProps) {
  const router = useRouter();
  const content = ERROR_CONTENT[errorCode ?? 'not_found'];

  return (
    <div className={cn(FULL_PAGE_SHELL_CLASS, 'flex items-center justify-center px-4 py-12')}>
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
        className={cn(
          "from-app-ring/10 absolute top-0 left-1/2 h-72 w-72 -translate-x-1/2",
          "rounded-full bg-linear-to-b to-transparent blur-3xl"
        )}/>
      </div>

      <div
      className={cn(
        "border-surface-border bg-surface-elevated/80 relative w-full max-w-lg",
        "rounded-3xl border p-8 text-center shadow-xl backdrop-blur-md"
      )}>
        <div
          className={cn(
            'mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl',
            'border-surface-border bg-surface-elevated border'
          )}
        >
          <Icon name={content.icon} className={cn('text-3xl', content.iconClassName)} />
        </div>

        <h1 className="text-on-surface text-2xl font-bold">{content.title}</h1>
        <p className="text-on-surface-muted mt-3 text-sm leading-relaxed">{content.message}</p>

        {userId && errorCode === 'not_found' && (
          <p className="text-on-surface-muted/70 mt-4 font-mono text-xs break-all">ID: {userId}</p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => router.push('/')}
            className={cn(buttonClass, 'bg-app-accent text-white')}
          >
            <Icon name="home" />
            Ir al inicio
          </button>
          {isOwnProfile ? (
            <Link
              href="/perfil"
              className={cn(buttonClass, 'border-surface-border text-on-surface border bg-transparent')}
            >
              <Icon name="circle-user" />
              Mi perfil
            </Link>
          ) : (
            <Link href="/" className={cn(buttonClass, 'border-surface-border text-on-surface border bg-transparent')}>
              <Icon name="rocket" />
              Conocer ICFES Master
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
