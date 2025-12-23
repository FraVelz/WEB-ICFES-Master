import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

/**
 * Componente para la sección collapsible de Básico, Intermedio o Avanzado
 */
export const LevelSection = ({
  config,
  isExpanded,
  onToggle,
  children,
  icon
}) => {
  const colorMap = {
    green: {
      borderColor: 'border-green-600',
      bgColor: 'bg-green-600/20',
      hoverBg: 'hover:bg-green-600/30',
      iconBg: 'bg-green-600/30',
      iconColor: 'text-green-400',
      chevronColor: 'text-green-400'
    },
    yellow: {
      borderColor: 'border-yellow-600',
      bgColor: 'bg-yellow-600/20',
      hoverBg: 'hover:bg-yellow-600/30',
      iconBg: 'bg-yellow-600/30',
      iconColor: 'text-yellow-400',
      chevronColor: 'text-yellow-400'
    },
    red: {
      borderColor: 'border-red-600',
      bgColor: 'bg-red-600/20',
      hoverBg: 'hover:bg-red-600/30',
      iconBg: 'bg-red-600/30',
      iconColor: 'text-red-400',
      chevronColor: 'text-red-400'
    }
  };

  const colors = colorMap[config.color];

  return (
    <div className={`border-2 ${colors.borderColor} ${colors.bgColor} rounded-2xl overflow-hidden`}>
      <div
        onClick={onToggle}
        className={`w-full p-6 flex items-center justify-between ${colors.hoverBg} transition-colors cursor-pointer`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
      >
        <div className="flex items-center gap-4">
          <div className={colors.iconBg + ' p-4 rounded-xl'}>
            <FontAwesomeIcon icon={icon} className={`text-3xl ${colors.iconColor}`} />
          </div>
          <div className="text-left">
            <h2 className="text-2xl font-bold text-white">{config.title}</h2>
            <p className={`${colors.iconColor}`}>{config.subtitle}</p>
          </div>
        </div>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`${colors.chevronColor} text-2xl transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </div>

      {isExpanded && (
        <div className={`border-t ${colors.borderColor} p-6 space-y-4`}>{children}</div>
      )}
    </div>
  );
};
