import { usePathname, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import React, { PropsWithChildren, useMemo, useState } from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PageTopbar } from '@/components/page-topbar';
import { SidebarNav } from '@/components/sidebar-nav';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useAppState } from '@/providers/app-state-provider';

type TopbarMeta = {
  title: string;
  icon: React.ComponentProps<typeof SymbolView>['name'];
  actionLabel?: string;
  actionIcon?: React.ComponentProps<typeof SymbolView>['name'];
};

function getTopbarMeta(pathname: string, getProject: (projectId: string) => { name: string } | undefined): TopbarMeta {
  if (pathname === '/projects/new') {
    return {
      title: 'Create new project',
      icon: { ios: 'folder.badge.plus', android: 'create_new_folder', web: 'create_new_folder' },
    };
  }

  if (pathname === '/projects') {
    return {
      title: 'Projects',
      icon: { ios: 'folder', android: 'folder', web: 'folder' },
      actionLabel: 'New project',
      actionIcon: { ios: 'plus', android: 'add', web: 'add' },
    };
  }

  if (pathname.startsWith('/projects/')) {
    const projectId = pathname.replace('/projects/', '');
    const project = getProject(projectId);
    if (project) {
      return {
        title: project.name,
        icon: { ios: 'checkmark.square', android: 'check_box', web: 'check_box' },
        actionLabel: 'Add task',
        actionIcon: { ios: 'plus', android: 'add', web: 'add' },
      };
    }

    return {
      title: 'Project',
      icon: { ios: 'checkmark.square', android: 'check_box', web: 'check_box' },
      actionLabel: 'Add task',
      actionIcon: { ios: 'plus', android: 'add', web: 'add' },
    };
  }

  return {
    title: 'Projects',
    icon: { ios: 'folder', android: 'folder', web: 'folder' },
  };
}

export function AppShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { getProject } = useAppState();
  const isWideLayout = width >= 1024;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pageMeta = useMemo(() => getTopbarMeta(pathname, getProject), [getProject, pathname]);

  function onTopbarActionPress() {
    if (pathname === '/projects') {
      router.push('/(app)/projects/new');
      return;
    }

    if (!pathname.startsWith('/projects/')) {
      return;
    }

    const projectId = pathname.replace('/projects/', '');
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
