/**
 * Typography system for the Soil Pulse app
 * Clean, modern, and highly readable fonts
 */

import { TextStyle } from 'react-native';

export const fontFamily = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  bold: 'Inter-Bold',
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 40,
};

export const lineHeight = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 30,
  xxl: 32,
  xxxl: 40,
  display: 48,
};

export const fontWeight = {
  regular: '400',
  medium: '500',
  bold: '700',
};

export const typography: Record<string, TextStyle> = {
  // Headings
  h1: {
    fontFamily: fontFamily.bold,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily: fontFamily.bold,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  h3: {
    fontFamily: fontFamily.bold,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600',
    letterSpacing: -0.25,
  },
  h4: {
    fontFamily: fontFamily.bold,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
    letterSpacing: -0.25,
  },
  h5: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    letterSpacing: -0.25,
  },
  h6: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    letterSpacing: -0.25,
  },

  // Body text
  body1: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    letterSpacing: 0.15,
  },
  body2: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    letterSpacing: 0.25,
  },
  body3: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    letterSpacing: 0.4,
  },

  // Buttons and interactive elements
  button: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  buttonSmall: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  // Labels and captions
  label: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  labelSmall: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    letterSpacing: 0.4,
  },

  // Special text styles
  overline: {
    fontFamily: fontFamily.bold,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  subtitle1: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    letterSpacing: 0.15,
  },
  subtitle2: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
};