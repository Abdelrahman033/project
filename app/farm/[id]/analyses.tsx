import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { colors, spacing, typography } from '@/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SoilAnalysisResult } from '@/types';
import { Calendar, MapPin, AlertTriangle, BarChart2 } from 'lucide-react-native';

// Mock analyses data
const mockAnalyses: Record<string, SoilAnalysisResult[]> = {
  'farm1': [
    {
      id: '1',
      userId: 'user1',
      farmId: 'farm1',
      imageUrl: 'https://images.pexels.com/photos/6024558/pexels-photo-6024558.jpeg',
      timestamp: Date.now() - 86400000 * 2,
      location: {
        latitude: 37.7749,
        longitude: -122.4194,
        accuracy: 10
      },
      disease: {
        type: 'fungal_infection',
        confidence: 0.87,
        severity: 3.5
      },
      soilHealth: 'fair',
      recommendations: [
        'Apply fungicide treatment within 48 hours',
        'Improve drainage in affected areas',
        'Consider crop rotation next season'
      ],
      nutrients: {
        nitrogen: 12,
        phosphorus: 9,
        potassium: 18,
        ph: 6.2,
        organicMatter: 3.4
      },
      isSynced: true
    },
    {
      id: '2',
      userId: 'user1',
      farmId: 'farm1',
      imageUrl: 'https://images.pexels.com/photos/7728332/pexels-photo-7728332.jpeg',
      timestamp: Date.now() - 86400000 * 5,
      location: {
        latitude: 37.7755,
        longitude: -122.4198,
        accuracy: 8
      },
      disease: {
        type: 'nutrient_deficiency',
        confidence: 0.92,
        severity: 2.0
      },
      soilHealth: 'good',
      recommendations: [
        'Apply balanced NPK fertilizer',
        'Consider soil amendment with compost'
      ],
      nutrients: {
        nitrogen: 8,
        phosphorus: 5,
        potassium: 12,
        ph: 6.7,
        organicMatter: 4.1
      },
      isSynced: true
    },
  ],
  'farm2': [
    {
      id: '3',
      userId: 'user1',
      farmId: 'farm2',
      imageUrl: 'https://images.pexels.com/photos/5474600/pexels-photo-5474600.jpeg',
      timestamp: Date.now() - 86400000 * 1,
      location: {
        latitude: 37.7760,
        longitude: -122.4190,
        accuracy: 15
      },
      disease: {
        type: 'pest_damage',
        confidence: 0.78,
        severity: 4.2
      },
      soilHealth: 'poor',
      recommendations: [
        'Apply targeted pesticide immediately',
        'Monitor for signs of spread to adjacent areas',
        'Consider beneficial insects for long-term management'
      ],
      nutrients: {
        nitrogen: 14,
        phosphorus: 11,
        potassium: 10,
        ph: 5.9,
        organicMatter: 2.8
      },
      isSynced: false
    },
  ],
};

export default function FarmAnalysesScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [analyses, setAnalyses] = useState<SoilAnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch analyses
    setLoading(true);
    setTimeout(() => {
      if (id && mockAnalyses[id]) {
        setAnalyses(mockAnalyses[id]);
      }
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleAnalysisPress = (analysisId: string) => {
    router.push(`/analysis/${analysisId}`);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header 
        title="Farm Analyses"
        showBackButton
      />
      
      <ScrollView style={styles.content}>
        {analyses.map((analysis) => (
          <Card
            key={analysis.id}
            onPress={() => handleAnalysisPress(analysis.id)}
            style={styles.analysisCard}
          >
            <View style={styles.analysisHeader}>
              <View style={styles.analysisTitleContainer}>
                <Text style={styles.analysisTitle}>
                  {analysis.disease.type.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </Text>
                <View style={[
                  styles.healthBadge,
                  { backgroundColor: analysis.soilHealth === 'good' ? colors.success[100] : 
                    analysis.soilHealth === 'fair' ? colors.warning[100] : colors.error[100] }
                ]}>
                  <Text style={[
                    styles.healthText,
                    { color: analysis.soilHealth === 'good' ? colors.success[700] : 
                      analysis.soilHealth === 'fair' ? colors.warning[700] : colors.error[700] }
                  ]}>
                    {analysis.soilHealth.charAt(0).toUpperCase() + analysis.soilHealth.slice(1)}
                  </Text>
                </View>
              </View>
              <BarChart2 size={20} color={colors.neutral[400]} />
            </View>

            <View style={styles.analysisDetails}>
              <View style={styles.detailRow}>
                <Calendar size={16} color={colors.neutral[600]} />
                <Text style={styles.detailText}>
                  {new Date(analysis.timestamp).toLocaleDateString()}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <MapPin size={16} color={colors.neutral[600]} />
                <Text style={styles.detailText}>
                  {analysis.location.latitude.toFixed(4)}, {analysis.location.longitude.toFixed(4)}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <AlertTriangle size={16} color={colors.error[500]} />
                <Text style={[styles.detailText, { color: colors.error[500] }]}>
                  Severity: {analysis.disease.severity.toFixed(1)}/5
                </Text>
              </View>
            </View>

            <View style={styles.nutrientsContainer}>
              <Text style={styles.nutrientsLabel}>Nutrients:</Text>
              <View style={styles.nutrientsGrid}>
                <View style={styles.nutrientItem}>
                  <Text style={styles.nutrientValue}>N: {analysis.nutrients.nitrogen}</Text>
                </View>
                <View style={styles.nutrientItem}>
                  <Text style={styles.nutrientValue}>P: {analysis.nutrients.phosphorus}</Text>
                </View>
                <View style={styles.nutrientItem}>
                  <Text style={styles.nutrientValue}>K: {analysis.nutrients.potassium}</Text>
                </View>
                <View style={styles.nutrientItem}>
                  <Text style={styles.nutrientValue}>pH: {analysis.nutrients.ph}</Text>
                </View>
              </View>
            </View>
          </Card>
        ))}
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
  content: {
    flex: 1,
    padding: spacing.md,
  },
  analysisCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  analysisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  analysisTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  analysisTitle: {
    ...typography.labelLarge,
    color: colors.neutral[800],
    marginRight: spacing.sm,
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
  analysisDetails: {
    marginBottom: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  detailText: {
    ...typography.bodySmall,
    color: colors.neutral[600],
    marginLeft: spacing.xs,
  },
  nutrientsContainer: {
    marginTop: spacing.sm,
  },
  nutrientsLabel: {
    ...typography.labelSmall,
    color: colors.neutral[600],
    marginBottom: spacing.xs,
  },
  nutrientsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  nutrientItem: {
    backgroundColor: colors.neutral[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: spacing.sm,
  },
  nutrientValue: {
    ...typography.labelSmall,
    color: colors.neutral[700],
  },
}); 