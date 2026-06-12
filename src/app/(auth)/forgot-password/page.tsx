import type { Metadata } from 'next';
import { ForgotPasswordPage } from '@/features/auth';

export const metadata: Metadata = {
  title: 'Recuperar contraseña',
  description: 'Solicita un enlace para restablecer la contraseña de tu cuenta ICFES Master.',
};

export default function Page() {
  return <ForgotPasswordPage />;
}
