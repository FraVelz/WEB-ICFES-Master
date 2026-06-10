import { NextResponse } from 'next/server';
import { fetchPublicProfile } from '@/services/profile/publicProfileServer';

export const runtime = 'nodejs';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type RouteContext = {
  params: Promise<{ userId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { userId } = await context.params;

  if (!userId || !UUID_REGEX.test(userId)) {
    return NextResponse.json({ error: 'invalid_id' }, { status: 400 });
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ error: 'unavailable' }, { status: 503 });
  }

  try {
    const payload = await fetchPublicProfile(userId);

    if (!payload) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }

    return NextResponse.json(payload);
  } catch (err) {
    console.error('public profile API:', err);
    return NextResponse.json({ error: 'server' }, { status: 500 });
  }
}
