import { detectContext } from '../lib/detect';
import { listTasks } from '../lib/queries';
import { PRIORITY_COLORS, STATUS_COLORS } from '../lib/config';
import { join } from 'path';
import { existsSync } from 'fs';

export async function dashboard(_args: string[]) {
  const ctx = detectContext(process.cwd());
  const tasks = listTasks({ project: ctx.project || undefined });
  const tasksJson = JSON.stringify(tasks);
  const priorityColors = JSON.stringify(PRIORITY_COLORS);
  const statusColors = JSON.stringify(STATUS_COLORS);

  const wwwPath = join(import.meta.dir, '..', 'www', 'index.html');
  if (!existsSync(wwwPath)) {
    console.error('Error: www/index.html not found');
    process.exit(1);
  }

  let html = await Bun.file(wwwPath).text();
  html = html.replace('{{TASKS}}', tasksJson);
  html = html.replace('{{PRIORITY_COLORS}}', priorityColors);
  html = html.replace('{{STATUS_COLORS}}', statusColors);
  html = html.replace('{{PROJECT}}', ctx.project || '');

  const server = Bun.serve({
    port: 8888,
    async fetch(req) {
      const url = new URL(req.url);
      if (url.pathname === '/' || url.pathname === '/index.html') {
        return new Response(html, {
          headers: { 'Content-Type': 'text/html' },
        });
      }
      return new Response('Not found', { status: 404 });
    },
  });

  console.log(`Dashboard: http://localhost:${server.port}`);
  console.log('Press Ctrl+C to stop.');
}
