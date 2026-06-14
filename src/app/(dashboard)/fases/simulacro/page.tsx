import { buildLegacyPhaseSkipRedirect } from '@/features/exam/utils/simulacroNavigation';
import { redirect } from 'next/navigation';

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const area = typeof params.area === 'string' ? params.area : undefined;
  const etapa = typeof params.etapa === 'string' ? params.etapa : undefined;
  redirect(buildLegacyPhaseSkipRedirect(area, etapa));
}
