-- Schema inicial do banco de cursos (Cloudflare D1)
-- Fonte de verdade dos cursos passa a ser este banco em vez de src/data/cursos.json.

CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  segment TEXT NOT NULL,
  featured INTEGER NOT NULL DEFAULT 0,
  coming_soon INTEGER NOT NULL DEFAULT 0,
  hidden INTEGER NOT NULL DEFAULT 0,
  duration TEXT,
  modality TEXT,
  img TEXT,
  short TEXT,
  for_who TEXT,
  learn TEXT NOT NULL DEFAULT '[]',    -- JSON array de strings
  syllabus TEXT NOT NULL DEFAULT '[]', -- JSON array de strings
  sort_order INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  expires_at INTEGER NOT NULL
);
