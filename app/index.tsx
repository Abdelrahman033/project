import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Redirect } from 'expo-router';
import { getData, STORAGE_KEYS } from '@/utils/storage';
import SplashScreen from '@/components/SplashScreen';
import { User } from '@/types';

/**
 * Initial loading screen and router
 * Checks authentication status and redirects accordingly
 */
export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Simulate checking authentication status
    const checkAuth = async () => {
      try {
        // In a real app, you would check the actual auth status here
        // const userData = await getData(STORAGE_KEYS.USER);
        // setIsAuthenticated(!!userData);
        
        // For demo purposes, we'll just wait a bit to show the splash screen
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsAuthenticated(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/(auth)/login" />;
  }
}