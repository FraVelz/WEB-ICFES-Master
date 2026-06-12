import type { Metadata } from 'next';
import { SignupPage } from '@/features/auth';

export const metadata: Metadata = {
  title: 'Crear cuenta',
  description: 'Regístrate en ICFES Master y comienza a prepararte para el ICFES.',
};

export default function Page() {
  return <SignupPage />;
}
