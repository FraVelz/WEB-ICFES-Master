import { getLearningPhasesHref, isPhasesAreaSlug } from '@/features/learning/data/competencyPhases';
import { redirect } from 'next/navigation';

type PageProps = {
  searchParams: Promise<{ area?: string }>;
};

export default async function Page({ searchParams }: PageProps) {
  const { area } = await searchParams;
  redirect(getLearningPhasesHref(area && isPhasesAreaSlug(area) ? area : undefined));
}
