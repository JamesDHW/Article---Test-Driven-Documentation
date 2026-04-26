import { router, usePathname } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import React from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAppState } from '@/providers/app-state-provider';

type SidebarNavProps = {
  onItemPress?: () => void;
};

export function SidebarNav({ onItemPress }: SidebarNavProps) {
  const theme = useTheme();
  const pathname = usePathname();
  const { currentUser, logoutCurrentUser } = useAppState();
  const projectsActive = pathname.startsWith('/projects');

  function closeSidebarIfNeeded() {
    if (!onItemPress) {
      return;
    }

    onItemPress();
  }

  function onOpenProjects() {
    closeSidebarIfNeeded();
    router.replace('/(app)/projects');
  }

  function onOpenDocumentation() {
    closeSidebarIfNeeded();
    Linking.openURL('https://docs.expo.dev');
  }

  function onLogout() {
    closeSidebarIfNeeded();
    logoutCurrentUser();
    router.replace('/(auth)/login');
  }

  return (
    <ThemedView type="backgroundElement" style={styles.container}>
      <View style={styles.brand}>
        <ThemedText style={styles.brandEmoji}>🌊</ThemedText>
        <ThemedText type="smallBold" style={styles.brandText}>
          Projects
        </ThemedText>
      </View>

      <Pressable
        onPress={onOpenProjects}
        style={({ pressed }) => [styles.item, projectsActive && styles.itemActive, pressed && styles.pressed]}>
        <SymbolView
          tintColor={theme.text}
          size={16}
          name={{ ios: 'folder', android: 'folder', web: 'folder' }}
        />
        <ThemedText type="small">Projects</ThemedText>
      </Pressable>

      <View style={styles.divider} />

      <View style={styles.userRow}>
        <SymbolView
          tintColor={theme.textSecondary}
          size={14}
          name={{ ios: 'envelope', android: 'mail', web: 'mail' }}
        />
        <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
          {currentUser ?? 'Not signed in'}
        </ThemedText>
      </View>

      <Pressable onPress={onOpenDocumentation} style={({ pressed }) => [styles.item, pressed && styles.pressed]}>
        <SymbolView
          tintColor={theme.text}
          size={16}
          name={{ ios: 'book', android: 'menu_book', web: 'book' }}
        />
        <ThemedText type="small">Documentation</ThemedText>
      </Pressable>

      <Pressable onPress={onLogout} style={({ pressed }) => [styles.item, pressed && styles.pressed]}>
        <SymbolView
          tintColor={theme.text}
          size={16}
          name={{ ios: 'rectangle.portrait.and.arrow.right', android: 'logout', web: 'logout' }}
        />
        <ThemedText type="small">Logout</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#262626',
    padding: Spacing.three,
    gap: Spacing.two,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    marginBottom: Spacing.two,
  },
  brandEmoji: {
    fontSize: 22,
    lineHeight: 24,
  },
  brandText: {
    fontSize: 24,
    lineHeight: 30,
  },
  item: {
    borderRadius: Spacing.two,
    borderWidth: 1,
    borderColor: '#3f3f46',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  itemActive: {
    borderColor: '#f5f5f5',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    marginBottom: Spacing.one,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
    marginVertical: Spacing.one,
  },
  pressed: {
    opacity: 0.7,
  },
});
