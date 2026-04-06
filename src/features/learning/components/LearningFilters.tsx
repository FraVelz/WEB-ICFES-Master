'use client';

import { Icon } from '@/shared/components/Icon';
import { useRef, useState, useEffect } from 'react';

export interface AreaIconConfig {
  icon: string;
  color: string;
  label: string;
}

export interface LearningFiltersProps {
  activeArea: string;
  selectedTopics: string[];
  searchTerm: string;
  onAreaChange: (area: string) => void;
  onTopicToggle: (topic: string) => void;
  onSearchChange: (value: string) => void;
  onClearFilters: () => void;
  areaIcons: Record<string, AreaIconConfig>;
  filteredTopics: string[];
  allTopics?: string[];
}

export const LearningFilters = ({
  activeArea,
  selectedTopics,
  searchTerm,
  onAreaChange,
  onTopicToggle,
  onSearchChange,
  onClearFilters,
  areaIcons,
  filteredTopics,
  allTopics = [],
}: LearningFiltersProps) => {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showFilters, setShowFilters] = useState(() => window.innerWidth < 768);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoScrollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      updateScrollProgress();
    }
  };

  const updateScrollProgress = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      const totalScroll = scrollWidth - clientWidth;
      const progress = totalScroll > 0 ? (scrollLeft / totalScroll) * 100 : 0;
      setScrollProgress(progress);
    }
  };

  const handleCarouselScroll = () => {
    updateScrollProgress();
  };

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoScrolling || !carouselRef.current) return;

    const autoScroll = () => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        const maxScroll = scrollWidth - clientWidth;

        // Si llegamos al final, vuelve al inicio
        if (scrollLeft >= maxScroll) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Desplaza 100px cada 2 segundos
          carouselRef.current.scrollBy({ left: 100, behavior: 'smooth' });
        }
      }
    };

    autoScrollIntervalRef.current = setInterval(autoScroll, 2000);

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, [isAutoScrolling]);

  const handleUserInteraction = () => {
    // Pausa el auto-scroll cuando el usuario interactúa
    setIsAutoScrolling(false);

    // Limpia el timer anterior si existe
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    // Reanuda el auto-scroll después de 5 segundos de inactividad
    inactivityTimerRef.current = setTimeout(() => {
      setIsAutoScrolling(true);
    }, 5000);
  };

  // Limpia los timers cuando el componente se desmonta
  useEffect(() => {
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, []);

  return (
    <section
      data-filter-section
      className="mb-16 border-white/10 bg-white/5 p-8 backdrop-blur-sm sm:rounded-2xl sm:border"
    >
      <div className="mb-8 flex items-center justify-between gap-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex w-full cursor-pointer items-center justify-between gap-3 text-2xl font-bold text-white transition-colors hover:text-cyan-400"
        >
          <span className="flex items-center gap-3">
            <Icon name="filter" className="text-cyan-400" />
            Filtros
          </span>
          <Icon name={showFilters ? 'chevron-up' : 'chevron-down'} className="text-cyan-400" />
        </button>
        {(activeArea !== 'all' || selectedTopics.length > 0) && (
          <button
            onClick={onClearFilters}
            className="flex shrink-0 items-center gap-2 rounded-lg bg-red-500/30 px-4 py-2 text-red-300 transition-all hover:bg-red-500/50"
          >
            <Icon name="times" />
            Limpiar filtros
          </button>
        )}
      </div>

      {showFilters && (
        <>
          {/* Area Filter */}
          <div className="mb-8">
            <h3 className="mb-4 text-lg font-semibold text-white">Áreas de Estudio</h3>
            <div className="flex flex-wrap gap-3 md:grid md:grid-cols-5">
              <button
                onClick={() => onAreaChange('all')}
                className={`cursor-pointer rounded-lg px-4 py-2 font-semibold transition-all ${
                  activeArea === 'all'
                    ? 'scale-105 bg-blue-600 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                Todas
              </button>
              {Object.entries(areaIcons).map(([area, { icon, color, label }]) => (
                <button
                  key={area}
                  onClick={() => onAreaChange(area)}
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2 font-semibold transition-all ${
                    activeArea === area
                      ? 'scale-105 bg-blue-600 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  <Icon name={icon} className={color} />
                  <span className="inline">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Topics Section */}
          <div className="space-y-6">
            {/* Search Input */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">🔍 Buscar Temas</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Escribe para buscar temas (ej: 'Derivadas', 'Células'...)"
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 transition-all focus:border-cyan-500/50 focus:bg-white/15 focus:outline-none"
                />
                {searchTerm && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute top-1/2 right-4 -translate-y-1/2 transform cursor-pointer text-gray-400 transition-colors hover:text-white"
                  >
                    <Icon name="times" />
                  </button>
                )}
              </div>
              {searchTerm && filteredTopics.length === 0 && (
                <p className="mt-2 text-sm text-gray-400">No se encontraron temas que coincidan con "{searchTerm}"</p>
              )}
            </div>

            {/* Topics Carousel */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">
                Tags de Temas
                {filteredTopics.length > 0 && <span className="ml-2 text-cyan-400">({filteredTopics.length})</span>}
              </h3>

              <div>
                {/* Carousel Container */}
                <div
                  ref={carouselRef}
                  onScroll={handleCarouselScroll}
                  onMouseDown={handleUserInteraction}
                  onTouchStart={handleUserInteraction}
                  className="flex gap-3 overflow-x-auto scroll-smooth pb-4 [&::-webkit-scrollbar]:hidden"
                >
                  {filteredTopics.length > 0 ? (
                    filteredTopics.map((topic) => (
                      <button
                        key={topic}
                        onClick={() => onTopicToggle(topic)}
                        className={`shrink-0 cursor-pointer rounded-lg px-4 py-3 text-sm font-semibold whitespace-nowrap transition-all ${
                          selectedTopics.includes(topic)
                            ? 'border border-purple-400 bg-purple-600 text-white shadow-lg'
                            : 'border border-white/20 bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                      >
                        {topic}
                      </button>
                    ))
                  ) : (
                    <div className="w-full py-8 text-center text-gray-400">Selecciona temas usando el buscador</div>
                  )}
                </div>

                {/* Navigation Bar */}
                <div className="mt-6 flex items-center justify-between gap-4">
                  {/* Left Arrow Button */}
                  <button
                    onClick={() => scroll('left')}
                    className="shrink-0 cursor-pointer rounded-full bg-blue-600 p-3 text-white shadow-lg transition-all hover:bg-blue-700 active:scale-95"
                  >
                    <Icon name="chevron-left" size="lg" />
                  </button>

                  {/* Carousel Progress Bar */}
                  <div className="flex grow flex-col gap-2">
                    <div className="h-2 w-full overflow-hidden rounded-full border border-white/20 bg-white/10">
                      <div
                        style={{
                          width: `${scrollProgress}%`,
                          background: 'linear-gradient(90deg, #3b82f6, #06b6d4)',
                          transition: 'width 0.2s ease-out',
                        }}
                        className="h-full shadow-lg shadow-blue-500/50"
                      ></div>
                    </div>
                  </div>

                  {/* Right Arrow Button */}
                  <button
                    onClick={() => scroll('right')}
                    className="shrink-0 cursor-pointer rounded-full bg-blue-600 p-3 text-white shadow-lg transition-all hover:bg-blue-700 active:scale-95"
                  >
                    <Icon name="chevron-right" size="lg" />
                  </button>
                </div>

                {/* Selection Counter */}
                {filteredTopics.length > 0 && (
                  <div className="mt-3 text-center text-sm font-semibold text-cyan-400">
                    {selectedTopics.length} de {filteredTopics.length} temas seleccionados
                  </div>
                )}
              </div>

              {/* Display selected topics */}
              {selectedTopics.length > 0 && (
                <div className="mt-6 border-t border-white/10 pt-6">
                  <p className="mb-3 text-sm text-gray-400">
                    📌 Temas seleccionados: <span className="font-bold text-cyan-400">{selectedTopics.length}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTopics.map((topic) => (
                      <div
                        key={topic}
                        className="flex items-center gap-2 rounded-full border border-cyan-500/50 bg-cyan-600/30 px-3 py-1 text-sm text-cyan-300"
                      >
                        {topic}
                        <button onClick={() => onTopicToggle(topic)} className="transition-colors hover:text-cyan-100">
                          <Icon name="times" size="sm" className="text-xs" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
};
