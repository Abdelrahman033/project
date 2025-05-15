import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/theme';
import { Leaf } from 'lucide-react-native';

interface LogoProps {
  size?: number;
  color?: string;
}

export function Logo({ size = 48, color = colors.primary[500] }: LogoProps) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Leaf size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 