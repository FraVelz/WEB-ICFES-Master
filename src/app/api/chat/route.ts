import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const SYSTEM_PROMPT = `Eres un asistente educativo especializado en el examen ICFES de Colombia. Tu rol es ayudar a estudiantes a prepararse para el examen respondiendo preguntas sobre:
- Las 5 áreas del ICFES: Lectura Crítica, Matemáticas, Ciencias Naturales, Sociales y Ciudadanas, e Inglés
- Estrategias de estudio y técnicas para el examen
- Conceptos académicos relevantes para cada área
- Tips para mejorar el puntaje
- Resolución de preguntas tipo ICFES

Responde de forma clara, concisa y didáctica. Usa ejemplos cuando sea útil. Si no estás seguro de algo, indícalo. Mantén un tono amigable y motivador.`;

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key no configurada. Añade OPENAI_API_KEY en .env.local' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { messages } = body as { messages: Array<{ role: string; content: string }> };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Se requiere al menos un mensaje' },
        { status: 400 }
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
      return NextResponse.json(
        { error: 'No se recibió respuesta del modelo' },
        { status: 500 }
      );
    }

    return NextResponse.json({ content: assistantMessage });
  } catch (error: unknown) {
    console.error('Error en API chat:', error);

    const err = error as { status?: number; message?: string };
    if (err?.status && err?.message) {
      return NextResponse.json(
        { error: err.message },
        { status: typeof err.status === 'number' ? err.status : 500 }
      );
    }

    const message = error instanceof Error ? error.message : 'Error al comunicarse con la API de OpenAI';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
