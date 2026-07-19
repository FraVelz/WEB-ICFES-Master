-- B3-2: question.version — content revision for editorial / grading integrity
-- Apply before enabling version in SELECT lists (see docs/ops/gold-bank.md).
ALTER TABLE public.exam_questions
  ADD COLUMN IF NOT EXISTS version integer NOT NULL DEFAULT 1;

ALTER TABLE public.exam_questions
  DROP CONSTRAINT IF EXISTS exam_questions_version_positive;

ALTER TABLE public.exam_questions
  ADD CONSTRAINT exam_questions_version_positive CHECK (version >= 1);

COMMENT ON COLUMN public.exam_questions.version IS
  'Monotonic content revision; bump on stem/options/key/explanation edit (Plan 12 B3-2).';

-- Optional: after this migration, recreate exam_questions_public to project `version`
-- (do not REPLACE blindly if the live view has extra columns — verify in Dashboard first).
