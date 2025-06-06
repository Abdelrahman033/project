import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import { Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import { SplashScreen } from 'expo-router';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserProvider } from '@/contexts/UserContext';
import { Platform } from 'react-native';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-Bold': Inter_700Bold,
  });

  // Hide splash screen once fonts are loaded or if there's an error
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Return null to keep splash screen visible while fonts load
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <UserProvider>
      <AuthProvider>
        <Stack 
          screenOptions={{
            headerShown: false,
            animation: Platform.select({
              ios: 'default',
              android: 'slide_from_right',
            }),
            animationDuration: 200,
            presentation: 'card',
            contentStyle: { backgroundColor: 'white' },
            gestureEnabled: true,
            gestureDirection: 'horizontal',
            fullScreenGestureEnabled: true,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen 
            name="(auth)" 
            options={{ 
              animation: 'fade',
              animationDuration: 300,
            }} 
          />
          <Stack.Screen 
            name="(tabs)" 
            options={{ 
              animation: 'fade_from_bottom',
              animationDuration: 300,
            }} 
          />
          <Stack.Screen 
            name="+not-found" 
            options={{ 
              presentation: 'modal',
              animation: 'slide_from_bottom',
              animationDuration: 250,
            }} 
          />
        </Stack>
        <StatusBar style="auto" />
      </AuthProvider>
    </UserProvider>
  );
}