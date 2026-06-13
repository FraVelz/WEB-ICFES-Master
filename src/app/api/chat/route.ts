import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/config/supabaseClient';
import { checkRateLimit, getClientIp } from '@/utils/rateLimit';
import { CHAT_AUTH_COOKIE, CHAT_AUTH_DAILY_LIMIT } from '@/features/learning/constants/chatQuota';
import OpenAI from 'openai';

const MAX_MESSAGES = 30;
const MAX_MESSAGE_LENGTH = 8000;

const SYSTEM_PROMPT =
  `Eres un asistente educativo especializado en el examen ICFES de Colombia. ` +
  `Tu rol es ayudar a estudiantes a prepararse para el examen respondiendo preguntas sobre:
- Las 5 áreas del ICFES: Lectura Crítica, Matemáticas, Ciencias Naturales, Sociales y Ciudadanas, e Inglés
- Estrategias de estudio y técnicas para el examen
- Conceptos académicos relevantes para cada área
- Tips para mejorar el puntaje
- Resolución de preguntas tipo ICFES

Responde de forma clara, concisa y didáctica. Usa ejemplos cuando sea útil. Si no estás seguro de algo, indícalo. ` +
  `Mantén un tono amigable y motivador.`;

async function getAuthUserFromRequest(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  const jwt = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!jwt) return null;
  const supabase = createServerSupabaseClient(jwt);
  if (!supabase) return null;

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(jwt);

  if (error || !user) return null;
  return user;
}

function parseAuthUsageCookie(request: NextRequest): number {
  const raw = request.cookies.get(CHAT_AUTH_COOKIE)?.value;
  const n = raw !== undefined ? parseInt(raw, 10) : 0;
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function sanitizeClientMessages(messages: Array<{ role: string; content: string }>) {
  return messages
    .filter((m) => m.role === 'user')
    .map((m) => ({
      role: 'user' as const,
      content: typeof m.content === 'string' ? m.content : String(m.content ?? ''),
    }));
}

export async function GET(request: NextRequest) {
  const authUser = await getAuthUserFromRequest(request);

  if (!authUser) {
    return NextResponse.json({
      requiresAuth: true,
      limit: 0,
      authUsed: 0,
      unlimited: false,
    });
  }

  const authUsed = parseAuthUsageCookie(request);

  return NextResponse.json({
    requiresAuth: false,
    limit: CHAT_AUTH_DAILY_LIMIT,
    authUsed,
    unlimited: false,
  });
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OPENAI_API_KEY no configurada');
      return NextResponse.json({ error: 'El asistente no está disponible temporalmente.' }, { status: 503 });
    }

    const body = await request.json();
    const { messages } = body as {
      messages: Array<{ role: string; content: string }>;
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Se requiere al menos un mensaje' }, { status: 400 });
    }

    if (messages.length > MAX_MESSAGES) {
      return NextResponse.json({ error: 'Demasiados mensajes en la conversación' }, { status: 400 });
    }

    for (const m of messages) {
      if (typeof m.content === 'string' && m.content.length > MAX_MESSAGE_LENGTH) {
        return NextResponse.json({ error: 'Un mensaje es demasiado largo' }, { status: 400 });
      }
    }

    const authUser = await getAuthUserFromRequest(request);

    if (!authUser) {
      return NextResponse.json(
        {
          error: 'Debes iniciar sesión para usar el asistente.',
          code: 'AUTH_REQUIRED',
        },
        { status: 401 }
      );
    }

    const authUsed = parseAuthUsageCookie(request);
    const ip = getClientIp(request);
    const rate = await checkRateLimit(`chat:user:${authUser.id}:${ip}`, 40, 60_000);

    if (!rate.allowed) {
      return NextResponse.json({ error: 'Demasiadas solicitudes al asistente. Espera un momento.' }, { status: 429 });
    }

    if (authUsed >= CHAT_AUTH_DAILY_LIMIT) {
      return NextResponse.json(
        {
          error: 'Has alcanzado el límite diario del asistente. Vuelve mañana o continúa estudiando en la ruta.',
          code: 'AUTH_QUOTA_EXCEEDED',
          authUsed: CHAT_AUTH_DAILY_LIMIT,
          limit: CHAT_AUTH_DAILY_LIMIT,
        },
        { status: 429 }
      );
    }

    const clientMessages = sanitizeClientMessages(messages);
    if (clientMessages.length === 0) {
      return NextResponse.json({ error: 'Se requiere al menos un mensaje de usuario' }, { status: 400 });
    }

    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...clientMessages],
      max_tokens: 1024,
      temperature: 0.7,
    });

    const assistantMessage = completion.choices[0]?.message?.content;

    if (!assistantMessage) {
      return NextResponse.json({ error: 'No se recibió respuesta del modelo' }, { status: 500 });
    }

    const res = NextResponse.json({
      content: assistantMessage,
      authUsed: authUsed + 1,
      limit: CHAT_AUTH_DAILY_LIMIT,
    });

    res.cookies.set(CHAT_AUTH_COOKIE, String(authUsed + 1), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    });

    return res;
  } catch (error: unknown) {
    console.error('Error en API chat:', error);

    const err = error as { status?: number };
    if (err?.status && typeof err.status === 'number' && err.status >= 400 && err.status < 500) {
      return NextResponse.json({ error: 'No se pudo procesar la solicitud al asistente.' }, { status: err.status });
    }

    return NextResponse.json({ error: 'Error al comunicarse con el asistente. Intenta de nuevo.' }, { status: 500 });
  }
}
