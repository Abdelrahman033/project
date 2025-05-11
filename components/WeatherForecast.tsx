import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface WeatherForecastProps {
  forecasts: Array<{
    date: string;
    temperature: number;
    condition: string;
    icon: string;
  }>;
}

type WeatherIconName = 'weather-sunny' | 'weather-cloudy' | 'weather-rainy' | 'weather-snowy' | 
  'weather-lightning' | 'weather-fog' | 'weather-windy' | 'weather-tornado';

const getWeatherIcon = (condition: string): WeatherIconName => {
  const conditionMap: { [key: string]: WeatherIconName } = {
    'Clear': 'weather-sunny',
    'Clouds': 'weather-cloudy',
    'Rain': 'weather-rainy',
    'Snow': 'weather-snowy',
    'Thunderstorm': 'weather-lightning',
    'Drizzle': 'weather-rainy',
    'Mist': 'weather-fog',
    'Smoke': 'weather-fog',
    'Haze': 'weather-fog',
    'Dust': 'weather-fog',
    'Fog': 'weather-fog',
    'Sand': 'weather-fog',
    'Ash': 'weather-fog',
    'Squall': 'weather-windy',
    'Tornado': 'weather-tornado',
  };
  
  return conditionMap[condition] || 'weather-cloudy';
};

export const WeatherForecast: React.FC<WeatherForecastProps> = ({ forecasts }) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <MaterialCommunityIcons
          name="calendar-week"
          size={20}
          color={colors.primary[500]}
          style={styles.headerIcon}
        />
        <Text style={styles.title}>7-Day Forecast</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={Dimensions.get('window').width * 0.4 + spacing.md}
        snapToAlignment="start"
      >
        {forecasts.map((forecast, index) => (
          <View key={index} style={styles.forecastCard}>
            <Text style={styles.dateText}>{forecast.date}</Text>
            <MaterialCommunityIcons
              name={getWeatherIcon(forecast.condition)}
              size={32}
              color={colors.primary[500]}
              style={styles.icon}
            />
            <Text style={styles.temperatureText}>{forecast.temperature}°C</Text>
            <Text style={styles.conditionText}>{forecast.condition}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  headerIcon: {
    marginRight: spacing.xs,
  },
  title: {
    ...typography.headingSmall,
    color: colors.neutral[800],
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  forecastCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.md,
    width: Dimensions.get('window').width * 0.4,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateText: {
    ...typography.labelMedium,
    color: colors.neutral[600],
    marginBottom: spacing.sm,
  },
  icon: {
    marginVertical: spacing.sm,
  },
  temperatureText: {
    ...typography.headingMedium,
    color: colors.neutral[800],
    marginBottom: spacing.xs,
  },
  conditionText: {
    ...typography.bodySmall,
    color: colors.neutral[600],
    textAlign: 'center',
  },
}); 