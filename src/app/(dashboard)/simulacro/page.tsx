import ProtectedPage from '@/components/ProtectedPage';
import { SimulacroHubPage } from '@/features/exam/pages/SimulacroHubPage';
import { fetchPublishedCoverageByArea } from '@/features/exam/services/examQuestionsServer';

export default async function Page() {
  const coverage = await fetchPublishedCoverageByArea();

  return (
    <ProtectedPage>
      <SimulacroHubPage coverage={coverage} />
    </ProtectedPage>
  );
}
