import { homedir } from 'os';
import { join } from 'path';
import type { AgentType } from './types.ts';

export const DATA_DIR = join(homedir(), '.taskhub');
export const DB_PATH = join(DATA_DIR, 'taskhub.db');
export const CONFIG_PATH = join(DATA_DIR, 'config.json');

export const DEFAULT_PRIORITIES = ['P1', 'P2', 'P3', 'P4'] as const;
export const PRIORITY_COLORS: Record<string, string> = {
  P1: '#ef4444',
  P2: '#f97316',
  P3: '#3b82f6',
  P4: '#9ca3af',
};

export const STATUS_COLORS: Record<string, string> = {
  backlog: '#6b7280',
  todo: '#3b82f6',
  in_progress: '#eab308',
  done: '#22c55e',
  cancelled: '#ef4444',
};

export const AGENTS: AgentType[] = ['claude-code', 'opencode', 'kilocode', 'pi'];
