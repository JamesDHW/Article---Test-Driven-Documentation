import { useGlobalSearchParams, usePathname, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import React, { PropsWithChildren, useMemo, useState } from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PageTopbar } from '@/components/page-topbar';
import { SidebarNav } from '@/components/sidebar-nav';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { type ProjectsRoute, parseProjectsRoute } from '@/lib/projects-path';
import { useAppState } from '@/providers/app-state-provider';

type TopbarMeta = {
  title: string;
  icon: React.ComponentProps<typeof SymbolView>['name'];
  actionLabel?: string;
  actionIcon?: React.ComponentProps<typeof SymbolView>['name'];
  actionTestId?: string;
};

function getTopbarMeta(
  route: ProjectsRoute,
  getProject: (projectId: string) => { name: string } | undefined,
  isNewTaskFormOpen: boolean,
): TopbarMeta {
  if (route.kind === 'new') {
    return {
      title: 'Create new project',
      icon: { ios: 'folder.badge.plus', android: 'create_new_folder', web: 'create_new_folder' },
    };
  }

  if (route.kind === 'list') {
    return {
      title: 'Projects',
      icon: { ios: 'folder', android: 'folder', web: 'folder' },
      actionLabel: 'New project',
      actionIcon: { ios: 'plus', android: 'add', web: 'add' },
      actionTestId: 'topbar-new-project',
    };
  }

  if (route.kind === 'detail') {
    const { projectId } = route;
    const project = getProject(projectId);
    const title = project ? project.name : 'Project';
    const detailIcon = { ios: 'checkmark.square' as const, android: 'check_box' as const, web: 'check_box' as const };

    if (isNewTaskFormOpen) {
      return {
        title,
        icon: detailIcon,
      };
    }

    return {
      title,
      icon: detailIcon,
      actionLabel: 'Add task',
      actionIcon: { ios: 'plus', android: 'add', web: 'add' },
      actionTestId: 'topbar-add-task',
    };
  }

  return {
    title: 'Projects',
    icon: { ios: 'folder', android: 'folder', web: 'folder' },
  };
}

function readNewTaskParam(params: ReturnType<typeof useGlobalSearchParams>): string | undefined {
  const raw = params.newTask;
  if (typeof raw === 'string') {
    return raw;
  }
  if (Array.isArray(raw) && raw.length > 0 && typeof raw[0] === 'string') {
    return raw[0];
  }
  return undefined;
}

export function AppShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const globalParams = useGlobalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { getProject } = useAppState();
  const isWideLayout = width >= 1024;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const projectsRoute = useMemo(() => parseProjectsRoute(pathname), [pathname]);
  const newTaskParam = readNewTaskParam(globalParams);
  const isNewTaskFormOpen = projectsRoute.kind === 'detail' && newTaskParam === '1';
  const pageMeta = useMemo(
    () => getTopbarMeta(projectsRoute, getProject, isNewTaskFormOpen),
    [getProject, isNewTaskFormOpen, projectsRoute],
  );

  function onTopbarActionPress() {
    if (projectsRoute.kind === 'list') {
      router.push('/(app)/projects/new');
      return;
    }

    if (projectsRoute.kind !== 'detail') {
      return;
    }

    const { projectId } = projectsRoute;
    router.push({
      pathname: '/(app)/projects/[id]',
      params: {
        id: projectId,
        newTask: '1',
      },
    });
  }

  return (
    <ThemedView style={styles.page}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.row}>
          {isWideLayout ? (
            <View style={styles.persistentSidebar}>
              <SidebarNav />
            </View>
          ) : null}

          <View style={styles.main}>
            <PageTopbar
              title={pageMeta.title}
              icon={pageMeta.icon}
              showMenuButton={!isWideLayout}
              onMenuPress={() => setSidebarOpen(true)}
              actionLabel={pageMeta.actionLabel}
              actionIcon={pageMeta.actionIcon}
              actionTestId={pageMeta.actionTestId}
              onActionPress={pageMeta.actionLabel ? onTopbarActionPress : undefined}
            />
            <View style={styles.content}>{children}</View>
          </View>
        </View>
      </SafeAreaView>

      {!isWideLayout && sidebarOpen ? (
        <View style={styles.overlayRoot}>
          <View style={styles.overlaySidebar}>
            <SidebarNav onItemPress={() => setSidebarOpen(false)} />
          </View>
          <Pressable style={styles.overlayBackdrop} onPress={() => setSidebarOpen(false)} />
        </View>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  persistentSidebar: {
    width: 280,
  },
  main: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  overlayRoot: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    flexDirection: 'row',
  },
  overlayBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  overlaySidebar: {
    width: 280,
  },
});
