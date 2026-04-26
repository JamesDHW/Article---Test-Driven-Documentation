import { Redirect, Stack } from 'expo-router';
import React from 'react';

import { AppShell } from '@/components/app-shell';
import { useAppState } from '@/providers/app-state-provider';

export default function AppLayout() {
  const { isAuthenticated } = useAppState();
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <AppShell>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }} />
    </AppShell>
  );
}
