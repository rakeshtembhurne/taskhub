import { markDone, getTaskById } from '../lib/queries';
import { detectContext } from '../lib/detect';

export function done(args: string[]) {
  const id = parseInt(args[0]);
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
  const task = markDone(id, ctx.agent);

  console.log(`Task #${task!.id} marked as done.`);
}
