import { add } from './commands/add';
import { list } from './commands/list';
import { update } from './commands/update';
import { done } from './commands/done';
import { dashboard } from './commands/dashboard';

function run() {
  const cmd = process.argv[2];
  const args = process.argv.slice(3);

  switch (cmd) {
    case 'add':
    case 'new':
      add(args);
      break;
    case 'list':
    case 'ls':
      list(args);
      break;
    case 'update':
      update(args);
      break;
    case 'done':
      done(args);
      break;
    case 'dashboard':
    case 'board':
      dashboard(args);
      break;
    default:
      console.log(`Usage: taskhub <command>

Commands:
  taskhub add "title"           Create a new task
  taskhub list                   List tasks
  taskhub update <id>            Update a task
  taskhub done <id>              Mark task as done
  taskhub dashboard              Open dashboard
    `);
  }
}

export { run };

// Run if executed directly
run();
