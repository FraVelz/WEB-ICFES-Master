import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faBook } from '@fortawesome/free-solid-svg-icons';

export const MaterialsGrid = ({ filteredMaterials, areaIcons, selectedTopics, onTopicToggle }) => {
  if (Object.keys(filteredMaterials).length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-2xl text-gray-400 mb-4">No se encontraron materiales que coincidan con los filtros seleccionados</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-12 mb-10">
      {Object.entries(filteredMaterials).map(([area, materials]) => (
        <div key={area} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
            <FontAwesomeIcon icon={areaIcons[area].icon} className={areaIcons[area].color} />
            {areaIcons[area].label}
          </h2>
          
          {materials.map(material => (
            <div 
              key={material.id} 
              className="p-6 bg-white/5 backdrop-blur-sm sm:border border-white/10 hover:bg-white/10 hover:border-white/20 sm:rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-105 group"
            >
              <div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors">{material.title}</h3>
                <div className={`inline-block px-4 py-1 rounded-full font-semibold text-sm text-white ${
                  material.difficulty === 'fácil' ? 'bg-green-500/30 text-green-300 border border-green-500/50' : 
                  material.difficulty === 'medio' ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/50' : 
                  'bg-red-500/30 text-red-300 border border-red-500/50'
                }`}>
                  {material.difficulty}
                </div>
              </div>

              <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                {material.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faClock} className="text-blue-400 font-semibold" />
                  <span>{material.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faBook} className="text-purple-400 font-semibold" />
                  <span>{material.lessons} lecciones</span>
                </div>
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                {material.topics.map((topic, idx) => (
                  <span 
                    key={idx} 
                    className={`inline-block px-3 py-1 rounded-full text-sm border transition-colors cursor-pointer ${
                      selectedTopics.includes(topic)
                        ? 'bg-purple-600 text-white border-purple-500'
                        : 'bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30'
                    }`}
                    onClick={() => onTopicToggle(topic)}
                  >
                    {topic}
                  </span>
                ))}
              </div>
              <Link 
                href={material.path}
                className="w-full block text-center bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 hover:shadow-lg"
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
