import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '@/theme';

function Auth() {
  return (
    <Stack 
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.white },
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}

export default Auth;