import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import React from 'react';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AppStateProvider } from '@/providers/app-state-provider';

export default function RootLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <AppStateProvider>
        <AnimatedSplashOverlay />
        <Stack screenOptions={{ headerShown: false }} />
      </AppStateProvider>
    </ThemeProvider>
  );
}
