/**
 * Spacing system for the SoilSense AI app
 * Based on 8px grid
 */

export const spacing = {
  none: 0,
  xxs: 2,   // 2px
  xs: 4,    // 4px
  sm: 8,    // 8px
  md: 16,   // 16px
  lg: 24,   // 24px
  xl: 32,   // 32px
  xxl: 48,  // 48px
  xxxl: 64, // 64px
};

// Helper function to get spacing value
export const getSpacing = (multiplier: number) => {
  return multiplier * 8;
};