import Link from 'next/link';
import { Icon } from '@/shared/components/Icon';

export const MaterialsGrid = ({
  filteredMaterials,
  areaIcons,
  selectedTopics,
  onTopicToggle,
}) => {
  if (Object.keys(filteredMaterials).length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="mb-4 text-2xl text-gray-400">
          No se encontraron materiales que coincidan con los filtros
          seleccionados
        </p>
      </div>
    );
  }

  return (
    <div className="mb-10 grid grid-cols-1 gap-12">
      {Object.entries(filteredMaterials).map(([area, materials]) => (
        <div key={area} className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <h2 className="flex items-center gap-3 text-3xl font-bold text-white md:text-4xl">
            <Icon
              name={areaIcons[area].icon}
              className={areaIcons[area].color}
            />
            {areaIcons[area].label}
          </h2>

          {materials.map((material) => (
            <div
              key={material.id}
              className="group border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-white/20 hover:bg-white/10 hover:shadow-xl sm:rounded-2xl sm:border"
            >
              <div>
                <h3 className="mb-3 text-xl font-semibold text-white transition-colors group-hover:text-blue-400">
                  {material.title}
                </h3>
                <div
                  className={`inline-block rounded-full px-4 py-1 text-sm font-semibold text-white ${
                    material.difficulty === 'fácil'
                      ? 'border border-green-500/50 bg-green-500/30 text-green-300'
                      : material.difficulty === 'medio'
                        ? 'border border-yellow-500/50 bg-yellow-500/30 text-yellow-300'
                        : 'border border-red-500/50 bg-red-500/30 text-red-300'
                  }`}
                >
                  {material.difficulty}
                </div>
              </div>

              <p className="mb-4 text-sm leading-relaxed text-gray-300">
                {material.description}
              </p>

              <div className="mb-4 grid grid-cols-2 gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <Icon name="clock" className="font-semibold text-blue-400" />
                  <span>{material.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="book" className="font-semibold text-purple-400" />
                  <span>{material.lessons} lecciones</span>
                </div>
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                {material.topics.map((topic, idx) => (
                  <span
                    key={idx}
                    className={`inline-block cursor-pointer rounded-full border px-3 py-1 text-sm transition-colors ${
                      selectedTopics.includes(topic)
                        ? 'border-purple-500 bg-purple-600 text-white'
                        : 'border-blue-500/30 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'
                    }`}
                    onClick={() => onTopicToggle(topic)}
                  >
                    {topic}
                  </span>
                ))}
              </div>
              <Link
                href={material.path}
                className="block w-full rounded-xl bg-linear-to-r from-blue-600 to-blue-700 px-4 py-2 text-center font-semibold text-white transition-all duration-300 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg"
              >
                Aprender
              </Link>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
