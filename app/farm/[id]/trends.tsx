import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { colors, spacing, typography } from '@/theme';
import { useLocalSearchParams } from 'expo-router';
import { LineChart } from 'react-native-chart-kit';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react-native';

// Mock trend data
const mockTrends = {
  'farm1': {
    nutrientTrends: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          data: [12, 11, 13, 14, 12, 15],
          color: () => colors.primary[500],
          strokeWidth: 2,
        },
        {
          data: [8, 9, 7, 8, 9, 12],
          color: () => colors.success[500],
          strokeWidth: 2,
        },
        {
          data: [15, 16, 18, 17, 19, 20],
          color: () => colors.warning[500],
          strokeWidth: 2,
        },
      ],
    },
    healthTrends: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          data: [3.2, 3.4, 3.5, 3.3, 3.6, 3.8],
          color: () => colors.success[500],
          strokeWidth: 2,
        },
      ],
    },
    alerts: [
      {
        type: 'nutrient_deficiency',
        severity: 'high',
        message: 'Nitrogen levels below optimal range',
        timestamp: Date.now() - 86400000 * 2,
      },
      {
        type: 'soil_health',
        severity: 'medium',
        message: 'Soil pH trending towards acidic',
        timestamp: Date.now() - 86400000 * 5,
      },
    ],
  },
  'farm2': {
    nutrientTrends: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          data: [10, 11, 9, 10, 11, 12],
          color: () => colors.primary[500],
          strokeWidth: 2,
        },
        {
          data: [7, 6, 8, 7, 8, 9],
          color: () => colors.success[500],
          strokeWidth: 2,
        },
        {
          data: [12, 13, 14, 13, 15, 16],
          color: () => colors.warning[500],
          strokeWidth: 2,
        },
      ],
    },
    healthTrends: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          data: [2.8, 2.9, 3.0, 3.1, 3.2, 3.3],
          color: () => colors.success[500],
          strokeWidth: 2,
        },
      ],
    },
    alerts: [
      {
        type: 'pest_damage',
        severity: 'high',
        message: 'Increased pest activity detected',
        timestamp: Date.now() - 86400000 * 1,
      },
    ],
  },
};

const chartConfig = {
  backgroundGradientFrom: colors.white,
  backgroundGradientTo: colors.white,
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: colors.primary[500],
  },
};

export default function FarmTrendsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [trends, setTrends] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch trends
    setLoading(true);
    setTimeout(() => {
      if (id && mockTrends[id]) {
        setTrends(mockTrends[id]);
      }
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  if (!trends) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No trend data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header 
        title="Farm Trends"
        showBackButton
      />
      
      <ScrollView style={styles.content}>
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Nutrient Trends</Text>
          <Text style={styles.chartSubtitle}>Last 6 months</Text>
          <LineChart
            data={trends.nutrientTrends}
            width={Dimensions.get('window').width - spacing.xl * 2}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: colors.primary[500] }]} />
              <Text style={styles.legendText}>Nitrogen</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: colors.success[500] }]} />
              <Text style={styles.legendText}>Phosphorus</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: colors.warning[500] }]} />
              <Text style={styles.legendText}>Potassium</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Soil Health Index</Text>
          <Text style={styles.chartSubtitle}>Last 6 months</Text>
          <LineChart
            data={trends.healthTrends}
            width={Dimensions.get('window').width - spacing.xl * 2}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </Card>

        <Card style={styles.alertsCard}>
          <Text style={styles.alertsTitle}>Recent Alerts</Text>
          {trends.alerts.map((alert: any, index: number) => (
            <View key={index} style={styles.alertItem}>
              <View style={styles.alertHeader}>
                <AlertTriangle 
                  size={20} 
                  color={alert.severity === 'high' ? colors.error[500] : colors.warning[500]} 
                />
                <Text style={[
                  styles.alertSeverity,
                  { color: alert.severity === 'high' ? colors.error[500] : colors.warning[500] }
                ]}>
                  {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                </Text>
                <Text style={styles.alertDate}>
                  {new Date(alert.timestamp).toLocaleDateString()}
                </Text>
              </View>
              <Text style={styles.alertMessage}>{alert.message}</Text>
            </View>
          ))}
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[100],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    ...typography.headingMedium,
    color: colors.error[500],
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  chartCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  chartTitle: {
    ...typography.headingSmall,
    color: colors.neutral[800],
    marginBottom: spacing.xxs,
  },
  chartSubtitle: {
    ...typography.bodySmall,
    color: colors.neutral[600],
    marginBottom: spacing.md,
  },
  chart: {
    marginVertical: spacing.sm,
    borderRadius: spacing.sm,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.sm,
    gap: spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.xs,
  },
  legendText: {
    ...typography.labelSmall,
    color: colors.neutral[600],
  },
  alertsCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  alertsTitle: {
    ...typography.headingSmall,
    color: colors.neutral[800],
    marginBottom: spacing.md,
  },
  alertItem: {
    marginBottom: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.neutral[50],
    borderRadius: spacing.sm,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  alertSeverity: {
    ...typography.labelSmall,
    fontWeight: 'bold',
    marginLeft: spacing.xs,
    marginRight: 'auto',
  },
  alertDate: {
    ...typography.labelSmall,
    color: colors.neutral[600],
  },
  alertMessage: {
    ...typography.bodySmall,
    color: colors.neutral[700],
  },
}); 