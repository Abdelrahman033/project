import React from 'react';
import { Redirect } from 'expo-router';
import SplashScreen from '@/components/SplashScreen';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Initial loading screen and router
 * Checks authentication status and redirects accordingly
 */
export default function Index() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <SplashScreen />;
  }

  if (user) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/(auth)/login" />;
  }
}