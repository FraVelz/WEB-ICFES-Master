import { useIsMobile } from '@/hooks/useIsMobile';
import { MobileSectionWrapper } from './MobileSectionWrapper';

/**
 * Componente que envuelve secciones para hacerlas colapsables en móvil
 * En desktop se muestran normalmente
 */
export const ResponsiveSectionWrapper = ({ 
  children, 
  title, 
  sectionId,
  defaultOpen = true,
  isFirstSection = false
}) => {
  const { isMobile } = useIsMobile();

  // En desktop o primera sección del Hero, mostrar sin wrapper
  if (!isMobile || isFirstSection) {
    return children;
  }

  // En móvil, envolver en colapsable
  return (
    <MobileSectionWrapper 
      title={title} 
      sectionId={sectionId}
      defaultOpen={defaultOpen}
    >
      {children}
    </MobileSectionWrapper>
  );
};
