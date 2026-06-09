import { cn } from '@/utils/cn';

type DefaultProfileAvatarGraphicProps = {
  className?: string;
};

/** Silueta neutra (sin foto de perfil). Geometría contenida dentro del círculo de recorte. */
export function DefaultProfileAvatarGraphic({ className }: DefaultProfileAvatarGraphicProps) {
  return (
    <svg
      viewBox="0 0 128 128"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('h-full w-full', className)}
      role="img"
      aria-hidden
    >
      <circle cx="64" cy="64" r="64" className="fill-surface-elevated" />
      <circle cx="64" cy="48" r="18" className="fill-on-surface-muted/50" />
      <path d="M34 108c7-18 19-28 30-28s23 10 30 28" className="fill-on-surface-muted/50" />
    </svg>
  );
}
