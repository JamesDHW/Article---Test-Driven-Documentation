import { Redirect } from 'expo-router';
import React from 'react';

import { useAppState } from '@/providers/app-state-provider';

export default function IndexScreen() {
  const { isAuthenticated } = useAppState();
  const href = isAuthenticated ? '/(app)/projects' : '/(auth)/login';

  return <Redirect href={href} />;
}
