import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAppState } from '@/providers/app-state-provider';

export default function NewProjectScreen() {
  const theme = useTheme();
  const { createProjectWithName } = useAppState();
  const [name, setName] = useState('');

  function onCancel() {
    router.back();
  }

  function onSubmit() {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return;
    }

    const createdProject = createProjectWithName(trimmedName);
    router.replace(`/(app)/projects/${createdProject.id}`);
  }

  return (
    <View style={styles.content}>
      <View style={styles.fieldGroup}>
        <ThemedText>Project name</ThemedText>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Project name"
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { borderColor: theme.backgroundSelected, color: theme.text }]}
          onSubmitEditing={onSubmit}
        />
      </View>

      <View style={styles.actionsRow}>
        <Pressable onPress={onSubmit} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
          <SymbolView tintColor="#111111" size={16} name={{ ios: 'plus', android: 'add', web: 'add' }} />
          <ThemedText type="smallBold" style={styles.primaryButtonText}>
            Create project
          </ThemedText>
        </Pressable>
        <Pressable onPress={onCancel} style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
          <SymbolView tintColor={theme.text} size={16} name={{ ios: 'xmark', android: 'close', web: 'close' }} />
          <ThemedText type="smallBold">Cancel</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Spacing.three,
  },
  fieldGroup: {
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
  actionsRow: {
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
