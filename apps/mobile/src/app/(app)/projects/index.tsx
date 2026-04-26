import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAppState } from '@/providers/app-state-provider';

function formatDate(date: Date) {
  return date.toLocaleDateString();
}

export default function ProjectsScreen() {
  const theme = useTheme();
  const { getProjectTasks, projects } = useAppState();

  return (
    <ScrollView testID="projects-screen" contentContainerStyle={styles.scrollContent}>
      {projects.length === 0 ? (
        <ThemedText themeColor="textSecondary">No projects yet. Create your first project to get started.</ThemedText>
      ) : (
        <View style={styles.projectsList}>
          {projects.map((project) => (
            <Pressable
              key={project.id}
              onPress={() => router.push(`/(app)/projects/${project.id}`)}
              style={({ pressed }) => pressed && styles.pressed}>
              <ThemedView type="backgroundElement" style={styles.projectCard}>
                <View style={styles.projectTitleRow}>
                  <SymbolView
                    tintColor={theme.text}
                    size={16}
                    name={{ ios: 'folder', android: 'folder', web: 'folder' }}
                  />
                  <ThemedText type="smallBold">{project.name}</ThemedText>
                </View>
                <ThemedText type="small" themeColor="textSecondary">
                  {getProjectTasks(project.id).length} tasks
                </ThemedText>
                <View style={styles.metaRow}>
                  <SymbolView
                    tintColor={theme.textSecondary}
                    size={12}
                    name={{ ios: 'calendar', android: 'date_range', web: 'date_range' }}
                  />
                  <ThemedText type="small" themeColor="textSecondary">
                    Created {formatDate(project.createdAt)}
                  </ThemedText>
                </View>
              </ThemedView>
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    gap: Spacing.three,
    paddingBottom: Spacing.four,
  },
  projectsList: {
    gap: Spacing.two,
  },
  projectCard: {
    borderRadius: Spacing.three,
    borderWidth: 1,
    borderColor: '#27272a',
    padding: Spacing.three,
    gap: Spacing.one,
  },
  projectTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  pressed: {
    opacity: 0.7,
  },
});
