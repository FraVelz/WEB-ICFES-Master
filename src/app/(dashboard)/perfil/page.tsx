'use client';
import ProtectedPage from '@/components/ProtectedPage';
import { PerfilNormal } from '@/features/user/pages';
export default function Page() { return <ProtectedPage><PerfilNormal /></ProtectedPage>; }
