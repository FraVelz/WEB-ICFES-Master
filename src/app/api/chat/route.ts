import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const CHAT_ANON_COOKIE = 'icfes_chat_anon_used';
const CHAT_ANON_LIMIT = 3;
const MAX_MESSAGES = 30;
const MAX_MESSAGE_LENGTH = 8000;

const SYSTEM_PROMPT = `Eres un asistente educativo especializado en el examen ICFES de Colombia. Tu rol es ayudar a estudiantes a prepararse para el examen respondiendo preguntas sobre:
- Las 5 áreas del ICFES: Lectura Crítica, Matemáticas, Ciencias Naturales, Sociales y Ciudadanas, e Inglés
- Estrategias de estudio y técnicas para el examen
- Conceptos académicos relevantes para cada área
- Tips para mejorar el puntaje
- Resolución de preguntas tipo ICFES

Responde de forma clara, concisa y didáctica. Usa ejemplos cuando sea útil. Si no estás seguro de algo, indícalo. Mantén un tono amigable y motivador.`;

async function getAuthUserFromRequest(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  const authHeader = request.headers.get('Authorization');
  const jwt = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!jwt) return null;
  const supabase = createClient(url, key);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(jwt);
  if (error || !user) return null;
  return user;
}

function parseAnonCookie(request: NextRequest): number {
  const raw = request.cookies.get(CHAT_ANON_COOKIE)?.value;
  const n = raw !== undefined ? parseInt(raw, 10) : 0;
  return Number.isFinite(n) && n >= 0 ? n : 0;
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

    const hasSupabaseAuth = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const authUser = await getAuthUserFromRequest(request);
    /** Sin Supabase en el proyecto no hay JWT: no aplicar cuota (alineado con usuario mock en cliente). */
    const isLoggedIn = !!authUser || !hasSupabaseAuth;

    let anonUsed = parseAnonCookie(request);
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

    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map((m) => ({
          role: m.role as 'user' | 'assistant' | 'system',
          content: m.content,
        })),
      ],
      max_tokens: 1024,
      temperature: 0.7,
    });

    const assistantMessage = completion.choices[0]?.message?.content;

    if (!assistantMessage) {
      return NextResponse.json({ error: 'No se recibió respuesta del modelo' }, { status: 500 });
    }

    const res = NextResponse.json(
      isLoggedIn
        ? { content: assistantMessage }
        : {
            content: assistantMessage,
            anonUsed: anonUsed + 1,
            limit: CHAT_ANON_LIMIT,
          }
    );

    if (!isLoggedIn) {
      const next = anonUsed + 1;
      res.cookies.set(CHAT_ANON_COOKIE, String(next), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
      });
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
