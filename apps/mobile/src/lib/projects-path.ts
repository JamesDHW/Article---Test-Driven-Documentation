// useSegments() yields "[id]" for dynamic files; usePathname() has the real path segment.
export type ProjectsRoute =
  | { kind: 'list' }
  | { kind: 'new' }
  | { kind: 'detail'; projectId: string }
  | { kind: 'none' };

function pathSegmentsWithoutGroups(pathname: string): string[] {
  return pathname
    .split('?')[0]
    .split('/')
    .filter((segment) => segment.length > 0 && !segment.startsWith('('));
}

export function parseProjectsRoute(pathname: string): ProjectsRoute {
  const segments = pathSegmentsWithoutGroups(pathname);
  const projectsIndex = segments.indexOf('projects');
  if (projectsIndex === -1) {
    return { kind: 'none' };
  }

  const rest = segments.slice(projectsIndex + 1);
  if (rest.length === 0) {
    return { kind: 'list' };
  }

  const [first] = rest;
  if (first === 'new') {
    return { kind: 'new' };
  }

  if (first) {
    return { kind: 'detail', projectId: first };
  }

  return { kind: 'list' };
}

export function isProjectsSectionPath(pathname: string): boolean {
  return pathSegmentsWithoutGroups(pathname).includes('projects');
}
