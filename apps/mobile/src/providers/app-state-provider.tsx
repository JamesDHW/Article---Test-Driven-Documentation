import React, { createContext, PropsWithChildren, useContext, useMemo, useReducer } from 'react';

import { getCurrentUser, initialSessionState, isAuthenticated, login, logout } from '@/lib/mobile-auth';
import {
  addTask,
  AppDataState,
  ASSIGNEES,
  createProject,
  getProjectById,
  getTasksForProject,
  initialAppDataState,
  Project,
  Task,
} from '@/lib/mobile-store';

type State = {
  session: typeof initialSessionState;
  data: AppDataState;
};

type Action =
  | { type: 'login'; payload: { email: string } }
  | { type: 'logout' }
  | { type: 'createProject'; payload: { name: string } }
  | { type: 'addTask'; payload: { projectId: string; name: string; assignedTo?: string } };

const initialState: State = {
  session: initialSessionState,
  data: initialAppDataState,
};

function appReducer(state: State, action: Action): State {
  if (action.type === 'login') {
    const { email } = action.payload;
    return {
      ...state,
      session: login(state.session, email),
    };
  }

  if (action.type === 'logout') {
    return {
      ...state,
      session: logout(state.session),
    };
  }

  if (action.type === 'createProject') {
    const { name } = action.payload;
    const { nextState } = createProject(state.data, name);
    return {
      ...state,
      data: nextState,
    };
  }

  const { projectId, name, assignedTo } = action.payload;
  const { nextState } = addTask(state.data, projectId, name, assignedTo);
  return {
    ...state,
    data: nextState,
  };
}

type AppStateContextValue = {
  isAuthenticated: boolean;
  currentUser: string | null;
  projects: Project[];
  assignees: readonly string[];
  loginWithEmail: (email: string) => void;
  logoutCurrentUser: () => void;
  createProjectWithName: (name: string) => Project;
  getProject: (projectId: string) => Project | undefined;
  getProjectTasks: (projectId: string) => Task[];
  createTaskForProject: (projectId: string, name: string, assignedTo?: string) => Task | null;
};

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const value = useMemo<AppStateContextValue>(() => {
    const auth = isAuthenticated(state.session);
    const currentUser = getCurrentUser(state.session);

    function loginWithEmail(email: string) {
      dispatch({ type: 'login', payload: { email } });
    }

    function logoutCurrentUser() {
      dispatch({ type: 'logout' });
    }

    function createProjectWithName(name: string) {
      const { project } = createProject(state.data, name);
      dispatch({ type: 'createProject', payload: { name } });
      return project;
    }

    function getProject(projectId: string) {
      return getProjectById(state.data, projectId);
    }

    function getProjectTasks(projectId: string) {
      return getTasksForProject(state.data, projectId);
    }

    function createTaskForProject(projectId: string, name: string, assignedTo?: string) {
      const project = getProjectById(state.data, projectId);
      if (!project) {
        return null;
      }

      const { task } = addTask(state.data, projectId, name, assignedTo);
      dispatch({
        type: 'addTask',
        payload: {
          projectId,
          name,
          assignedTo,
        },
      });
      return task;
    }

    return {
      isAuthenticated: auth,
      currentUser,
      projects: state.data.projects,
      assignees: ASSIGNEES,
      loginWithEmail,
      logoutCurrentUser,
      createProjectWithName,
      getProject,
      getProjectTasks,
      createTaskForProject,
    };
  }, [state]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }

  return context;
}
