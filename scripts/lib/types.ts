export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'done' | 'cancelled';
export type TaskPriority = 'P1' | 'P2' | 'P3' | 'P4';
export type AgentType = 'claude-code' | 'opencode' | 'kilocode' | 'pi' | null;

export interface Task {
  id: number;
  title: string;
  description: string | null;
  project: string | null;
  assigned_agent: AgentType;
  created_by: AgentType;
  updated_by: AgentType;
  status: TaskStatus;
  priority: TaskPriority;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  project?: string;
  assigned_agent?: AgentType;
  priority?: TaskPriority;
  tags?: string[];
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  project?: string;
  assigned_agent?: AgentType;
  status?: TaskStatus;
  priority?: TaskPriority;
  tags?: string[];
}

export interface Context {
  agent: AgentType;
  project: string | null;
}

export interface ListFilter {
  project?: string;
  agent?: AgentType;
  status?: TaskStatus;
  priority?: TaskPriority;
  all?: boolean;
}
