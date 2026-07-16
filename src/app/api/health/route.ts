import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/services/persistence/supabaseConfigured';
import { isExamSentryConfigured } from '@/lib/monitoring/examSentry';

/**
 * Liveness for uptime monitors (B2-2).
 * Does not probe Supabase/network — only reports local process + config flags.
 */
export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      service: 'web-icfes-master',
      timestamp: new Date().toISOString(),
      checks: {
        supabaseConfigured: isSupabaseConfigured(),
        examSentryConfigured: isExamSentryConfigured(),
      },
    },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  );
}
