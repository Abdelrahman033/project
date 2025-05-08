/**
 * Button component for the SoilSense AI app
 */

import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import { colors, spacing, typography } from '../theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
}

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  accessibilityLabel,
}: ButtonProps) => {
  const getButtonStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      borderRadius: spacing.md,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: iconPosition === 'left' ? 'row' : 'row-reverse',
    };

    // Add size-specific styles
    switch (size) {
      case 'small':
        baseStyles.paddingVertical = spacing.xs;
        baseStyles.paddingHorizontal = spacing.md;
        baseStyles.minHeight = 32;
        break;
      case 'large':
        baseStyles.paddingVertical = spacing.md;
        baseStyles.paddingHorizontal = spacing.xl;
        baseStyles.minHeight = 56;
        break;
      default: // medium
        baseStyles.paddingVertical = spacing.sm;
        baseStyles.paddingHorizontal = spacing.lg;
        baseStyles.minHeight = 48;
    }

    // Add variant-specific styles
    switch (variant) {
      case 'secondary':
        baseStyles.backgroundColor = colors.accent[500];
        break;
      case 'outline':
        baseStyles.backgroundColor = colors.transparent;
        baseStyles.borderWidth = 2;
        baseStyles.borderColor = colors.primary[500];
        break;
      case 'ghost':
        baseStyles.backgroundColor = colors.transparent;
        break;
      default: // primary
        baseStyles.backgroundColor = colors.primary[500];
    }

    // Add disabled styles
    if (disabled || loading) {
      baseStyles.opacity = 0.6;
    }

    return baseStyles;
  };

  const getTextStyles = (): TextStyle => {
    const baseStyles: TextStyle = {
      ...typography.labelLarge,
    };

    switch (size) {
      case 'small':
        baseStyles.fontSize = typography.labelMedium.fontSize;
        break;
      case 'large':
        baseStyles.fontSize = typography.headingSmall.fontSize;
        break;
    }

    switch (variant) {
      case 'outline':
      case 'ghost':
        baseStyles.color = colors.primary[500];
        break;
      default: // primary, secondary
        baseStyles.color = colors.white;
    }

    return baseStyles;
  };

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyles(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? colors.primary[500] : colors.white}
          size="small"
        />
      ) : (
        <>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={[styles.text, getTextStyles(), textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary[500],
    borderRadius: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  text: {
    textAlign: 'center',
  },
  iconContainer: {
    marginRight: spacing.sm,
  },
});