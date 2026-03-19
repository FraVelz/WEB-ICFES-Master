import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '@/shared/components/Icon';

export const MobileSectionWrapper = ({
  children,
  title,
  defaultOpen = false,
  sectionId,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef(null);
  const [maxHeight, setMaxHeight] = React.useState(
    defaultOpen ? 'none' : '0px'
  );

  // Actualizar altura máxima cuando se abre/cierra
  useEffect(() => {
    if (contentRef.current) {
      if (isOpen) {
        setMaxHeight(`${contentRef.current.scrollHeight}px`);
      } else {
        setMaxHeight('0px');
      }
    }
  }, [isOpen]);

  // Escuchar cambios de tamaño del contenido
  useEffect(() => {
    if (!isOpen) return;

    const resizeObserver = new ResizeObserver(() => {
      if (contentRef.current) {
        setMaxHeight(`${contentRef.current.scrollHeight}px`);
      }
    });

    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [isOpen]);

  return (
    <div id={sectionId} className="border-b border-slate-700/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 transition-colors hover:bg-slate-900/50"
        aria-expanded={isOpen}
        aria-controls={`section-${sectionId}`}
      >
        <h2 className="text-left text-xl font-bold text-blue-400">{title}</h2>
        <Icon
          name="chevron-down"
          className={`text-blue-400 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Contenedor con altura animada */}
      <div
        ref={contentRef}
        id={`section-${sectionId}`}
        style={{
          maxHeight,
          overflow: 'hidden',
          transition: 'max-height 0.3s ease-out',
        }}
      >
        <div className="px-4 pb-4">{children}</div>
      </div>
    </div>
  );
};
