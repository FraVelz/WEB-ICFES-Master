/**
 * MapContent - Componente para mostrar mapas/diagramas geográficos
 * 
 * Estructura de datos:
 * {
 *   title: "Mapa de Sudamérica",
 *   description: "Mapa mostrando países",
 *   svgContent: "<svg>...</svg>",
 *   // O usar una imagen
 *   imageSrc: "/path/to/map.png",
 *   regions: [
 *     { name: "Colombia", highlight: true, info: "Capital: Bogotá" },
 *     { name: "Perú", highlight: false, info: "Capital: Lima" }
 *   ]
 * }
 * 
 * Uso:
 * <MapContent
 *   title="División política de América del Sur"
 *   imageSrc="/maps/south-america.png"
 *   regions={[
 *     { name: "Colombia", highlight: true },
 *     { name: "Perú", highlight: true }
 *   ]}
 *   description="Territorios destacados"
 * />
 */
export const MapContent = ({ title, description, imageSrc, regions = [], svgContent }) => {
  return (
    <figure className="my-6 p-6 bg-linear-to-r from-slate-700/20 to-slate-800/20 rounded-lg border border-purple-500/20">
      {title && (
        <h4 className="text-sm font-semibold text-purple-300 mb-3 text-center">
          {title}
        </h4>
      )}

      {/* Si hay contenido SVG */}
      {svgContent && (
        <div
          className="mb-4 flex justify-center"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      )}

      {/* Si hay imagen */}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={title}
          className="w-full max-w-md mx-auto rounded-lg border border-white/10 mb-4"
        />
      )}

      {/* Lista de regiones */}
      {regions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
          {regions.map((region, idx) => (
            <div
              key={idx}
              className={`p-2 px-3 rounded text-xs font-medium transition-colors ${
                region.highlight
                  ? 'bg-purple-500/30 text-purple-200 border border-purple-500/50'
                  : 'bg-white/5 text-gray-300 border border-white/10'
              }`}
            >
              <span className="font-semibold">{region.name}</span>
              {region.info && <span className="text-gray-400 ml-2">{region.info}</span>}
            </div>
          ))}
        </div>
      )}

      {description && (
        <figcaption className="mt-4 text-xs text-gray-400 italic text-center">
          {description}
        </figcaption>
      )}
    </figure>
  );
};
