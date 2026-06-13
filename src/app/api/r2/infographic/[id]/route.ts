import { NextRequest, NextResponse } from 'next/server';
import { findIcfesInfographicById } from '@/features/tips/components/icfesInfographicItems';
import { fetchR2Object, R2ObjectNotFoundError } from '@/services/r2/r2Client';
import { isR2ServerConfigured } from '@/services/r2/r2Config';
import { checkRateLimit, getClientIp } from '@/utils/rateLimit';

export const runtime = 'nodejs';

type RouteContext = {
  params: Promise<{ id: string }>;
};

function isDev(): boolean {
  return process.env.NODE_ENV !== 'production';
}

export async function GET(request: NextRequest, context: RouteContext) {
  const ip = getClientIp(request);
  const rate = await checkRateLimit(`r2-infographic:${ip}`, 40, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Demasiadas solicitudes. Intenta de nuevo en un momento.' }, { status: 429 });
  }

  const { id } = await context.params;
  const infographic = findIcfesInfographicById(id);

  if (!infographic) {
    return NextResponse.json({ error: 'Infografía no encontrada' }, { status: 404 });
  }

  if (!isR2ServerConfigured()) {
    return NextResponse.json(
      {
        error: 'R2 no configurado en el servidor (R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME)',
      },
      { status: 503 }
    );
  }

  try {
    const object = await fetchR2Object(infographic.filename);
    const bytes = await object.body.transformToByteArray();

    return new NextResponse(Buffer.from(bytes), {
      status: 200,
      headers: {
        'Content-Type': object.contentType,
        'Content-Length': String(object.contentLength ?? bytes.byteLength),
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        'Content-Disposition': `inline; filename="${infographic.filename}"`,
        'Content-Security-Policy': "frame-ancestors 'self'",
        'X-Frame-Options': 'SAMEORIGIN',
      },
    });
  } catch (error) {
    console.error('[r2/infographic]', id, error);

    if (error instanceof R2ObjectNotFoundError) {
      return NextResponse.json(
        {
          error: 'PDF no encontrado en R2',
          filename: infographic.filename,
          triedKeys: isDev() ? error.triedKeys : undefined,
          hint: 'Verifica el Object key en Cloudflare y R2_PDF_PREFIX en .env',
        },
        { status: 404 }
      );
    }

    const message = error instanceof Error ? error.message : 'Error desconocido';
    const isAccessDenied =
      error instanceof Error &&
      (error.name === 'AccessDenied' || message.includes('Access Denied') || message.includes('403'));

    return NextResponse.json(
      {
        error: isAccessDenied
          ? 'Sin permisos para leer el bucket R2 (revisa el token API)'
          : 'No se pudo leer el PDF desde R2',
        details: isDev() ? message : undefined,
      },
      { status: isAccessDenied ? 403 : 502 }
    );
  }
}
