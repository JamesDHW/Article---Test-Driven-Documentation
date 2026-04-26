export type SessionState = {
  email: string | null;
};

export const initialSessionState: SessionState = {
  email: null,
};

export function login(state: SessionState, email: string): SessionState {
  return {
    ...state,
    email,
  };
}

export function logout(state: SessionState): SessionState {
  return {
    ...state,
    email: null,
  };
}

export function isAuthenticated(state: SessionState) {
  return state.email !== null;
}

export function getCurrentUser(state: SessionState) {
  return state.email;
}
