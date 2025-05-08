import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import { colors, spacing, typography } from '@/theme';

export default function SplashScreen() {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 2,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.title}>Soil Pulse</Text>
        <Text style={styles.slogan}>Scan the soil, act on time</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    ...typography.displayMedium,
    color: colors.primary[500],
    marginBottom: spacing.xs,
  },
  slogan: {
    ...typography.bodyLarge,
    color: colors.primary[600],
    fontStyle: 'italic',
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.bodyLarge,
    color: colors.neutral[600],
  },
}); 