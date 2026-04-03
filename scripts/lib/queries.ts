import { getDb } from './database.ts';
import type { Task, CreateTaskInput, UpdateTaskInput, ListFilter, AgentType } from './types.ts';

function rowToTask(row: any): Task {
  return {
    ...row,
    tags: row.tags ? JSON.parse(row.tags) : null,
  };
}

export function createTask(input: CreateTaskInput, createdBy: AgentType): Task {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO tasks (title, description, project, assigned_agent, created_by, updated_by, priority, tags)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    input.title,
    input.description || null,
    input.project || null,
    input.assigned_agent || null,
    createdBy,
    createdBy,
    input.priority || 'P3',
    input.tags ? JSON.stringify(input.tags) : null
  );
  return getTaskById(Number(result.lastInsertRowid))!;
}

export function getTaskById(id: number): Task | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  return row ? rowToTask(row) : null;
}

export function listTasks(filter: ListFilter): Task[] {
  const db = getDb();
  let sql = 'SELECT * FROM tasks WHERE 1=1';
  const params: any[] = [];

  if (!filter.all && filter.project) {
    sql += ' AND project = ?';
    params.push(filter.project);
  }
  if (filter.agent) {
    sql += ' AND assigned_agent = ?';
    params.push(filter.agent);
  }
  if (filter.status) {
    sql += ' AND status = ?';
    params.push(filter.status);
  }
  if (filter.priority) {
    sql += ' AND priority = ?';
    params.push(filter.priority);
  }

  sql += ' ORDER BY created_at DESC';
  const rows = db.prepare(sql).all(...params);
  return rows.map(rowToTask);
}

export function updateTask(id: number, input: UpdateTaskInput, updatedBy: AgentType): Task | null {
  const db = getDb();
  const fields: string[] = ['updated_by = ?'];
  const params: any[] = [updatedBy];

  if (input.title !== undefined) { fields.push('title = ?'); params.push(input.title); }
  if (input.description !== undefined) { fields.push('description = ?'); params.push(input.description); }
  if (input.project !== undefined) { fields.push('project = ?'); params.push(input.project); }
  if (input.assigned_agent !== undefined) { fields.push('assigned_agent = ?'); params.push(input.assigned_agent); }
  if (input.status !== undefined) {
    fields.push('status = ?');
    params.push(input.status);
    if (input.status === 'done') {
      fields.push('completed_at = CURRENT_TIMESTAMP');
    }
  }
  if (input.priority !== undefined) { fields.push('priority = ?'); params.push(input.priority); }
  if (input.tags !== undefined) { fields.push('tags = ?'); params.push(JSON.stringify(input.tags)); }

  params.push(id);
  const sql = `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`;
  db.prepare(sql).run(...params);
  return getTaskById(id);
}

export function markDone(id: number, updatedBy: AgentType): Task | null {
  return updateTask(id, { status: 'done' }, updatedBy);
}

export function deleteTask(id: number): boolean {
  const db = getDb();
  const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  return result.changes > 0;
}
