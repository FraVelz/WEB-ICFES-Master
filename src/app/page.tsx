import type { Metadata } from 'next';
import { HomePage } from '@/features/home/pages/HomePage';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function RootPage() {
  return <HomePage />;
}
