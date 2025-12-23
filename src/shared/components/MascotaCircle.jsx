import PropTypes from 'prop-types';

/**
 * Componente MascotaCircle
 * Muestra la imagen de la mascota dentro de un círculo con fondo oscuro
 * Componente reutilizable con props personalizables
 *
 * @param {string} src - URL de la imagen de la mascota
 * @param {string} alt - Texto alternativo para la imagen
 * @param {string} size - Tamaño del círculo: 'small', 'medium', 'large', 'xlarge'
 * @param {string} imgSize - Tamaño de la imagen dentro del círculo
 * @param {boolean} centered - Si el círculo debe estar centrado
 * @param {string} className - Clases adicionales para el contenedor externo
 * @param {string} circleClassName - Clases adicionales para el círculo
 */
export const MascotaCircle = ({
  src,
  alt = 'Mascota',
  size = 'large',
  imgSize = 'w-full h-full',
  centered = true,
  className = '',
  circleClassName = ''
}) => {
  const sizeMap = {
    small: 'w-32 h-32',
    medium: 'w-40 h-40',
    large: 'w-48 h-48',
    xlarge: 'w-56 h-56'
  };

  const containerClass = centered ? 'flex justify-center' : '';
  const circleClass = sizeMap[size] || sizeMap.large;

  return (
    <div className={`${containerClass} ${className}`}>
      <div className={`${circleClass} bg-gradient-to-br from-slate-800 to-slate-900 rounded-full flex items-center justify-center shadow-lg overflow-hidden ${circleClassName}`}>
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

MascotaCircle.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
  imgSize: PropTypes.string,
  centered: PropTypes.bool,
  className: PropTypes.string,
  circleClassName: PropTypes.string
};
