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
interface MapRegion {
  name?: string;
  highlight?: boolean;
  info?: string;
}

interface MapContentProps {
  title?: string;
  description?: string;
  imageSrc?: string;
  regions?: MapRegion[];
  svgContent?: string;
}

export const MapContent = ({
  title,
  description,
  imageSrc,
  regions = [],
  svgContent,
}: MapContentProps) => {
  return (
    <figure className="my-6 rounded-lg border border-purple-500/20 bg-linear-to-r from-slate-700/20 to-slate-800/20 p-6">
      {title && (
        <h4 className="mb-3 text-center text-sm font-semibold text-purple-300">
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
          className="mx-auto mb-4 w-full max-w-md rounded-lg border border-white/10"
        />
      )}

      {/* Lista de regiones */}
      {regions.length > 0 && (
        <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
          {regions.map((region: MapRegion, idx: number) => (
            <div
              key={idx}
              className={`rounded p-2 px-3 text-xs font-medium transition-colors ${
                region.highlight
                  ? 'border border-purple-500/50 bg-purple-500/30 text-purple-200'
                  : 'border border-white/10 bg-white/5 text-gray-300'
              }`}
            >
              <span className="font-semibold">{region.name}</span>
              {region.info && (
                <span className="ml-2 text-gray-400">{region.info}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {description && (
        <figcaption className="mt-4 text-center text-xs text-gray-400 italic">
          {description}
        </figcaption>
      )}
    </figure>
  );
};
