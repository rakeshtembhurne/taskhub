import { parseArgs } from 'util';
import { listTasks } from '../lib/queries';
import { detectContext } from '../lib/detect';
import type { ListFilter } from '../lib/types';

export function list(args: string[]) {
  const { values } = parseArgs({
    args,
    options: {
      project: { type: 'string', short: 'p' },
      agent: { type: 'string', short: 'a' },
      status: { type: 'string', short: 's' },
      priority: { type: 'string', short: 'P' },
      all: { type: 'boolean', short: 'A' },
    },
  });

  const ctx = detectContext(process.cwd());

  const filter: ListFilter = {
    project: values.project || ctx.project || undefined,
    agent: (values.agent as any) || undefined,
    status: (values.status as any) || undefined,
    priority: (values.priority as any) || undefined,
    all: values.all,
  };

  const tasks = listTasks(filter);

  if (tasks.length === 0) {
    console.log('No tasks found.');
    return;
  }

  console.log(`Tasks (${tasks.length}):\n`);
  for (const task of tasks) {
    console.log(
      `#${task.id} ${task.title}\n` +
      `  Project: ${task.project || '-'} | Agent: ${task.assigned_agent || '-'} | Priority: ${task.priority} | Status: ${task.status}\n` +
      `  Created by: ${task.created_by || '-'} | Updated by: ${task.updated_by || '-'}`
    );
  }
}
