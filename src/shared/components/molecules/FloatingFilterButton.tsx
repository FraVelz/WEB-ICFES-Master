import { Icon } from '@/shared/components/Icon';

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
      className="group fixed right-8 bottom-8 z-50 animate-bounce cursor-pointer rounded-full bg-linear-to-r from-blue-600 to-cyan-600 p-4 text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:from-blue-700 hover:to-cyan-700 hover:shadow-cyan-500/50"
      title="Ir a Filtros"
    >
      <Icon
        name="filter"
        size="xl"
        className="transition-transform duration-500 group-hover:rotate-180"
      />
    </button>
  );
};
