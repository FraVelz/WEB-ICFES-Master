/**
 * MapContent — geographic maps / diagrams in questions
 *
 * Data shape:
 * {
 *   title: "South America map",
 *   description: "Countries overview",
 *   svgContent: "<svg>...</svg>",
 *   // or use a raster image
 *   imageSrc: "/path/to/map.png",
 *   regions: [
 *     { name: "Colombia", highlight: true, info: "Capital: Bogotá" },
 *     { name: "Perú", highlight: false, info: "Capital: Lima" }
 *   ]
 * }
 *
 * Example:
 * <MapContent
 *   title="Political map of South America"
 *   imageSrc="/maps/south-america.png"
 *   regions={[
 *     { name: "Colombia", highlight: true },
 *     { name: "Perú", highlight: true }
 *   ]}
 *   description="Highlighted territories"
 * />
 */
import { cn } from '@/utils/cn';

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

export const MapContent = ({ title, description, imageSrc, regions = [], svgContent }: MapContentProps) => {
  return (
    <figure className="my-6 rounded-lg border border-purple-500/20 bg-linear-to-r from-slate-700/20 to-slate-800/20 p-6">
      {title && <h4 className="mb-3 text-center text-sm font-semibold text-purple-300">{title}</h4>}

      {/* SVG body */}
      {svgContent && <div className="mb-4 flex justify-center" dangerouslySetInnerHTML={{ __html: svgContent }} />}

      {/* Raster map image */}
      {imageSrc && (
        <img src={imageSrc} alt={title} className="mx-auto mb-4 w-full max-w-md rounded-lg border border-white/10" />
      )}

      {/* Region list */}
      {regions.length > 0 && (
        <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
          {regions.map((region: MapRegion, idx: number) => (
            <div
              key={idx}
              className={cn(
                'rounded p-2 px-3 text-xs font-medium transition-colors',
                region.highlight
                  ? 'border border-purple-500/50 bg-purple-500/30 text-purple-200'
                  : 'border border-white/10 bg-white/5 text-gray-300'
              )}
            >
              <span className="font-semibold">{region.name}</span>
              {region.info && <span className="ml-2 text-gray-400">{region.info}</span>}
            </div>
          ))}
        </div>
      )}

      {description && <figcaption className="mt-4 text-center text-xs text-gray-400 italic">{description}</figcaption>}
    </figure>
  );
};
