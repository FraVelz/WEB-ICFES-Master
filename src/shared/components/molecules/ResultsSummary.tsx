interface ResultsSummaryProps {
  activeArea: string;
  selectedTopics: string[];
  filteredMaterials: Record<string, unknown[]>;
}

export const ResultsSummary = ({ activeArea, selectedTopics, filteredMaterials }: ResultsSummaryProps) => {
  if (activeArea === 'all' && selectedTopics.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 rounded-lg border border-blue-500/50 bg-blue-500/20 p-4">
      <p className="text-blue-300">
        📚 Se encontraron{' '}
        <span className="font-bold text-cyan-300">{Object.values(filteredMaterials).flat().length}</span> materiales que
        coinciden con los filtros
      </p>
    </div>
  );
};
