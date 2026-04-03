import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import type { Context, AgentType } from './types.ts';

export function detectAgent(): AgentType | null {
  const envAgent = process.env.TASKHUB_AGENT;
  if (envAgent) {
    return envAgent as AgentType;
  }
  return null;
}

export function detectProject(cwd: string): string | null {
  let dir: string | null = cwd;
  while (dir !== null) {
    const configPath = join(dir, '.taskhub.json');
    if (existsSync(configPath)) {
      try {
        const content = JSON.parse(readFileSync(configPath, 'utf-8'));
        if (content.project) return content.project;
      } catch {}
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return cwd.split('/').pop() || null;
}

export function detectContext(cwd: string): Context {
  return {
    agent: detectAgent(),
    project: detectProject(cwd),
  };
}
