import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/config/supabaseClient';
import {
  CHAT_ANON_COOKIE,
  CHAT_ANON_LIMIT,
  CHAT_AUTH_COOKIE,
  CHAT_AUTH_DAILY_LIMIT,
} from '@/features/learning/constants/chatQuota';
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

function parseCountCookie(request: NextRequest, name: string): number {
  const raw = request.cookies.get(name)?.value;
  const n = raw !== undefined ? parseInt(raw, 10) : 0;
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function sanitizeClientMessages(messages: Array<{ role: string; content: string }>) {
  return messages
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: typeof m.content === 'string' ? m.content : String(m.content ?? ''),
    }));
}

async function resolveChatAccess(request: NextRequest) {
  const authUser = await getAuthUserFromRequest(request);
  const isLoggedIn = !!authUser;
  const anonUsed = parseCountCookie(request, CHAT_ANON_COOKIE);
  const authUsed = parseCountCookie(request, CHAT_AUTH_COOKIE);

  return { isLoggedIn, anonUsed, authUsed, authUser };
}

export async function GET(request: NextRequest) {
  const { isLoggedIn, anonUsed, authUsed } = await resolveChatAccess(request);

  return NextResponse.json({
    anonUsed: isLoggedIn ? 0 : anonUsed,
    limit: isLoggedIn ? CHAT_AUTH_DAILY_LIMIT : CHAT_ANON_LIMIT,
    unlimited: false,
    authUsed: isLoggedIn ? authUsed : 0,
  });
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'OpenAI API key no configurada. Añade OPENAI_API_KEY en .env.local',
        },
        { status: 500 }
      );
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

    const { isLoggedIn, anonUsed, authUsed } = await resolveChatAccess(request);

    if (!isLoggedIn && anonUsed >= CHAT_ANON_LIMIT) {
      return NextResponse.json(
        {
          error: 'Has alcanzado el límite de 3 preguntas sin cuenta. Inicia sesión para seguir usando el asistente.',
          code: 'ANON_QUOTA_EXCEEDED',
          anonUsed: CHAT_ANON_LIMIT,
          limit: CHAT_ANON_LIMIT,
        },
        { status: 429 }
      );
    }

    if (isLoggedIn && authUsed >= CHAT_AUTH_DAILY_LIMIT) {
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

    const res = NextResponse.json(
      isLoggedIn
        ? { content: assistantMessage, authUsed: authUsed + 1, limit: CHAT_AUTH_DAILY_LIMIT }
        : {
            content: assistantMessage,
            anonUsed: anonUsed + 1,
            limit: CHAT_ANON_LIMIT,
          }
    );

    const cookieBase = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 60 * 60 * 24,
    };

    if (!isLoggedIn) {
      res.cookies.set(CHAT_ANON_COOKIE, String(anonUsed + 1), cookieBase);
    } else {
      res.cookies.set(CHAT_AUTH_COOKIE, String(authUsed + 1), cookieBase);
    }

    return res;
  } catch (error: unknown) {
    console.error('Error en API chat:', error);

    const err = error as { status?: number; message?: string };
    if (err?.status && err?.message) {
      return NextResponse.json({ error: err.message }, { status: typeof err.status === 'number' ? err.status : 500 });
    }

    const message = error instanceof Error ? error.message : 'Error al comunicarse con la API de OpenAI';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
