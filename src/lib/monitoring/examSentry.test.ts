import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  __setExamSentryCaptureForTests,
  captureExamRunnerError,
  isExamSentryConfigured,
} from './examSentry';

describe('examSentry', () => {
  afterEach(() => {
    __setExamSentryCaptureForTests(null);
    delete process.env.NEXT_PUBLIC_SENTRY_DSN;
  });

  it('reports load/submit errors through the capture seam', () => {
    const capture = vi.fn();
    __setExamSentryCaptureForTests(capture);

    const err = new Error('grading failed');
    captureExamRunnerError(err, { phase: 'submit', area: 'matematicas' });

    expect(capture).toHaveBeenCalledWith(err, { phase: 'submit', area: 'matematicas' });
  });

  it('is unconfigured without a DSN', () => {
    expect(isExamSentryConfigured()).toBe(false);
  });

  it('detects DSN configuration', () => {
    process.env.NEXT_PUBLIC_SENTRY_DSN = 'https://examplePublicKey@o0.ingest.sentry.io/0';
    expect(isExamSentryConfigured()).toBe(true);
  });
});
