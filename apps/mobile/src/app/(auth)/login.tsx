import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAppState } from '@/providers/app-state-provider';

export default function LoginScreen() {
  const theme = useTheme();
  const { loginWithEmail } = useAppState();
  const [email, setEmail] = useState('');

  function onSubmit() {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      return;
    }

    loginWithEmail(trimmedEmail);
    router.replace('/(app)/projects');
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.card}>
          <View style={styles.titleRow}>
            <SymbolView
              tintColor={theme.text}
              size={20}
              name={{ ios: 'rectangle.portrait.and.arrow.right', android: 'login', web: 'login' }}
            />
            <ThemedText type="subtitle" style={styles.title}>
              Sign in
            </ThemedText>
          </View>

          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <SymbolView
                tintColor={theme.textSecondary}
                size={14}
                name={{ ios: 'envelope', android: 'mail', web: 'mail' }}
              />
              <ThemedText themeColor="textSecondary">Email</ThemedText>
            </View>

            <TextInput
              testID="login-email-input"
              accessibilityLabel="Email"
              value={email}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { borderColor: theme.backgroundSelected, color: theme.text }]}
              onSubmitEditing={onSubmit}
            />
          </View>

          <Pressable
            testID="login-sign-in-button"
            accessibilityRole="button"
            accessibilityLabel="Sign in"
            accessible
            onPress={onSubmit}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
            <SymbolView
              tintColor="#111111"
              size={16}
              name={{ ios: 'rectangle.portrait.and.arrow.right', android: 'login', web: 'login' }}
            />
            <ThemedText importantForAccessibility="no-hide-descendants" type="smallBold" style={styles.primaryButtonText}>
              Sign in
            </ThemedText>
          </Pressable>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
  },
  safeArea: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    justifyContent: 'center',
  },
  card: {
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: Spacing.three,
    backgroundColor: '#111111',
    padding: Spacing.four,
    gap: Spacing.three,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  title: {
    fontSize: 22,
    lineHeight: 48,
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
  primaryButton: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    backgroundColor: '#fafafa',
  },
  primaryButtonText: {
    color: '#111111',
  },
  pressed: {
    opacity: 0.7,
  },
});
