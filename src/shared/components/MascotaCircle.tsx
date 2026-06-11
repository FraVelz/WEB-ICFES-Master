import { cn } from '@/utils/cn';
import Image, { type StaticImageData } from 'next/image';

export type MascotaCircleSize = 'sm' | 'md' | 'lg' | 'xl' | 'medium' | 'large';

export type MascotaCircleProps = {
  src: string | StaticImageData;
  alt?: string;
  size?: MascotaCircleSize;
  imgSize?: string;
  centered?: boolean;
  className?: string;
  circleClassName?: string;
};

/**
 * Muestra la imagen de la mascota dentro de un círculo con fondo oscuro.
 * Componente reutilizable con props personalizables.
 */
export const MascotaCircle = ({
  src,
  alt = 'Mascota',
  size = 'lg',
  imgSize = 'w-full h-full',
  centered = true,
  className = '',
  circleClassName = '',
}: MascotaCircleProps) => {
  const sizeMap: Record<MascotaCircleSize, string> = {
    sm: 'w-32 h-32',
    md: 'w-40 h-40',
    lg: 'w-48 h-48',
    xl: 'w-56 h-56',
    medium: 'w-40 h-40',
    large: 'w-56 h-56',
  };

  const pixelSize: Record<MascotaCircleSize, number> = {
    sm: 128,
    md: 160,
    lg: 192,
    xl: 224,
    medium: 160,
    large: 224,
  };

  const containerClass = centered ? 'flex justify-center' : '';
  const circleClass = size ? (sizeMap[size] ?? sizeMap.lg) : sizeMap.lg;
  const dimension = pixelSize[size] ?? pixelSize.lg;

  return (
    <div className={cn(containerClass, className)}>
      <div
        className={cn(
          circleClass,
          'flex items-center justify-center overflow-hidden rounded-full bg-linear-to-br',
          'from-surface-overlay to-surface-elevated shadow-lg',
          circleClassName
        )}
      >
        <Image
          draggable={false}
          src={src}
          alt={alt}
          width={dimension}
          height={dimension}
          className={cn(imgSize, 'object-cover drop-shadow-lg select-none')}
        />
      </div>
    </div>
  );
};
