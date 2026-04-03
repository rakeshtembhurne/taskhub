# taskhub

**Machine-wide SQLite-backed task coordination for AI coding agents.**

When you're running AI coding agents (Claude Code, Open Code, Kilo Code, Pi) across multiple projects on the same machine, you need a shared task tracker. `taskhub` provides a single SQLite database that all agents access — one task list for your entire machine, scoped by project.

---

## What It Is

- **Machine-wide, not project-wide** — One database on your machine, tasks grouped by project
- **Multi-agent** — All agents (Claude Code, Open Code, Kilo Code, Pi) share the same task list
- **Multi-project** — Track tasks across all your projects from one CLI
- **Simple** — Single SQLite file, no server, no setup

---

## Quick Start

### 1. Install

```bash
git clone https://github.com/rakeshtembhurne/taskhub.git ~/.claude/skills/taskhub
cd ~/.claude/skills/taskhub && bun install
```

### 2. Configure Your Agent

Add to your shell profile (`.zshrc`, `.bashrc`):

```bash
# Tell taskhub which agent you are
export TASKHUB_AGENT=claude-code
```

### 3. Use It

```bash
# Add a task (project auto-detected from folder or .taskhub.json)
taskhub add "Fix login bug" --priority=P1 --tags=auth

# List tasks for current project
taskhub list

# List tasks across all projects
taskhub list --all

# Work on a task
taskhub update 1 --status=in_progress

# Mark done
taskhub done 1

# Open Kanban dashboard
taskhub dashboard
```

---

## How It Works

### Database Location

All tasks stored in: `~/.taskhub/taskhub.db`

One database for your entire machine. Projects separate tasks within it.

### Project Detection

When you run `taskhub` without `--project`, it detects the project from:

1. `TASKHUB_PROJECT` env variable
2. `.taskhub.json` in current directory or any parent
3. Current folder name

### Agent Detection

The `TASKHUB_AGENT` env var identifies which agent is running the command. This is automatically set for audit fields (`created_by`, `updated_by`).

---

## Commands

```bash
# Create
taskhub add "Build checkout flow" --project=myapp --priority=P1 --tags=commerce

# List
taskhub list                              # Current project, non-done
taskhub list --all                        # All projects, non-done
taskhub list --project=myapp --status=todo   # Filter by project + status
taskhub list --agent=claude-code          # Tasks assigned to agent
taskhub list --priority=P1                # Filter by priority

# Update
taskhub update 1 --status=in_progress
taskhub update 1 --assigned=kilocode
taskhub update 1 --priority=P2

# Complete
taskhub done 1

# Dashboard
taskhub dashboard  # Opens Kanban at http://localhost:8080
```

---

## Task Fields

| Field | Description |
|-------|-------------|
| `id` | Auto-increment ID |
| `title` | Task description |
| `project` | Project name (auto-detected) |
| `status` | `backlog`, `todo`, `in_progress`, `done`, `cancelled` |
| `priority` | `P1` (highest) → `P4` (lowest) |
| `assigned_agent` | Agent working on it |
| `tags` | Comma-separated labels |
| `created_by` | Agent who created it |
| `updated_by` | Agent who last modified it |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Your Machine                          │
│                                                              │
│   ~/.taskhub/taskhub.db (SQLite)                            │
│                                                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  Project: myapp    │  Project: cli     │  Project: web  │   │
│   │  ─────────────     │  ────────────     │  ────────────  │   │
│   │  • Task 1    P1   │  • Task 5   P2   │  • Task 8  P1  │   │
│   │  • Task 2    P2   │  • Task 6   P1   │  • Task 9  P3  │   │
│   │  • Task 3    P3   │                   │                 │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                              │
│   Agents:                                                    │
│   ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐           │
│   │ Claude │  │ Open   │  │ Kilo   │  │  Pi    │           │
│   │ Code   │  │ Code   │  │ Code   │  │        │           │
│   └────────┘  └────────┘  └────────┘  └────────┘           │
│        │           │           │           │                 │
│        └───────────┴───────────┴───────────┘                 │
│                        │                                     │
│               taskhub CLI (read/write)                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Example Workflow

```bash
# You're on project "myapp", Claude Code agent
taskhub add "Implement API endpoint" --priority=P1
taskhub add "Add unit tests" --priority=P2

# Switch to another project
cd ~/projects/cli-tool

# OpenCode agent picks up a task
taskhub list --project=cli-tool --status=todo
taskhub update 5 --assigned=opencode --status=in_progress

# Kilo Code checks what's P1 across all projects
taskhub list --priority=P1 --all

# OpenCode finishes
taskhub done 5

# View everything on dashboard
taskhub dashboard
```

---

## Requirements

- **Bun** — https://bun.sh
- **SQLite** — bundled with Bun (`bun:sqlite`)

---

## Contributing

```bash
# Clone
git clone https://github.com/rakeshtembhurne/taskhub.git ~/.claude/skills/taskhub

# Branch from develop
git checkout -b feature/my-feature develop

# Commit, push, PR to develop → merge to master for release
```

---

## License

MIT
