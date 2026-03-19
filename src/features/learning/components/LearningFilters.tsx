import { Icon } from '@/shared/components/Icon';
import { useRef, useState, useEffect } from 'react';

export const LearningFilters = ({
  activeArea,
  selectedTopics,
  searchTerm,
  onAreaChange,
  onTopicToggle,
  onSearchChange,
  onClearFilters,
  areaIcons,
  filteredTopics
}) => {
  const carouselRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showFilters, setShowFilters] = useState(() => window.innerWidth < 768);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const inactivityTimerRef = useRef(null);
  const autoScrollIntervalRef = useRef(null);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
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
    <section data-filter-section className="mb-16 bg-white/5 backdrop-blur-sm sm:border border-white/10 sm:rounded-2xl p-8">
      <div className="flex items-center justify-between mb-8 gap-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="cursor-pointer flex items-center gap-3 text-2xl font-bold text-white hover:text-cyan-400 transition-colors w-full justify-between"
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
            className="flex items-center gap-2 bg-red-500/30 hover:bg-red-500/50 text-red-300 px-4 py-2 rounded-lg transition-all shrink-0"
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
            <h3 className="text-lg font-semibold text-white mb-4">Áreas de Estudio</h3>
            <div className="flex flex-wrap md:grid md:grid-cols-5 gap-3">
              <button
                onClick={() => onAreaChange('all')}
                className={`cursor-pointer py-2 px-4 rounded-lg font-semibold transition-all ${
                  activeArea === 'all'
                    ? 'bg-blue-600 text-white scale-105'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                Todas
              </button>
              {Object.entries(areaIcons).map(([area, { icon, color, label }]) => (
                <button
                  key={area}
                  onClick={() => onAreaChange(area)}
                  className={`cursor-pointer py-2 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                    activeArea === area
                      ? 'bg-blue-600 text-white scale-105'
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
              <h3 className="text-lg font-semibold text-white mb-4">🔍 Buscar Temas</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Escribe para buscar temas (ej: 'Derivadas', 'Células'...)"
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 focus:bg-white/15 transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="cursor-pointer absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    <Icon name="times" />
                  </button>
                )}
              </div>
              {searchTerm && filteredTopics.length === 0 && (
                <p className="text-gray-400 text-sm mt-2">No se encontraron temas que coincidan con "{searchTerm}"</p>
              )}
            </div>

            {/* Topics Carousel */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Tags de Temas 
                {filteredTopics.length > 0 && (
                  <span className="text-cyan-400 ml-2">({filteredTopics.length})</span>
                )}
              </h3>
              
              <div>
                {/* Carousel Container */}
                <div
                  ref={carouselRef}
                  onScroll={handleCarouselScroll}
                  onMouseDown={handleUserInteraction}
                  onTouchStart={handleUserInteraction}
                  className="overflow-x-auto scroll-smooth flex gap-3 pb-4 [&::-webkit-scrollbar]:hidden"
                >
                  {filteredTopics.length > 0 ? (
                    filteredTopics.map((topic) => (
                      <button
                        key={topic}
                        onClick={() => onTopicToggle(topic)}
                        className={`cursor-pointer px-4 py-3 rounded-lg font-semibold transition-all whitespace-nowrap text-sm shrink-0 ${
                          selectedTopics.includes(topic)
                            ? 'bg-purple-600 text-white shadow-lg border border-purple-400'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
                        }`}
                      >
                        {topic}
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-400 w-full">
                      Selecciona temas usando el buscador
                    </div>
                  )}
                </div>

                {/* Navigation Bar */}
                <div className="flex items-center justify-between mt-6 gap-4">
                  {/* Left Arrow Button */}
                  <button
                    onClick={() => scroll('left')}
                    className="cursor-pointer shrink-0 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-all shadow-lg active:scale-95"
                  >
                    <Icon name="chevron-left" size="lg" />
                  </button>

                  {/* Carousel Progress Bar */}
                  <div className="grow flex flex-col gap-2">
                    <div className="w-full bg-white/10 border border-white/20 rounded-full h-2 overflow-hidden">
                      <div 
                        style={{
                          width: `${scrollProgress}%`,
                          background: 'linear-gradient(90deg, #3b82f6, #06b6d4)',
                          transition: 'width 0.2s ease-out'
                        }}
                        className="h-full shadow-lg shadow-blue-500/50"
                      ></div>
                    </div>
                  </div>

                  {/* Right Arrow Button */}
                  <button
                    onClick={() => scroll('right')}
                    className="cursor-pointer shrink-0 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-all shadow-lg active:scale-95"
                  >
                    <Icon name="chevron-right" size="lg" />
                  </button>
                </div>

                {/* Selection Counter */}
                {filteredTopics.length > 0 && (
                  <div className="text-center mt-3 text-sm text-cyan-400 font-semibold">
                    {selectedTopics.length} de {filteredTopics.length} temas seleccionados
                  </div>
                )}
              </div>

              {/* Display selected topics */}
              {selectedTopics.length > 0 && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-sm text-gray-400 mb-3">
                    📌 Temas seleccionados: <span className="text-cyan-400 font-bold">{selectedTopics.length}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTopics.map(topic => (
                      <div key={topic} className="bg-cyan-600/30 text-cyan-300 px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-cyan-500/50">
                        {topic}
                        <button
                          onClick={() => onTopicToggle(topic)}
                          className="hover:text-cyan-100 transition-colors"
                        >
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
