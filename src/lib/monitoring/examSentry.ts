/**
 * Sentry facade for the exam runner (practice star mode).
 * No-ops when NEXT_PUBLIC_SENTRY_DSN is unset — safe for local/dev.
 */
export type ExamRunnerErrorPhase = 'load' | 'submit';

export type ExamRunnerErrorContext = {
  phase: ExamRunnerErrorPhase;
  area?: string;
};

type CaptureFn = (error: unknown, context: ExamRunnerErrorContext) => void;

let captureImpl: CaptureFn | null = null;
let initPromise: Promise<void> | null = null;

function getDsn(): string | undefined {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN?.trim();
  return dsn || undefined;
}

/** Test seam — inject a capture implementation without loading the SDK. */
export function __setExamSentryCaptureForTests(fn: CaptureFn | null): void {
  captureImpl = fn;
  initPromise = null;
}

async function ensureSentry(): Promise<CaptureFn | null> {
  if (captureImpl) return captureImpl;
  const dsn = getDsn();
  if (!dsn) return null;

  if (!initPromise) {
    initPromise = (async () => {
      const Sentry = await import('@sentry/nextjs');
      Sentry.init({
        dsn,
        tracesSampleRate: 0.05,
        environment: process.env.NODE_ENV,
      });
      captureImpl = (error, context) => {
        Sentry.captureException(error, {
          tags: {
            feature: 'exam-runner',
            phase: context.phase,
            ...(context.area ? { area: context.area } : {}),
          },
        });
      };
    })().catch((err) => {
      console.error('[exam-sentry] init failed', err);
      initPromise = null;
    });
  }

  await initPromise;
  return captureImpl;
}

export function captureExamRunnerError(error: unknown, context: ExamRunnerErrorContext): void {
  console.error('[exam-runner]', context.phase, error);
  if (captureImpl) {
    captureImpl(error, context);
    return;
  }
  void ensureSentry().then((capture) => {
    capture?.(error, context);
  });
}

export function isExamSentryConfigured(): boolean {
  return Boolean(getDsn());
}
