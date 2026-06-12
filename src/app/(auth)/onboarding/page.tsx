import type { Metadata } from 'next';
import { OnboardingPage } from '@/features/auth';

export const metadata: Metadata = {
  title: 'Configurar perfil',
  description: 'Completa tu perfil en ICFES Master para personalizar tu experiencia.',
};

export default function Page() {
  return <OnboardingPage />;
}
