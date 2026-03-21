/**
 * CompositeContent - Componente para combinar múltiples tipos de contenido
 *
 * Permite crear preguntas complejas con texto, imágenes, tablas, etc.
 *
 * Estructura de datos:
 * [
 *   { type: "text", content: "Pregunta inicial" },
 *   { type: "image", content: { src: "...", alt: "..." } },
 *   { type: "table", content: { headers: [...], rows: [...] } },
 *   { type: "text", content: "Pregunta final" }
 * ]
 *
 * Uso:
 * <CompositeContent
 *   blocks={[
 *     { type: "text", content: "Observa la siguiente tabla:" },
 *     { type: "table", content: { headers: [...], rows: [...] } },
 *     { type: "text", content: "¿Cuál es el promedio?" }
 *   ]}
 * />
 */
import { TextContent } from './TextContent';
import { ImageContent } from './ImageContent';
import { TableContent } from './TableContent';
import { FormulaContent } from './FormulaContent';
import { ChartContent } from './ChartContent';
import { CodeContent } from './CodeContent';
import { QuoteContent } from './QuoteContent';
import { TimelineContent } from './TimelineContent';
import { MapContent } from './MapContent';

interface ContentBlock {
  type: string;
  content?: Record<string, unknown>;
}

interface CompositeContentProps {
  blocks: ContentBlock[];
}

export const CompositeContent = ({ blocks }: CompositeContentProps) => {
  const renderBlock = (block: ContentBlock, idx: number) => {
    const { type, content } = block;

    switch (type) {
      case 'text':
        return <TextContent key={idx} text={(content as unknown) as string} />;

      case 'image':
        return <ImageContent key={idx} {...(content as Record<string, unknown>)} />;

      case 'table':
        return <TableContent key={idx} {...(content as Record<string, unknown>)} />;

      case 'formula':
        return <FormulaContent key={idx} {...(content as Record<string, unknown>)} />;

      case 'chart':
        return <ChartContent key={idx} {...(content as Record<string, unknown>)} />;

      case 'code':
        return <CodeContent key={idx} {...(content as Record<string, unknown>)} />;

      case 'quote':
        return <QuoteContent key={idx} {...(content as Record<string, unknown>)} />;

      case 'timeline':
        return <TimelineContent key={idx} {...(content as Record<string, unknown>)} />;

      case 'map':
        return <MapContent key={idx} {...(content as Record<string, unknown>)} />;

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {blocks.map((block: ContentBlock, idx: number) => renderBlock(block, idx))}
    </div>
  );
};
