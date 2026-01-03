type Project = {
  id: string;
  name: string;
  createdAt: Date;
};

type Task = {
  id: string;
  projectId: string;
  name: string;
  assignedTo?: string;
  createdAt: Date;
};

class Store {
  private projects: Project[] = [];
  private tasks: Task[] = [];
  private nextProjectId = 1;
  private nextTaskId = 1;

  getProjects(): Project[] {
    return [...this.projects];
  }

  getProject(id: string): Project | undefined {
    return this.projects.find((p) => p.id === id);
  }

  createProject(name: string): Project {
    const project: Project = {
      id: `project-${this.nextProjectId++}`,
      name,
      createdAt: new Date(),
    };
    this.projects.push(project);
    return project;
  }

  getTasks(projectId: string): Task[] {
    return this.tasks.filter((t) => t.projectId === projectId);
  }

  addTask(projectId: string, name: string, assignedTo?: string): Task {
    const task: Task = {
      id: `task-${this.nextTaskId++}`,
      projectId,
      name,
      assignedTo,
      createdAt: new Date(),
    };
    this.tasks.push(task);
    return task;
  }

  resetData(): void {
    this.projects = [];
    this.tasks = [];
    this.nextProjectId = 1;
    this.nextTaskId = 1;
  }
}

export const store = new Store();
export type { Project, Task };

