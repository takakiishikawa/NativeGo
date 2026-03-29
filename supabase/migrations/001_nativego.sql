-- NativeGo schema changes
-- Run this in the Supabase SQL editor

ALTER TABLE grammar
  ADD COLUMN IF NOT EXISTS lesson_id uuid REFERENCES lessons(id);

ALTER TABLE expressions
  ADD COLUMN IF NOT EXISTS lesson_id uuid REFERENCES lessons(id);

ALTER TABLE practice_logs
  ADD COLUMN IF NOT EXISTS grammar_done_count int4 DEFAULT 0,
  ADD COLUMN IF NOT EXISTS expression_done_count int4 DEFAULT 0;
