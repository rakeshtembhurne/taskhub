import { DATA_DIR } from './config.ts';
import { mkdirSync } from 'fs';

export const SCHEMA = `
CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  project TEXT,
  assigned_agent TEXT,
  created_by TEXT,
  updated_by TEXT,
  status TEXT DEFAULT 'todo' CHECK(status IN ('backlog', 'todo', 'in_progress', 'done', 'cancelled')),
  priority TEXT DEFAULT 'P3' CHECK(priority IN ('P1', 'P2', 'P3', 'P4')),
  tags TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME
);

CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_agent ON tasks(assigned_agent);
`;

export function ensureDataDir(): void {
  mkdirSync(DATA_DIR, { recursive: true });
}
