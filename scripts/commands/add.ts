import { parseArgs } from 'util';
import { createTask } from '../lib/queries';
import { detectContext } from '../lib/detect';
import type { TaskPriority, AgentType } from '../lib/types';

export function add(args: string[]) {
  const { values, positionals } = parseArgs({
    args,
    options: {
      project: { type: 'string', short: 'p' },
      agent: { type: 'string', short: 'a' },
      priority: { type: 'string', short: 'P' },
      tags: { type: 'string', short: 't' },
      description: { type: 'string', short: 'd' },
    },
    allowPositionals: true,
  });

  const title = positionals.join(' ');
  if (!title) {
    console.error('Error: title is required');
    process.exit(1);
  }

  const ctx = detectContext(process.cwd());

  const task = createTask(
    {
      title,
      description: values.description,
      project: values.project || ctx.project || undefined,
      assigned_agent: (values.agent as AgentType) || undefined,
      priority: (values.priority as TaskPriority) || undefined,
      tags: values.tags ? values.tags.split(',').map(s => s.trim()) : undefined,
    },
    ctx.agent
  );

  console.log(`Created task #${task.id}: ${task.title}`);
}
