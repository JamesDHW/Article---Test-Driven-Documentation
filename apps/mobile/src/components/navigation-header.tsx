import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

type NavigationHeaderProps = {
  title: string;
  subtitle?: string;
  rightActionLabel?: string;
  onRightActionPress?: () => void;
  leftActionLabel?: string;
  onLeftActionPress?: () => void;
};

export function NavigationHeader({
  title,
  subtitle,
  rightActionLabel,
  onRightActionPress,
  leftActionLabel,
  onLeftActionPress,
}: NavigationHeaderProps) {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.leftActions}>
          {leftActionLabel && onLeftActionPress ? (
            <Pressable onPress={onLeftActionPress} style={({ pressed }) => pressed && styles.pressed}>
              <ThemedText type="linkPrimary">{leftActionLabel}</ThemedText>
            </Pressable>
          ) : null}
        </View>

        {rightActionLabel && onRightActionPress ? (
          <Pressable onPress={onRightActionPress} style={({ pressed }) => pressed && styles.pressed}>
            <ThemedText type="linkPrimary">{rightActionLabel}</ThemedText>
          </Pressable>
        ) : (
          <View style={styles.rightSpacer} />
        )}
      </View>

      <ThemedText type="subtitle" style={styles.title}>
        {title}
      </ThemedText>
      {subtitle ? (
        <ThemedText themeColor="textSecondary" style={styles.subtitle}>
          {subtitle}
        </ThemedText>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.one,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 24,
  },
  leftActions: {
    minWidth: 64,
    alignItems: 'flex-start',
  },
  rightSpacer: {
    width: 64,
  },
  title: {
    fontSize: 30,
    lineHeight: 38,
  },
  subtitle: {
    lineHeight: 20,
  },
  pressed: {
    opacity: 0.7,
  },
});
