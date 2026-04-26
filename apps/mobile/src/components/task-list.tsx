import { SymbolView } from 'expo-symbols';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Task } from '@/lib/mobile-store';

type TaskListProps = {
  tasks: Task[];
};

function formatDate(date: Date) {
  return date.toLocaleDateString();
}

export function TaskList({ tasks }: TaskListProps) {
  const theme = useTheme();

  if (tasks.length === 0) {
    return (
      <ThemedView type="backgroundElement" style={styles.emptyState}>
        <ThemedText themeColor="textSecondary">No tasks yet. Add your first task.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <View style={styles.list}>
      {tasks.map((task) => (
        <ThemedView key={task.id} type="backgroundElement" style={styles.card}>
          <View style={styles.headerRow}>
            <View style={styles.titleRow}>
              <SymbolView
                tintColor={theme.text}
                size={16}
                name={{ ios: 'checkmark.square', android: 'check_box', web: 'check_box' }}
              />
              <ThemedText type="smallBold">{task.name}</ThemedText>
            </View>

            <View style={styles.metaRow}>
              <SymbolView
                tintColor={theme.textSecondary}
                size={12}
                name={{ ios: 'calendar', android: 'date_range', web: 'date_range' }}
              />
              <ThemedText type="small" themeColor="textSecondary">
                {formatDate(task.createdAt)}
              </ThemedText>
            </View>
          </View>

          {task.assignedTo ? (
            <View style={styles.metaRow}>
              <SymbolView
                tintColor={theme.textSecondary}
                size={12}
                name={{ ios: 'person', android: 'person', web: 'person' }}
              />
              <ThemedText type="small" themeColor="textSecondary">
                {task.assignedTo}
              </ThemedText>
            </View>
          ) : null}
        </ThemedView>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    borderRadius: Spacing.three,
    borderWidth: 1,
    borderColor: '#27272a',
    padding: Spacing.three,
  },
  list: {
    gap: Spacing.two,
  },
  card: {
    borderRadius: Spacing.three,
    borderWidth: 1,
    borderColor: '#27272a',
    padding: Spacing.three,
    gap: Spacing.one,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
});
