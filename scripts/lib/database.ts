import { Database } from 'bun:sqlite';
import { DB_PATH } from './config.ts';
import { SCHEMA, ensureDataDir } from './schema.ts';

let db: Database | null = null;

export function getDb(): Database {
  if (!db) {
    ensureDataDir();
    db = new Database(DB_PATH);
    db.exec('PRAGMA journal_mode = WAL');
    db.exec(SCHEMA);
  }
  return db;
}

export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}
