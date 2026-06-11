import { NextRequest, NextResponse } from 'next/server';
import { gradeExamAnswers } from '@/features/exam/services/examGradingServer';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { answers?: Record<string, string> };
    const answers = body.answers;

    if (!answers || typeof answers !== 'object' || Object.keys(answers).length === 0) {
      return NextResponse.json({ error: 'Se requieren respuestas para calificar' }, { status: 400 });
    }

    if (Object.keys(answers).length > 200) {
      return NextResponse.json({ error: 'Demasiadas respuestas en una sola petición' }, { status: 400 });
    }

    const results = await gradeExamAnswers(answers);

    return NextResponse.json({ results });
  } catch (error) {
    console.error('[api/exam/grade]', error);
    return NextResponse.json({ error: 'No se pudo calificar el examen' }, { status: 500 });
  }
}
