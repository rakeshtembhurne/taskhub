---
name: taskhub
description: "Task coordination CLI and Kanban dashboard for multi-agent workflows. Use when: managing shared tasks across Claude Code, Open Code, Kilo Code, and Pi agents. Setting up task tracking for a project. Viewing task status via Kanban board. DO NOT USE when: working on single-agent projects without coordination needs. General coding tasks that don't require tracking."
---

# taskhub

A shared SQLite-backed task coordination system for multi-agent workflows. All agents (Claude Code, Open Code, Kilo Code, Pi) share a central task database.

## Setup

Each agent should set the `TASKHUB_AGENT` environment variable on startup:
- Claude Code: `export TASKHUB_AGENT=claude-code`
- Open Code: `export TASKHUB_AGENT=opencode`
- Kilo Code: `export TASKHUB_AGENT=kilocode`
- Pi: `export TASKHUB_AGENT=pi`

Create a `.taskhub.json` in your project root (optional):
```json
{
  "project": "my-project-name"
}
```

## Commands

```
taskhub add "Task title" --project=X --priority=P1 --tags=bug,urgent
taskhub list
taskhub list --status=todo
taskhub list --all
taskhub update <id> --status=in_progress
taskhub done <id>
taskhub dashboard
```

## Context Detection

- `agent`: From `TASKHUB_AGENT` env var
- `project`: From `.taskhub.json` in cwd/parents, or folder name fallback

## Dashboard

Run `taskhub dashboard` to open the Kanban board in your browser.
