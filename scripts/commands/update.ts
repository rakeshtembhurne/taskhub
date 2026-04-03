import { parseArgs } from 'util';
import { updateTask, getTaskById } from '../lib/queries';
import { detectContext } from '../lib/detect';
import type { AgentType } from '../lib/types';

export function update(args: string[]) {
  const { values, positionals } = parseArgs({
    args,
    options: {
      title: { type: 'string' },
      description: { type: 'string' },
      project: { type: 'string' },
      agent: { type: 'string' },
      status: { type: 'string' },
      priority: { type: 'string' },
    },
    allowPositionals: true,
  });

  const id = parseInt(positionals[0]);
  if (isNaN(id)) {
    console.error('Error: task ID is required');
    process.exit(1);
  }

  const existing = getTaskById(id);
  if (!existing) {
    console.error(`Error: task #${id} not found`);
    process.exit(1);
  }

  const ctx = detectContext(process.cwd());

  const task = updateTask(id, {
    title: values.title,
    description: values.description,
    project: values.project,
    assigned_agent: (values.agent as AgentType) || undefined,
    status: (values.status as any) || undefined,
    priority: (values.priority as any) || undefined,
  }, ctx.agent);

  console.log(`Updated task #${task!.id}: ${task!.title}`);
}
