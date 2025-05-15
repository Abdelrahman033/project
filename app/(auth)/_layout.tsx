import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '@/theme';
import { Platform } from 'react-native';

function Auth() {
  return (
    <Stack 
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.white },
        animation: Platform.select({
          ios: 'default',
          android: 'slide_from_right',
        }),
        animationDuration: 200,
        presentation: 'card',
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        fullScreenGestureEnabled: true,
      }}
    >
      <Stack.Screen 
        name="login" 
        options={{
          animation: 'fade',
          animationDuration: 300,
        }}
      />
      <Stack.Screen 
        name="register" 
        options={{
          animation: 'slide_from_right',
          animationDuration: 250,
        }}
      />
      <Stack.Screen 
        name="forgot-password" 
        options={{
          animation: 'slide_from_right',
          animationDuration: 250,
        }}
      />
    </Stack>
  );
}

export default Auth;