import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Share,
  ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { SeverityIndicator } from '@/components/SeverityIndicator';
import { colors, spacing, typography } from '@/theme';
import { SoilAnalysisResult } from '@/types';
import { Calendar, MapPin, BarChart2, AlertTriangle, Download, Share2 } from 'lucide-react-native';

// Mock data for demonstration
const mockAnalyses: Record<string, SoilAnalysisResult> = {
  '1': {
    id: '1',
    userId: 'user1',
    farmId: 'farm1',
    imageUrl: 'https://images.pexels.com/photos/6024558/pexels-photo-6024558.jpeg',
    timestamp: Date.now() - 86400000 * 2, // 2 days ago
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
  'new': {
    id: 'new',
    userId: 'user1',
    farmId: 'farm1',
    imageUrl: 'https://images.pexels.com/photos/5474600/pexels-photo-5474600.jpeg',
    timestamp: Date.now(),
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
  }
};

export default function AnalysisDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [analysis, setAnalysis] = useState<SoilAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call to fetch analysis details
    setLoading(true);
    setTimeout(() => {
      if (id && mockAnalyses[id]) {
        setAnalysis(mockAnalyses[id]);
      }
      setLoading(false);
    }, 1000);
  }, [id]);
  
  const handleShareAnalysis = async () => {
    if (!analysis) return;
    
    try {
      const result = await Share.share({
        message: `Soil Analysis Results - ${formatDiseaseName(analysis.disease.type)} detected with ${Math.round(analysis.disease.confidence * 100)}% confidence. Soil health is rated as ${analysis.soilHealth}.`,
        title: 'SoilSense AI Analysis Results',
      });
    } catch (error) {
      console.error('Error sharing analysis:', error);
    }
  };
  
  const handleDownloadReport = () => {
    // In a real app, this would generate and download a PDF report
    console.log('Downloading report...');
  };
  
  const handleViewOnMap = () => {
    if (!analysis) return;
    router.push(`/map?lat=${analysis.location.latitude}&lng=${analysis.location.longitude}`);
  };
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const formatDiseaseName = (diseaseType: string) => {
    return diseaseType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  if (loading) {
    return (
      <View style={styles.container}>
        <Header 
          title="Analysis Details" 
          showBackButton
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
          <Text style={styles.loadingText}>Loading analysis details...</Text>
        </View>
      </View>
    );
  }
  
  if (!analysis) {
    return (
      <View style={styles.container}>
        <Header 
          title="Analysis Details" 
          showBackButton
        />
        <View style={styles.errorContainer}>
          <AlertTriangle size={64} color={colors.error[500]} />
          <Text style={styles.errorTitle}>Analysis Not Found</Text>
          <Text style={styles.errorText}>
            The requested analysis could not be found. It may have been deleted or you don't have permission to view it.
          </Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            style={styles.errorButton}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header 
        title="Analysis Details" 
        showBackButton
        rightComponent={
          <TouchableOpacity
            onPress={handleShareAnalysis}
            style={styles.shareButton}
          >
            <Share2 size={24} color={colors.neutral[800]} />
          </TouchableOpacity>
        }
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: analysis.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
          {!analysis.isSynced && (
            <View style={styles.syncBadge}>
              <Text style={styles.syncText}>Offline</Text>
            </View>
          )}
        </View>
        
        <View style={styles.headerSection}>
          <View style={styles.diseaseContainer}>
            <Text style={styles.diseaseTitle}>
              {formatDiseaseName(analysis.disease.type)}
            </Text>
            <Text style={styles.confidenceText}>
              {Math.round(analysis.disease.confidence * 100)}% confidence
            </Text>
          </View>
          
          <View style={styles.soilHealthContainer}>
            <Text style={styles.soilHealthLabel}>Soil Health:</Text>
            <View style={[styles.soilHealthBadge, styles[`healthBadge${analysis.soilHealth}`]]}>
              <Text style={styles.soilHealthText}>
                {analysis.soilHealth.charAt(0).toUpperCase() + analysis.soilHealth.slice(1)}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.metadataSection}>
          <View style={styles.metadataItem}>
            <Calendar size={16} color={colors.neutral[600]} />
            <Text style={styles.metadataText}>{formatDate(analysis.timestamp)}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.metadataItem}
            onPress={handleViewOnMap}
          >
            <MapPin size={16} color={colors.neutral[600]} />
            <Text style={styles.metadataText}>
              {analysis.location.latitude.toFixed(4)}, {analysis.location.longitude.toFixed(4)}
              <Text style={styles.viewMapText}> (View on map)</Text>
            </Text>
          </TouchableOpacity>
        </View>
        
        <Card style={styles.severityCard}>
          <Text style={styles.sectionTitle}>Disease Severity</Text>
          <SeverityIndicator 
            level={analysis.disease.severity} 
            type="horizontal"
            size="large"
            showLabel={true}
          />
          
          <Text style={styles.severityDescription}>
            {analysis.disease.severity <= 2 ? 
              'Low severity. Treatment is recommended but not urgent.' : 
              analysis.disease.severity <= 4 ? 
              'Moderate severity. Prompt treatment is recommended to prevent spread.' :
              'High severity. Immediate treatment is required to prevent crop loss.'}
          </Text>
        </Card>
        
        <Card style={styles.recommendationsCard}>
          <Text style={styles.sectionTitle}>Recommendations</Text>
          {analysis.recommendations.map((recommendation, index) => (
            <View key={index} style={styles.recommendationItem}>
              <View style={styles.recommendationBullet}>
                <Text style={styles.bulletText}>{index + 1}</Text>
              </View>
              <Text style={styles.recommendationText}>{recommendation}</Text>
            </View>
          ))}
        </Card>
        
        <Card style={styles.nutrientsCard}>
          <Text style={styles.sectionTitle}>Soil Nutrients</Text>
          
          <View style={styles.nutrientRow}>
            <View style={styles.nutrientItem}>
              <Text style={styles.nutrientValue}>{analysis.nutrients.nitrogen}</Text>
              <Text style={styles.nutrientLabel}>Nitrogen</Text>
            </View>
            
            <View style={styles.nutrientItem}>
              <Text style={styles.nutrientValue}>{analysis.nutrients.phosphorus}</Text>
              <Text style={styles.nutrientLabel}>Phosphorus</Text>
            </View>
            
            <View style={styles.nutrientItem}>
              <Text style={styles.nutrientValue}>{analysis.nutrients.potassium}</Text>
              <Text style={styles.nutrientLabel}>Potassium</Text>
            </View>
          </View>
          
          <View style={styles.nutrientRow}>
            <View style={styles.nutrientItem}>
              <Text style={styles.nutrientValue}>{analysis.nutrients.ph}</Text>
              <Text style={styles.nutrientLabel}>pH</Text>
            </View>
            
            <View style={styles.nutrientItem}>
              <Text style={styles.nutrientValue}>{analysis.nutrients.organicMatter}%</Text>
              <Text style={styles.nutrientLabel}>Organic Matter</Text>
            </View>
          </View>
        </Card>
        
        <View style={styles.actionsContainer}>
          <Button
            title="Download Report"
            variant="outline"
            onPress={handleDownloadReport}
            icon={<Download size={20} color={colors.primary[500]} />}
            style={styles.actionButton}
          />
          
          <Button
            title="View Trends"
            onPress={() => router.push('/trends')}
            icon={<BarChart2 size={20} color={colors.white} />}
            style={styles.actionButton}
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
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    ...typography.bodyLarge,
    color: colors.neutral[600],
    marginTop: spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorTitle: {
    ...typography.headingMedium,
    color: colors.neutral[800],
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  errorText: {
    ...typography.bodyMedium,
    color: colors.neutral[600],
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  errorButton: {
    minWidth: 200,
  },
  shareButton: {
    padding: spacing.xs,
  },
  imageContainer: {
    position: 'relative',
    height: 250,
    width: '100%',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  syncBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: colors.warning[500],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: spacing.sm,
  },
  syncText: {
    ...typography.labelSmall,
    color: colors.white,
  },
  headerSection: {
    backgroundColor: colors.white,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  diseaseContainer: {
    flex: 1,
  },
  diseaseTitle: {
    ...typography.headingMedium,
    color: colors.neutral[800],
    marginBottom: spacing.xxs,
  },
  confidenceText: {
    ...typography.bodyMedium,
    color: colors.neutral[600],
  },
  soilHealthContainer: {
    alignItems: 'flex-end',
  },
  soilHealthLabel: {
    ...typography.labelSmall,
    color: colors.neutral[600],
    marginBottom: spacing.xxs,
  },
  soilHealthBadge: {
    paddingVertical: spacing.xxs,
    paddingHorizontal: spacing.sm,
    borderRadius: spacing.sm,
  },
  healthBadgeexcellent: {
    backgroundColor: colors.success[100],
  },
  healthBadgegood: {
    backgroundColor: colors.success[100],
  },
  healthBadgefair: {
    backgroundColor: colors.warning[100],
  },
  healthBadgepoor: {
    backgroundColor: colors.warning[100],
  },
  healthBadgecritical: {
    backgroundColor: colors.error[100],
  },
  soilHealthText: {
    ...typography.labelMedium,
    color: colors.neutral[800],
  },
  metadataSection: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  metadataText: {
    ...typography.bodyMedium,
    color: colors.neutral[700],
    marginLeft: spacing.sm,
  },
  viewMapText: {
    ...typography.labelMedium,
    color: colors.primary[500],
  },
  severityCard: {
    margin: spacing.md,
  },
  sectionTitle: {
    ...typography.headingSmall,
    color: colors.neutral[800],
    marginBottom: spacing.md,
  },
  severityDescription: {
    ...typography.bodyMedium,
    color: colors.neutral[700],
    marginTop: spacing.md,
  },
  recommendationsCard: {
    margin: spacing.md,
    marginTop: 0,
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  recommendationBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  bulletText: {
    ...typography.labelSmall,
    color: colors.primary[700],
  },
  recommendationText: {
    ...typography.bodyMedium,
    color: colors.neutral[800],
    flex: 1,
  },
  nutrientsCard: {
    margin: spacing.md,
    marginTop: 0,
  },
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.md,
  },
  nutrientItem: {
    alignItems: 'center',
    flex: 1,
  },
  nutrientValue: {
    ...typography.headingMedium,
    color: colors.primary[600],
  },
  nutrientLabel: {
    ...typography.labelSmall,
    color: colors.neutral[600],
    marginTop: spacing.xxs,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: spacing.md,
    marginTop: 0,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
});