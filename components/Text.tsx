import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { colors, typography } from '@/theme';

interface TextProps extends RNTextProps {
  variant?: keyof typeof typography;
  color?: string;
}

export function Text({ 
  style, 
  variant = 'body1', 
  color = colors.neutral[900],
  ...props 
}: TextProps) {
  return (
    <RNText
      style={[
        typography[variant],
        { color },
        style,
      ]}
      {...props}
    />
  );
} 