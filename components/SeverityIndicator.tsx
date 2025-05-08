/**
 * SeverityIndicator component for the SoilSense AI app
 * Displays a visual indicator of soil health or disease severity
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SoilHealth } from '../types';
import { colors, spacing, typography } from '../theme';

interface SeverityIndicatorProps {
  level: number; // 0-5 severity
  type?: 'horizontal' | 'circular';
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  soilHealth?: SoilHealth;
}

export const SeverityIndicator = ({
  level,
  type = 'horizontal',
  size = 'medium',
  showLabel = true,
  soilHealth,
}: SeverityIndicatorProps) => {
  // Ensure level is between 0 and 5
  const normalizedLevel = Math.max(0, Math.min(5, level));
  
  // Get color based on severity level
  const getColor = () => {
    if (normalizedLevel <= 1) return colors.success[500];
    if (normalizedLevel <= 2) return colors.success[300];
    if (normalizedLevel <= 3) return colors.warning[400];
    if (normalizedLevel <= 4) return colors.warning[600];
    return colors.error[500];
  };
  
  // Get label based on severity level or soil health
  const getLabel = () => {
    if (soilHealth) {
      return soilHealth.charAt(0).toUpperCase() + soilHealth.slice(1);
    }
    
    if (normalizedLevel <= 1) return 'Minimal';
    if (normalizedLevel <= 2) return 'Low';
    if (normalizedLevel <= 3) return 'Moderate';
    if (normalizedLevel <= 4) return 'High';
    return 'Severe';
  };
  
  // Get dimensions based on size
  const getDimensions = () => {
    switch (size) {
      case 'small':
        return { width: 100, height: 6, dotSize: 15 };
      case 'large':
        return { width: 200, height: 10, dotSize: 25 };
      default: // medium
        return { width: 150, height: 8, dotSize: 20 };
    }
  };
  
  const dimensions = getDimensions();
  const color = getColor();
  
  // For horizontal indicator
  if (type === 'horizontal') {
    return (
      <View style={styles.container}>
        <View style={[styles.track, { width: dimensions.width, height: dimensions.height }]}>
          <View 
            style={[
              styles.fill, 
              { 
                width: `${(normalizedLevel / 5) * 100}%`, 
                height: dimensions.height,
                backgroundColor: color 
              }
            ]} 
          />
        </View>
        {showLabel && (
          <Text 
            style={[
              styles.label, 
              { color: color, marginTop: spacing.xs }
            ]}
          >
            {getLabel()}
          </Text>
        )}
      </View>
    );
  }
  
  // For circular indicator
  return (
    <View style={styles.circularContainer}>
      <View 
        style={[
          styles.circularIndicator, 
          { 
            width: dimensions.dotSize, 
            height: dimensions.dotSize,
            backgroundColor: color,
          }
        ]} 
      />
      {showLabel && (
        <Text 
          style={[
            styles.label, 
            { color: color, marginTop: spacing.xs }
          ]}
        >
          {getLabel()}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  track: {
    backgroundColor: colors.neutral[200],
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 4,
  },
  label: {
    ...typography.labelMedium,
  },
  circularContainer: {
    alignItems: 'center',
  },
  circularIndicator: {
    borderRadius: 50,
  },
});