import { SymbolView } from 'expo-symbols';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type PageTopbarProps = {
  title: string;
  icon: React.ComponentProps<typeof SymbolView>['name'];
  showMenuButton: boolean;
  onMenuPress: () => void;
  actionLabel?: string;
  actionIcon?: React.ComponentProps<typeof SymbolView>['name'];
  onActionPress?: () => void;
};

export function PageTopbar({
  title,
  icon,
  showMenuButton,
  onMenuPress,
  actionLabel,
  actionIcon,
  onActionPress,
}: PageTopbarProps) {
  const theme = useTheme();

  return (
    <ThemedView type="backgroundElement" style={styles.container}>
      <View style={styles.row}>
        <View style={styles.left}>
          {showMenuButton ? (
            <Pressable onPress={onMenuPress} style={({ pressed }) => [styles.menuButton, pressed && styles.pressed]}>
              <SymbolView
                tintColor={theme.text}
                size={18}
                name={{ ios: 'line.3.horizontal', android: 'menu', web: 'menu' }}
              />
            </Pressable>
          ) : null}
          <SymbolView
            tintColor={theme.text}
            size={22}
            name={icon}
          />
          <ThemedText type="smallBold" style={styles.title}>
            {title}
          </ThemedText>
        </View>

        {actionLabel && actionIcon && onActionPress ? (
          <Pressable onPress={onActionPress} style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}>
            <SymbolView tintColor="#111111" size={14} name={actionIcon} />
            <ThemedText type="smallBold" style={styles.actionText}>
              {actionLabel}
            </ThemedText>
          </Pressable>
        ) : null}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  menuButton: {
    padding: Spacing.one,
    borderRadius: Spacing.one,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.two,
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#fafafa',
  },
  actionText: {
    color: '#111111',
  },
  pressed: {
    opacity: 0.7,
  },
});
