import { getLearningPhasesHref } from '@/features/learning/data/competencyPhases';
import { redirect } from 'next/navigation';

export default function Page() {
  redirect(getLearningPhasesHref());
}
