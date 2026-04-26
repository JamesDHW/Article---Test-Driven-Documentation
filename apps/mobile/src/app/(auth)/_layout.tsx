import { Redirect, Stack } from 'expo-router';
import React from 'react';

import { useAppState } from '@/providers/app-state-provider';

export default function AuthLayout() {
  const { isAuthenticated } = useAppState();
  if (isAuthenticated) {
    return <Redirect href="/(app)/projects" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
