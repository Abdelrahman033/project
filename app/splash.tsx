import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming,
  withSpring,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { colors } from '@/theme';
import { Text } from '@/components/Text';
import { Logo } from '@/components/Logo';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  
  // Animation values
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const shadowOpacity = useSharedValue(0);

  useEffect(() => {
    // Start animations
    scale.value = withSpring(1, {
      damping: 12,
      stiffness: 100,
    });
    
    opacity.value = withTiming(1, {
      duration: 1000,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });

    shadowOpacity.value = withTiming(0.3, {
      duration: 1500,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });

    // Navigate after delay
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Animated styles
  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const shadowStyle = useAnimatedStyle(() => ({
    opacity: shadowOpacity.value,
    transform: [
      { scale: interpolate(scale.value, [0.8, 1], [0.9, 1.1]) }
    ],
  }));

  return (
    <View style={styles.container}>
      {/* Background glow effect */}
      <Animated.View style={[styles.glow, shadowStyle]} />
      
      {/* Logo and text */}
      <Animated.View style={[styles.content, logoStyle]}>
        <Logo size={120} />
        <Text style={styles.title}>Soil Pulse</Text>
        <Text style={styles.subtitle}>Smart Soil Monitoring</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: colors.primary[500],
    opacity: 0.1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.neutral[900],
    marginTop: 20,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: colors.neutral[600],
    marginTop: 8,
    letterSpacing: 0.5,
  },
}); 