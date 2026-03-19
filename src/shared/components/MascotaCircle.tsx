
export type MascotaCircleSize = 'sm' | 'md' | 'lg' | 'xl';

export type MascotaCircleProps = {
  src: string;
  alt?: string;
  size?: MascotaCircleSize;
  imgSize?: string;
  centered?: boolean;
  className?: string;
  circleClassName?: string;
}

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
  circleClassName = ''
}: MascotaCircleProps) => {
  const sizeMap = {
    sm: 'w-32 h-32',
    md: 'w-40 h-40',
    lg: 'w-48 h-48',
    xl: 'w-56 h-56'
  };

  const containerClass = centered ? 'flex justify-center' : '';
  const circleClass = sizeMap[size] || sizeMap.lg;

  return (
    <div className={`${containerClass} ${className}`}>
      <div className={`${circleClass} bg-linear-to-br from-slate-800 to-slate-900 rounded-full flex items-center justify-center shadow-lg overflow-hidden ${circleClassName}`}>
        <img
          draggable="false"
          src={src}
          alt={alt}
          className={`${imgSize} select-none object-cover drop-shadow-lg`}
        />
      </div>
    </div>
  );
};
