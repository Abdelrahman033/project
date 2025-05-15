/**
 * Spacing system for the Soil Pulse app
 * Based on an 8px grid for consistent spacing
 */

export const spacing = {
  // Base spacing units
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,

  // Layout spacing
  container: {
    padding: 16,
    margin: 16,
  },
  section: {
    marginVertical: 24,
  },
  card: {
    padding: 16,
    marginVertical: 8,
  },

  // Component spacing
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  input: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  list: {
    itemSpacing: 8,
    sectionSpacing: 24,
  },

  // Icon spacing
  icon: {
    small: 16,
    medium: 24,
    large: 32,
  },

  // Text spacing
  text: {
    lineHeight: 1.5,
    paragraphSpacing: 16,
  },

  // Border radius
  radius: {
    small: 4,
    medium: 8,
    large: 12,
    xl: 16,
    round: 9999,
  },
};

// Helper function to get spacing value
export const getSpacing = (multiplier: number) => {
  return multiplier * 8;
};