export type Project = {
  id: string;
  name: string;
  createdAt: Date;
};

export type Task = {
  id: string;
  projectId: string;
  name: string;
  assignedTo?: string;
  createdAt: Date;
};

export const ASSIGNEES = ['Alice', 'Bob', 'Charlie', 'Diana'] as const;

export type AppDataState = {
  projects: Project[];
  tasks: Task[];
  projectCounter: number;
  taskCounter: number;
};

export const initialAppDataState: AppDataState = {
  projects: [],
  tasks: [],
  projectCounter: 1,
  taskCounter: 1,
};

export function createProject(state: AppDataState, name: string) {
  const projectId = `project-${state.projectCounter}`;
  const project: Project = {
    id: projectId,
    name,
    createdAt: new Date(),
  };

  return {
    nextState: {
      ...state,
      projects: [...state.projects, project],
      projectCounter: state.projectCounter + 1,
    },
    project,
  };
}

export function addTask(
  state: AppDataState,
  projectId: string,
  name: string,
  assignedTo?: string,
) {
  const taskId = `task-${state.taskCounter}`;
  const task: Task = {
    id: taskId,
    projectId,
    name,
    assignedTo,
    createdAt: new Date(),
  };

  return {
    nextState: {
      ...state,
      tasks: [...state.tasks, task],
      taskCounter: state.taskCounter + 1,
    },
    task,
  };
}

export function getProjectById(state: AppDataState, projectId: string) {
  return state.projects.find((project) => project.id === projectId);
}

export function getTasksForProject(state: AppDataState, projectId: string) {
  return state.tasks.filter((task) => task.projectId === projectId);
}
