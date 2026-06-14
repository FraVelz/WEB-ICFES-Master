import { buildLegacyPracticaRedirect } from '@/features/exam/utils/simulacroNavigation';
import { redirect } from 'next/navigation';

type PageProps = {
  params: Promise<{ area: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const { area } = await params;
  const raw = await searchParams;
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === 'string') qs.set(key, value);
    else if (Array.isArray(value)) value.forEach((v) => qs.append(key, v));
  }
  const query = qs.toString();
  redirect(buildLegacyPracticaRedirect(area, query || undefined));
}
