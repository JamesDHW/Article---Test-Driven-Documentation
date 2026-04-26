import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { TaskList } from '@/components/task-list';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAppState } from '@/providers/app-state-provider';

export default function ProjectDetailsScreen() {
  const theme = useTheme();
  const { id, newTask } = useLocalSearchParams<{ id: string; newTask?: string }>();
  const { assignees, createTaskForProject, getProject, getProjectTasks } = useAppState();
  const projectId = typeof id === 'string' ? id : '';
  const showTaskForm = newTask === '1';
  const [taskName, setTaskName] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('');

  if (!projectId) {
    return <Redirect href="/(app)/projects" />;
  }

  const project = getProject(projectId);
  if (!project) {
    return <Redirect href="/(app)/projects" />;
  }

  const tasks = getProjectTasks(project.id);

  function onSubmitTask() {
    const trimmedTaskName = taskName.trim();
    if (!trimmedTaskName) {
      return;
    }

    const assignedTo = selectedAssignee || undefined;
    createTaskForProject(projectId, trimmedTaskName, assignedTo);
    setTaskName('');
    setSelectedAssignee('');
    router.replace(`/(app)/projects/${projectId}`);
  }

  function onCancelTaskCreation() {
    setTaskName('');
    setSelectedAssignee('');
    router.replace(`/(app)/projects/${projectId}`);
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.metaRow}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.backRow, pressed && styles.pressed]}>
          <SymbolView
            tintColor={theme.textSecondary}
            size={14}
            name={{ ios: 'arrow.left', android: 'arrow_back', web: 'arrow_back' }}
          />
          <ThemedText themeColor="textSecondary">Back to projects</ThemedText>
        </Pressable>

        <View style={styles.metaRowContent}>

          <SymbolView
            tintColor={theme.textSecondary}
            size={12}
            name={{ ios: 'calendar', android: 'date_range', web: 'date_range' }}
          />
          <ThemedText type="small" themeColor="textSecondary">
            Created {project.createdAt.toLocaleDateString()}
          </ThemedText>
        </View>
      </View>

      {showTaskForm ? (
        <ThemedView type="backgroundElement" style={styles.formCard}>
          <View style={styles.fieldGroup}>
            <ThemedText>Task name</ThemedText>
            <TextInput
              value={taskName}
              onChangeText={setTaskName}
              placeholder="Task name"
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { borderColor: theme.backgroundSelected, color: theme.text }]}
              onSubmitEditing={onSubmitTask}
            />
          </View>

          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <SymbolView
                tintColor={theme.textSecondary}
                size={14}
                name={{ ios: 'person', android: 'person', web: 'person' }}
              />
              <ThemedText>Assign to (optional)</ThemedText>
            </View>
            <View style={styles.assigneeRow}>
              <Pressable
                onPress={() => setSelectedAssignee('')}
                style={({ pressed }) => [
                  styles.assigneePill,
                  selectedAssignee === '' && styles.assigneePillSelected,
                  pressed && styles.pressed,
                ]}>
                <ThemedText type="small">Unassigned</ThemedText>
              </Pressable>

              {assignees.map((assignee) => (
                <Pressable
                  key={assignee}
                  onPress={() => setSelectedAssignee(assignee)}
                  style={({ pressed }) => [
                    styles.assigneePill,
                    selectedAssignee === assignee && styles.assigneePillSelected,
                    pressed && styles.pressed,
                  ]}>
                  <ThemedText type="small">{assignee}</ThemedText>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.formActions}>
            <Pressable
              onPress={onSubmitTask}
              style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
              <SymbolView tintColor="#111111" size={16} name={{ ios: 'plus', android: 'add', web: 'add' }} />
              <ThemedText type="smallBold" style={styles.primaryButtonText}>
                Add task
              </ThemedText>
            </Pressable>
            <Pressable
              onPress={onCancelTaskCreation}
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
              <SymbolView tintColor={theme.text} size={16} name={{ ios: 'xmark', android: 'close', web: 'close' }} />
              <ThemedText type="smallBold">Cancel</ThemedText>
            </Pressable>
          </View>
        </ThemedView>
      ) : null}

      <TaskList tasks={tasks} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Spacing.three,
    paddingBottom: Spacing.four,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    alignSelf: 'flex-start',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  formCard: {
    borderRadius: Spacing.three,
    borderWidth: 1,
    borderColor: '#27272a',
    padding: Spacing.three,
    gap: Spacing.two,
  },
  fieldGroup: {
    gap: Spacing.one,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    fontSize: 16,
    backgroundColor: '#18181b',
  },
  assigneeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
  },
  assigneePill: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    borderRadius: Spacing.two,
    borderWidth: 1,
    borderColor: '#3f3f46',
    backgroundColor: '#111111',
  },
  assigneePillSelected: {
    backgroundColor: '#27272a',
    borderColor: '#fafafa',
  },
  formActions: {
    flexDirection: 'row',
    gap: Spacing.two,
    flexWrap: 'wrap',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#fafafa',
  },
  primaryButtonText: {
    color: '#111111',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    borderWidth: 1,
    borderColor: '#3f3f46',
    backgroundColor: '#111111',
  },
  pressed: {
    opacity: 0.7,
  },
});
