import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle, Alert } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { WeatherForecast } from './WeatherForecast';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// OpenWeatherMap API key
const WEATHER_API_KEY = 'f909c18c857e4f2150910183871ec9fc';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_API_URL = 'https://api.openweathermap.org/data/2.5/forecast';

interface WeatherData {
  temperature: number;
  condition: string;
  location: string;
  humidity: number;
  windSpeed: number;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

interface ForecastData {
  date: string;
  temperature: number;
  condition: string;
  icon: string;
}

type WeatherIconName = 'weather-sunny' | 'weather-cloudy' | 'weather-rainy' | 'weather-snowy' | 
  'weather-lightning' | 'weather-fog' | 'weather-windy' | 'weather-tornado';

export const WeatherCard: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState(false);
  const [locationAccuracy, setLocationAccuracy] = useState<'high' | 'low' | null>(null);

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    try {
      // Request location permission with detailed explanation
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError(true);
        setError('Location permission denied. Weather data may not be accurate 🌥️');
        setLoading(false);
        return;
      }

      // Get current location with highest accuracy
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
        timeInterval: 0,
        mayShowUserSettingsDialog: true,
      });

      const { latitude, longitude, accuracy } = location.coords;
      
      // Log location data for debugging
      console.log('Location data:', {
        latitude,
        longitude,
        accuracy: accuracy ? `${accuracy}m` : 'unknown',
        timestamp: new Date(location.timestamp).toISOString(),
      });

      // Set location accuracy status
      setLocationAccuracy(accuracy && accuracy <= 100 ? 'high' : 'low');

      // Fetch weather data using precise coordinates
      const [weatherResponse, forecastResponse] = await Promise.all([
        axios.get(WEATHER_API_URL, {
          params: {
            lat: latitude,
            lon: longitude,
            appid: WEATHER_API_KEY,
            units: 'metric',
          },
        }),
        axios.get(FORECAST_API_URL, {
          params: {
            lat: latitude,
            lon: longitude,
            appid: WEATHER_API_KEY,
            units: 'metric',
          },
        }),
      ]);

      const weatherData = weatherResponse.data;
      const forecastList = forecastResponse.data.list;

      // Verify if the API returned data for the requested location
      const apiLat = weatherData.coord.lat;
      const apiLon = weatherData.coord.lon;
      const locationAccuracy = Math.abs(apiLat - latitude) + Math.abs(apiLon - longitude);
      
      if (locationAccuracy > 0.1) { // If the API returned data for a significantly different location
        console.warn('Weather API returned data for a different location:', {
          requested: { latitude, longitude },
          received: { latitude: apiLat, longitude: apiLon },
          difference: `${locationAccuracy.toFixed(4)} degrees`,
        });
      }

      setWeatherData({
        temperature: Math.round(weatherData.main.temp),
        condition: weatherData.weather[0].main,
        location: weatherData.name,
        humidity: weatherData.main.humidity,
        windSpeed: weatherData.wind.speed,
        coordinates: {
          latitude,
          longitude,
        },
      });

      const dailyForecasts = forecastList.reduce((acc: any[], item: any) => {
        const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
        const existingDay = acc.find(day => day.date === date);
        
        if (existingDay) {
          existingDay.temperature = Math.round((existingDay.temperature + item.main.temp) / 2);
        } else {
          acc.push({
            date,
            temperature: Math.round(item.main.temp),
            condition: item.weather[0].main,
            icon: item.weather[0].icon,
          });
        }
        return acc;
      }, []).slice(0, 7);

      setForecastData(dailyForecasts);
      setLocationError(false);
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError('Failed to fetch weather data. Please try again later.');
      setLocationError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.card}>
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons
            name="weather-cloudy"
            size={48}
            color={colors.neutral[400]}
          />
          <Text style={styles.errorText}>{error}</Text>
          {locationError && (
            <Text style={styles.errorSubtext}>
              You can still view weather data, but it may not be for your current location.
            </Text>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.locationContainer}>
          <MaterialCommunityIcons
            name="map-marker"
            size={20}
            color={colors.primary[500]}
            style={styles.locationIcon}
          />
          <Text style={styles.locationText}>{weatherData?.location}</Text>
          {locationAccuracy === 'low' && (
            <Text style={styles.accuracyText}>
              Location not fully available — weather might not be 100% accurate 🌍
            </Text>
          )}
        </View>
        
        <View style={styles.weatherContainer}>
          <View style={styles.temperatureContainer}>
            <Text style={styles.temperatureText}>{weatherData?.temperature}°C</Text>
            <Text style={styles.conditionText}>{weatherData?.condition}</Text>
          </View>
          <MaterialCommunityIcons
            name={getWeatherIcon(weatherData?.condition || '') as WeatherIconName}
            size={48}
            color={colors.primary[500]}
            style={styles.icon}
          />
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons
              name="water-percent"
              size={20}
              color={colors.neutral[600]}
            />
            <Text style={styles.detailText}>{weatherData?.humidity}%</Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons
              name="weather-windy"
              size={20}
              color={colors.neutral[600]}
            />
            <Text style={styles.detailText}>{weatherData?.windSpeed} m/s</Text>
          </View>
        </View>
      </View>
      
      <WeatherForecast forecasts={forecastData} />
    </View>
  );
};

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

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.lg,
    marginHorizontal: spacing.md,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  } as ViewStyle,
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    flexWrap: 'wrap',
  } as ViewStyle,
  locationIcon: {
    marginRight: spacing.xs,
  },
  locationText: {
    ...typography.subtitle,
    color: colors.neutral[800],
  } as TextStyle,
  accuracyText: {
    ...typography.caption,
    color: colors.neutral[600],
    marginTop: spacing.xs,
    width: '100%',
  } as TextStyle,
  weatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  } as ViewStyle,
  temperatureContainer: {
    flex: 1,
  } as ViewStyle,
  temperatureText: {
    ...typography.h1,
    color: colors.neutral[800],
    marginBottom: spacing.xs,
  } as TextStyle,
  conditionText: {
    ...typography.bodyLarge,
    color: colors.neutral[600],
  } as TextStyle,
  icon: {
    marginLeft: spacing.md,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  } as ViewStyle,
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  detailText: {
    ...typography.bodyMedium,
    color: colors.neutral[600],
    marginLeft: spacing.xs,
  } as TextStyle,
  errorContainer: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  errorText: {
    ...typography.bodyLarge,
    color: colors.error[500],
    textAlign: 'center',
    marginTop: spacing.md,
  } as TextStyle,
  errorSubtext: {
    ...typography.body,
    color: colors.neutral[600],
    textAlign: 'center',
    marginTop: spacing.sm,
  } as TextStyle,
}); 
