import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { colors, spacing, typography } from '@/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Farm } from '@/types';
import {
  MapPin,
  Crop,
  Ruler,
  Calendar,
  BarChart2,
  Edit2,
  Trash2,
  AlertTriangle,
} from 'lucide-react-native';

// Mock farm data
const mockFarms: Record<string, Farm> = {
  'farm1': {
    id: 'farm1',
    name: 'Green Valley Farm',
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
    },
    size: 250,
    crops: ['Corn', 'Soybeans', 'Wheat'],
    soilHealth: 'good',
    lastAnalysis: Date.now() - 86400000 * 5, // 5 days ago
    totalAnalyses: 12,
    alerts: 2,
    averageNutrients: {
      nitrogen: 15,
      phosphorus: 12,
      potassium: 20,
      ph: 6.5,
      organicMatter: 3.8,
    },
  },
  'farm2': {
    id: 'farm2',
    name: 'Sunset Hills',
    location: {
      latitude: 37.7849,
      longitude: -122.4294,
    },
    size: 180,
    crops: ['Rice', 'Cotton'],
    soilHealth: 'fair',
    lastAnalysis: Date.now() - 86400000 * 2, // 2 days ago
    totalAnalyses: 8,
    alerts: 1,
    averageNutrients: {
      nitrogen: 12,
      phosphorus: 8,
      potassium: 15,
      ph: 6.2,
      organicMatter: 3.2,
    },
  },
};

export default function FarmDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [farm, setFarm] = useState<Farm | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch farm details
    setLoading(true);
    setTimeout(() => {
      if (id && mockFarms[id]) {
        setFarm(mockFarms[id]);
      }
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleEditFarm = () => {
    router.push(`/farm/edit/${id}`);
  };

  const handleDeleteFarm = () => {
    Alert.alert(
      'Delete Farm',
      'Are you sure you want to delete this farm? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            // In a real app, this would delete the farm from the backend
            router.back();
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleViewAnalyses = () => {
    router.push(`/farm/${id}/analyses`);
  };

  const handleViewTrends = () => {
    router.push(`/farm/${id}/trends`);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  if (!farm) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Farm not found</Text>
        <Button
          title="Go Back"
          onPress={() => router.back()}
          style={styles.errorButton}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header 
        title={farm.name}
        showBackButton
      />
      
      <ScrollView style={styles.content}>
        <Card style={styles.overviewCard}>
          <View style={styles.overviewHeader}>
            <View style={styles.overviewTitleContainer}>
              <Text style={styles.overviewTitle}>Farm Overview</Text>
              <View style={[
                styles.healthBadge,
                { backgroundColor: farm.soilHealth === 'good' ? colors.success[100] : colors.warning[100] }
              ]}>
                <Text style={[
                  styles.healthText,
                  { color: farm.soilHealth === 'good' ? colors.success[700] : colors.warning[700] }
                ]}>
                  {farm.soilHealth.charAt(0).toUpperCase() + farm.soilHealth.slice(1)} Health
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.overviewGrid}>
            <View style={styles.overviewItem}>
              <Ruler size={20} color={colors.neutral[600]} />
              <Text style={styles.overviewValue}>{farm.size.toLocaleString()} m²</Text>
              <Text style={styles.overviewLabel}>Size</Text>
            </View>
            
            <View style={styles.overviewItem}>
              <Calendar size={20} color={colors.neutral[600]} />
              <Text style={styles.overviewValue}>
                {new Date(farm.lastAnalysis).toLocaleDateString()}
              </Text>
              <Text style={styles.overviewLabel}>Last Analysis</Text>
            </View>
            
            <View style={styles.overviewItem}>
              <BarChart2 size={20} color={colors.neutral[600]} />
              <Text style={styles.overviewValue}>{farm.totalAnalyses}</Text>
              <Text style={styles.overviewLabel}>Total Analyses</Text>
            </View>
            
            <View style={styles.overviewItem}>
              <AlertTriangle size={20} color={colors.error[500]} />
              <Text style={[styles.overviewValue, { color: colors.error[500] }]}>
                {farm.alerts}
              </Text>
              <Text style={styles.overviewLabel}>Active Alerts</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.locationContainer}>
            <MapPin size={20} color={colors.neutral[600]} />
            <Text style={styles.locationText}>
              {farm.location.latitude.toFixed(4)}, {farm.location.longitude.toFixed(4)}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Crops</Text>
          <View style={styles.cropsContainer}>
            {farm.crops.map((crop, index) => (
              <View key={index} style={styles.cropTag}>
                <Crop size={16} color={colors.primary[500]} />
                <Text style={styles.cropText}>{crop}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Average Nutrients</Text>
          <View style={styles.nutrientsGrid}>
            <View style={styles.nutrientItem}>
              <Text style={styles.nutrientValue}>{farm.averageNutrients.nitrogen}</Text>
              <Text style={styles.nutrientLabel}>Nitrogen</Text>
            </View>
            <View style={styles.nutrientItem}>
              <Text style={styles.nutrientValue}>{farm.averageNutrients.phosphorus}</Text>
              <Text style={styles.nutrientLabel}>Phosphorus</Text>
            </View>
            <View style={styles.nutrientItem}>
              <Text style={styles.nutrientValue}>{farm.averageNutrients.potassium}</Text>
              <Text style={styles.nutrientLabel}>Potassium</Text>
            </View>
            <View style={styles.nutrientItem}>
              <Text style={styles.nutrientValue}>{farm.averageNutrients.ph}</Text>
              <Text style={styles.nutrientLabel}>pH</Text>
            </View>
            <View style={styles.nutrientItem}>
              <Text style={styles.nutrientValue}>{farm.averageNutrients.organicMatter}%</Text>
              <Text style={styles.nutrientLabel}>Organic Matter</Text>
            </View>
          </View>
        </Card>

        <View style={styles.actionsContainer}>
          <Button
            title="View Analyses"
            onPress={handleViewAnalyses}
            icon={<BarChart2 size={20} color={colors.white} />}
            style={styles.actionButton}
          />
          
          <Button
            title="View Trends"
            variant="outline"
            onPress={handleViewTrends}
            icon={<BarChart2 size={20} color={colors.primary[500]} />}
            style={styles.actionButton}
          />
          
          <Button
            title="Edit Farm"
            variant="outline"
            onPress={handleEditFarm}
            icon={<Edit2 size={20} color={colors.primary[500]} />}
            style={styles.actionButton}
          />
          
          <Button
            title="Delete Farm"
            variant="outline"
            onPress={handleDeleteFarm}
            icon={<Trash2 size={20} color={colors.error[500]} />}
            textStyle={{ color: colors.error[500] }}
            style={[styles.actionButton, styles.deleteButton]}
          />
        </View>
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
    marginBottom: spacing.lg,
  },
  errorButton: {
    minWidth: 200,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  overviewCard: {
    marginBottom: spacing.md,
  },
  overviewHeader: {
    marginBottom: spacing.md,
  },
  overviewTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overviewTitle: {
    ...typography.headingSmall,
    color: colors.neutral[800],
  },
  healthBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: spacing.sm,
  },
  healthText: {
    ...typography.labelSmall,
    fontWeight: 'bold',
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  overviewItem: {
    width: '50%',
    padding: spacing.xs,
    alignItems: 'center',
  },
  overviewValue: {
    ...typography.headingSmall,
    color: colors.neutral[800],
    marginTop: spacing.xs,
  },
  overviewLabel: {
    ...typography.labelSmall,
    color: colors.neutral[600],
    marginTop: spacing.xxs,
  },
  detailsCard: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.labelLarge,
    color: colors.neutral[800],
    marginBottom: spacing.sm,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  locationText: {
    ...typography.bodyMedium,
    color: colors.neutral[600],
    marginLeft: spacing.xs,
  },
  cropsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  cropTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: spacing.sm,
  },
  cropText: {
    ...typography.labelSmall,
    color: colors.primary[700],
    marginLeft: spacing.xs,
  },
  nutrientsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  nutrientItem: {
    width: '33.33%',
    padding: spacing.xs,
    alignItems: 'center',
  },
  nutrientValue: {
    ...typography.labelLarge,
    color: colors.neutral[800],
  },
  nutrientLabel: {
    ...typography.labelSmall,
    color: colors.neutral[600],
    marginTop: spacing.xxs,
  },
  actionsContainer: {
    marginBottom: spacing.xl,
  },
  actionButton: {
    marginBottom: spacing.sm,
  },
  deleteButton: {
    borderColor: colors.error[300],
  },
}); 