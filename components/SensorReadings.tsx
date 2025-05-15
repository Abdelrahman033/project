import React from 'react';
import { StyleSheet, View, Text, useWindowDimensions } from 'react-native';
import { CircularProgress } from 'react-native-circular-progress';
import { colors, spacing, typography } from '@/theme';
import { Droplet, Cloud, Thermometer, Wind } from 'lucide-react-native';

interface SensorReadingsProps {
  soilMoisture: number;
  airHumidity: number;
  temperature?: number;
  windSpeed?: number;
}

export function SensorReadings({ 
  soilMoisture, 
  airHumidity, 
  temperature = 25, 
  windSpeed = 12 
}: SensorReadingsProps) {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 360;
  const circleSize = isSmallScreen ? 100 : 120;
  const strokeWidth = 8;

  const getStatusColor = (value: number, type: 'moisture' | 'humidity' | 'temperature' | 'wind') => {
    switch (type) {
      case 'moisture':
        return value > 70 ? colors.success[500] : value > 40 ? colors.warning[500] : colors.error[500];
      case 'humidity':
        return value > 60 ? colors.success[500] : value > 40 ? colors.warning[500] : colors.error[500];
      case 'temperature':
        return value > 30 ? colors.error[500] : value > 20 ? colors.success[500] : colors.warning[500];
      case 'wind':
        return value > 15 ? colors.error[500] : value > 8 ? colors.warning[500] : colors.success[500];
      default:
        return colors.primary[500];
    }
  };

  const getStatusText = (value: number, type: 'moisture' | 'humidity' | 'temperature' | 'wind') => {
    switch (type) {
      case 'moisture':
        return value > 70 ? 'Optimal' : value > 40 ? 'Moderate' : 'Low';
      case 'humidity':
        return value > 60 ? 'High' : value > 40 ? 'Moderate' : 'Low';
      case 'temperature':
        return value > 30 ? 'High' : value > 20 ? 'Optimal' : 'Low';
      case 'wind':
        return value > 15 ? 'Strong' : value > 8 ? 'Moderate' : 'Light';
      default:
        return 'Normal';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        <View style={styles.readingContainer}>
          <View style={styles.iconContainer}>
            <Droplet size={24} color={getStatusColor(soilMoisture, 'moisture')} />
          </View>
          <CircularProgress
            size={circleSize}
            width={strokeWidth}
            fill={soilMoisture}
            tintColor={getStatusColor(soilMoisture, 'moisture')}
            backgroundColor={colors.neutral[100]}
            rotation={0}
            lineCap="round"
          >
            {() => (
              <View style={styles.valueContainer}>
                <Text style={[styles.value, { color: getStatusColor(soilMoisture, 'moisture') }]}>
                  {Math.round(soilMoisture)}%
                </Text>
                <Text style={styles.label}>Soil Moisture</Text>
                <Text style={[styles.status, { color: getStatusColor(soilMoisture, 'moisture') }]}>
                  {getStatusText(soilMoisture, 'moisture')}
                </Text>
              </View>
            )}
          </CircularProgress>
        </View>

        <View style={styles.readingContainer}>
          <View style={styles.iconContainer}>
            <Cloud size={24} color={getStatusColor(airHumidity, 'humidity')} />
          </View>
          <CircularProgress
            size={circleSize}
            width={strokeWidth}
            fill={airHumidity}
            tintColor={getStatusColor(airHumidity, 'humidity')}
            backgroundColor={colors.neutral[100]}
            rotation={0}
            lineCap="round"
          >
            {() => (
              <View style={styles.valueContainer}>
                <Text style={[styles.value, { color: getStatusColor(airHumidity, 'humidity') }]}>
                  {Math.round(airHumidity)}%
                </Text>
                <Text style={styles.label}>Air Humidity</Text>
                <Text style={[styles.status, { color: getStatusColor(airHumidity, 'humidity') }]}>
                  {getStatusText(airHumidity, 'humidity')}
                </Text>
              </View>
            )}
          </CircularProgress>
        </View>

        <View style={styles.readingContainer}>
          <View style={styles.iconContainer}>
            <Thermometer size={24} color={getStatusColor(temperature, 'temperature')} />
          </View>
          <CircularProgress
            size={circleSize}
            width={strokeWidth}
            fill={(temperature / 40) * 100}
            tintColor={getStatusColor(temperature, 'temperature')}
            backgroundColor={colors.neutral[100]}
            rotation={0}
            lineCap="round"
          >
            {() => (
              <View style={styles.valueContainer}>
                <Text style={[styles.value, { color: getStatusColor(temperature, 'temperature') }]}>
                  {temperature}°C
                </Text>
                <Text style={styles.label}>Temperature</Text>
                <Text style={[styles.status, { color: getStatusColor(temperature, 'temperature') }]}>
                  {getStatusText(temperature, 'temperature')}
                </Text>
              </View>
            )}
          </CircularProgress>
        </View>

        <View style={styles.readingContainer}>
          <View style={styles.iconContainer}>
            <Wind size={24} color={getStatusColor(windSpeed, 'wind')} />
          </View>
          <CircularProgress
            size={circleSize}
            width={strokeWidth}
            fill={(windSpeed / 20) * 100}
            tintColor={getStatusColor(windSpeed, 'wind')}
            backgroundColor={colors.neutral[100]}
            rotation={0}
            lineCap="round"
          >
            {() => (
              <View style={styles.valueContainer}>
                <Text style={[styles.value, { color: getStatusColor(windSpeed, 'wind') }]}>
                  {windSpeed} km/h
                </Text>
                <Text style={styles.label}>Wind Speed</Text>
                <Text style={[styles.status, { color: getStatusColor(windSpeed, 'wind') }]}>
                  {getStatusText(windSpeed, 'wind')}
                </Text>
              </View>
            )}
          </CircularProgress>
        </View>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: spacing.md,
  },
  readingContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  iconContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 1,
  },
  valueContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    ...typography.headingMedium,
    fontWeight: 'bold',
  },
  label: {
    ...typography.labelMedium,
    color: colors.neutral[600],
    marginTop: spacing.xs,
  },
  status: {
    ...typography.labelSmall,
    marginTop: spacing.xs,
    fontWeight: '600',
  },
}); 