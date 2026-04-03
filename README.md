# taskhub

**Shared SQLite-backed task coordination CLI for multi-agent workflows.**

When you're running multiple AI coding agents (Claude Code, Open Code, Kilo Code, Pi) on the same project, you need a shared task list. `taskhub` gives all agents access to the same task database with a simple CLI and a Kanban dashboard.

---

## Quick Start

### 1. Setup (One Time)

```bash
# Clone the repo
git clone https://github.com/rakeshtembhurne/taskhub.git ~/.claude/skills/taskhub

# Install dependencies (Bun required)
cd ~/.claude/skills/taskhub
bun install
```

### 2. Configure Your Agent

Add this to your agent's startup script or `.zshrc`:

```bash
# Required: Tell taskhub which agent you are
export TASKHUB_AGENT=claude-code

# Optional: Set default project (can also use .taskhub.json)
export TASKHUB_PROJECT=my-project
```

### 3. Create a Project Config (Optional)

In your project root, create `.taskhub.json`:

```json
{
  "project": "my-project"
}
```

---

## Commands

```bash
# Create a task
taskhub add "Build user authentication" --project=myapp --priority=P1 --tags=auth,backend

# List tasks (filter by project, status, agent)
taskhub list
taskhub list --project=myapp --status=todo
taskhub list --agent=claude-code --priority=P1

# Update a task
taskhub update 1 --status=in_progress --assigned=opencode

# Mark task done
taskhub done 1

# Open Kanban dashboard
taskhub dashboard
```

---

## Examples

### Create Tasks with Different Priorities

```bash
taskhub add "Setup database" --priority=P1 --tags=backend
taskhub add "Add CSS styling" --priority=P3 --tags=frontend
taskhub add "Write tests" --priority=P2 --tags=testing
```

### Filter and Track

```bash
# Show all P1 tasks across projects
taskhub list --priority=P1 --all

# Show tasks assigned to you
taskhub list --assigned=claude-code

# Show tasks in progress
taskhub list --status=in_progress
```

---

## Features

### Task Properties

| Field | Description | Example |
|-------|-------------|---------|
| `id` | Auto-increment ID | `1`, `2`, `3` |
| `title` | Task description | `"Build auth"` |
| `project` | Project name | `myapp` |
| `status` | `backlog`, `todo`, `in_progress`, `done`, `cancelled` | `todo` |
| `priority` | `P1` (highest) to `P4` (lowest) | `P1` |
| `assigned_agent` | Agent handling it | `claude-code` |
| `tags` | Comma-separated labels | `auth,backend` |
| `created_by` | Agent who created it | `claude-code` |
| `updated_by` | Agent who last modified it | `opencode` |

### Context Detection

**Agent detection** — automatically set via `TASKHUB_AGENT` environment variable.

**Project detection** — resolved in order:
1. `TASKHUB_PROJECT` environment variable
2. `.taskhub.json` in current directory or parents
3. Current folder name

### Dashboard

Run `taskhub dashboard` to open a Kanban board in your browser at `http://localhost:8080`.

- Drag tasks between columns
- Filter by project, agent, priority
- Real-time updates

---

## Architecture

```
taskhub/
├── scripts/
│   ├── taskhub           # CLI entry point (bash wrapper)
│   ├── taskhub.ts        # Command router
│   ├── commands/         # Individual command implementations
│   │   ├── add.ts
│   │   ├── list.ts
│   │   ├── update.ts
│   │   ├── done.ts
│   │   └── dashboard.ts
│   ├── lib/              # Shared modules
│   │   ├── database.ts   # SQLite connection (bun:sqlite)
│   │   ├── queries.ts    # SQL query builders
│   │   ├── schema.ts     # Database schema
│   │   ├── config.ts     # Constants and paths
│   │   ├── detect.ts     # Context detection
│   │   └── types.ts     # TypeScript interfaces
│   └── www/
│       └── index.html    # Kanban dashboard (single HTML)
├── SKILL.md              # Agent skill documentation
└── package.json
```

**Database**: SQLite at `~/.taskhub/taskhub.db`

---

## Multi-Agent Workflow

```
┌─────────────────────────────────────────────────────┐
│                  Your Project                        │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │ Claude   │  │ Open     │  │ Kilo     │         │
│  │ Code     │  │ Code     │  │ Code     │         │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘         │
│       │             │             │                 │
│       └─────────────┼─────────────┘                 │
│                     │                               │
│              ┌──────▼──────┐                        │
│              │  taskhub    │                        │
│              │  (SQLite)   │                        │
│              └─────────────┘                        │
└─────────────────────────────────────────────────────┘
```

**Example workflow:**
1. Claude Code starts a feature: `taskhub add "Implement API" --priority=P1`
2. Kilo Code checks what's needed: `taskhub list --project=myapp --status=todo`
3. Open Code picks up a task: `taskhub update 2 --assigned=opencode --status=in_progress`
4. Open Code finishes: `taskhub done 2`
5. View progress: `taskhub dashboard`

---

## Requirements

- **Bun** — JavaScript runtime (https://bun.sh)
- **SQLite** — bundled with Bun's `bun:sqlite`

---

## Contributing

1. Fork the repo
2. Create a branch from `develop`: `git checkout -b feature/my-feature`
3. Make changes and commit
4. Open a PR to `develop`
5. After review, merge to `master` for release

---

## License

MIT
