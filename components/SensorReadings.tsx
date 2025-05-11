import React from 'react';
import { StyleSheet, View, Text, useWindowDimensions } from 'react-native';
import { CircularProgress } from 'react-native-circular-progress';
import { colors, spacing, typography } from '@/theme';

interface SensorReadingsProps {
  soilMoisture: number;
  airHumidity: number;
}

export function SensorReadings({ soilMoisture, airHumidity }: SensorReadingsProps) {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 360;
  const circleSize = isSmallScreen ? 120 : 140;
  const strokeWidth = 8;

  return (
    <View style={[
      styles.container,
      isSmallScreen ? styles.containerSmall : styles.containerLarge
    ]}>
      <View style={styles.readingContainer}>
        <CircularProgress
          size={circleSize}
          width={strokeWidth}
          fill={soilMoisture}
          tintColor={colors.primary[500]}
          backgroundColor={colors.primary[100]}
          rotation={0}
          lineCap="round"
        >
          {() => (
            <View style={styles.valueContainer}>
              <Text style={styles.value}>{Math.round(soilMoisture)}%</Text>
              <Text style={styles.label}>Soil Moisture</Text>
            </View>
          )}
        </CircularProgress>
      </View>

      <View style={styles.readingContainer}>
        <CircularProgress
          size={circleSize}
          width={strokeWidth}
          fill={airHumidity}
          tintColor={colors.success[500]}
          backgroundColor={colors.success[100]}
          rotation={0}
          lineCap="round"
        >
          {() => (
            <View style={styles.valueContainer}>
              <Text style={styles.value}>{Math.round(airHumidity)}%</Text>
              <Text style={styles.label}>Air Humidity</Text>
            </View>
          )}
        </CircularProgress>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: spacing.md,
    padding: spacing.lg,
    marginHorizontal: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  containerSmall: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: spacing.lg,
  },
  containerLarge: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  readingContainer: {
    alignItems: 'center',
  },
  valueContainer: {
    alignItems: 'center',
  },
  value: {
    ...typography.headingLarge,
    color: colors.neutral[800],
  },
  label: {
    ...typography.labelMedium,
    color: colors.neutral[600],
    marginTop: spacing.xs,
  },
}); 