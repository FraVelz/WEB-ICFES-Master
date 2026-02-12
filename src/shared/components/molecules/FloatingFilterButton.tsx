import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

export const FloatingFilterButton = () => {
  const scrollToFilters = () => {
    const filterSection = document.querySelector('[data-filter-section]');
    if (filterSection) {
      filterSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <button
      onClick={scrollToFilters}
      className="cursor-pointer fixed bottom-8 right-8 bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:shadow-cyan-500/50 hover:scale-110 animate-bounce z-50 group"
      title="Ir a Filtros"
    >
      <FontAwesomeIcon icon={faFilter} size="xl" className="group-hover:rotate-180 transition-transform duration-500" />
    </button>
  );
};
