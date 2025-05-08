import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { SeverityIndicator } from '@/components/SeverityIndicator';
import { AnalysisCard } from '@/components/AnalysisCard';
import { colors, spacing, typography } from '@/theme';
import { useRouter } from 'expo-router';
import { SoilAnalysisResult } from '@/types';
import { Bell, PlusCircle, Clock, Filter } from 'lucide-react-native';

// Mock data for demonstration
const mockUser = {
  name: 'John Doe',
  farmName: 'Green Valley Farm',
};

const mockAnalyses: SoilAnalysisResult[] = [
  {
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
  {
    id: '2',
    userId: 'user1',
    farmId: 'farm1',
    imageUrl: 'https://images.pexels.com/photos/7728332/pexels-photo-7728332.jpeg',
    timestamp: Date.now() - 86400000 * 5, // 5 days ago
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
  {
    id: '3',
    userId: 'user1',
    farmId: 'farm1',
    imageUrl: 'https://images.pexels.com/photos/5474600/pexels-photo-5474600.jpeg',
    timestamp: Date.now() - 86400000 * 1, // 1 day ago
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
];

export default function DashboardScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  
  const handleNotificationsPress = () => {
    // Handle notifications
    console.log('Notifications pressed');
  };
  
  const handleNewScanPress = () => {
    router.push('/(tabs)/scan');
  };
  
  const handleRecentRecordsPress = () => {
    router.push('/(tabs)/recent');
  };
  
  const handleAnalysisPress = (analysisId: string) => {
    router.push(`/analysis/${analysisId}`);
  };
  
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    
    // Simulate fetching new data
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <Header 
        title="Dashboard"
        showNotifications
        onNotificationsPress={handleNotificationsPress}
      />
      
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.nameText}>{mockUser.name}</Text>
          <Text style={styles.farmText}>{mockUser.farmName}</Text>
        </View>
        
        <View style={styles.actionSection}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleNewScanPress}
          >
            <PlusCircle size={24} color={colors.primary[500]} />
            <Text style={styles.actionButtonText}>New Scan</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleRecentRecordsPress}
          >
            <Clock size={24} color={colors.primary[500]} />
            <Text style={styles.actionButtonText}>Recent Records</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {}}
          >
            <Filter size={24} color={colors.primary[500]} />
            <Text style={styles.actionButtonText}>Filter</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Farm Health Summary</Text>
          
          <Card style={styles.healthCard}>
            <View style={styles.healthCardHeader}>
              <Text style={styles.healthCardTitle}>Overall Soil Health</Text>
              <Text style={styles.healthCardRating}>Good</Text>
            </View>
            
            <SeverityIndicator 
              level={2} 
              type="horizontal"
              size="large"
              showLabel={false}
            />
            
            <View style={styles.healthStatsContainer}>
              <View style={styles.healthStat}>
                <Text style={styles.healthStatValue}>5</Text>
                <Text style={styles.healthStatLabel}>Total Scans</Text>
              </View>
              
              <View style={styles.healthStat}>
                <Text style={styles.healthStatValue}>1</Text>
                <Text style={styles.healthStatLabel}>Alerts</Text>
              </View>
              
              <View style={styles.healthStat}>
                <Text style={styles.healthStatValue}>3</Text>
                <Text style={styles.healthStatLabel}>Days Avg</Text>
              </View>
            </View>
          </Card>
        </View>
        
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Analyses</Text>
          </View>
          
          {mockAnalyses.map((analysis) => (
            <AnalysisCard 
              key={analysis.id}
              analysis={analysis}
              onPress={() => handleAnalysisPress(analysis.id)}
            />
          ))}
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
  welcomeSection: {
    padding: spacing.md,
    paddingTop: spacing.lg,
    backgroundColor: colors.primary[500],
  },
  welcomeText: {
    ...typography.bodyMedium,
    color: colors.white,
    opacity: 0.9,
  },
  nameText: {
    ...typography.headingLarge,
    color: colors.white,
    marginBottom: spacing.xxs,
  },
  farmText: {
    ...typography.bodyLarge,
    color: colors.white,
    opacity: 0.9,
  },
  actionSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.white,
    marginTop: -spacing.md,
    borderRadius: spacing.md,
    marginHorizontal: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  actionButtonText: {
    ...typography.labelMedium,
    color: colors.neutral[700],
    marginTop: spacing.xs,
  },
  summarySection: {
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  sectionTitle: {
    ...typography.headingSmall,
    color: colors.neutral[800],
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  healthCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary[500],
    padding: spacing.md,
  },
  healthCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  healthCardTitle: {
    ...typography.labelLarge,
    color: colors.neutral[800],
  },
  healthCardRating: {
    ...typography.labelLarge,
    color: colors.success[500],
    fontWeight: 'bold',
  },
  healthStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  healthStat: {
    alignItems: 'center',
    flex: 1,
  },
  healthStatValue: {
    ...typography.headingMedium,
    color: colors.primary[500],
  },
  healthStatLabel: {
    ...typography.bodySmall,
    color: colors.neutral[600],
    marginTop: spacing.xxs,
  },
  recentSection: {
    padding: spacing.md,
    marginTop: spacing.sm,
  },
});