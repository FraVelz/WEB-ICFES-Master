import { isOpenAIEnabled } from '@/config/featureFlags';
import { RutaAprendizajeChrome } from './RutaAprendizajeChrome';

export default function RutaAprendizajeLayout({ children }: { children: React.ReactNode }) {
  return <RutaAprendizajeChrome openaiEnabled={isOpenAIEnabled()}>{children}</RutaAprendizajeChrome>;
}
