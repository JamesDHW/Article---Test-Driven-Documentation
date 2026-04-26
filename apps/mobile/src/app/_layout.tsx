import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AppStateProvider } from '@/providers/app-state-provider';

export default function RootLayout() {
  const [splashComplete, setSplashComplete] = useState(false);

  return (
    <ThemeProvider value={DarkTheme}>
      <AppStateProvider>
        <AnimatedSplashOverlay onSplashComplete={() => setSplashComplete(true)} />
        <Stack screenOptions={{ headerShown: false }} />
        {splashComplete ? (
          <View
            testID="auth-loaded"
            pointerEvents="none"
            collapsable={false}
            accessible
            accessibilityLabel="App ready"
            style={{
              position: 'absolute',
              width: 2,
              height: 2,
              left: 0,
              top: 0,
              backgroundColor: 'transparent',
            }}
          />
        ) : null}
      </AppStateProvider>
    </ThemeProvider>
  );
}
