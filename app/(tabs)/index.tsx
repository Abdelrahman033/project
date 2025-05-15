import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, RefreshControl, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { SeverityIndicator } from '@/components/SeverityIndicator';
import { AnalysisCard } from '@/components/AnalysisCard';
import { WeatherCard } from '@/components/WeatherCard';
import { SensorReadings } from '@/components/SensorReadings';
import { colors, spacing, typography } from '@/theme';
import { useRouter, Href } from 'expo-router';
import { SoilAnalysisResult } from '@/types';
import { Camera, BarChart2, AlertCircle, Calendar, MapPin, TrendingUp, Sun, Cloud, Droplets, Clock, Settings, User } from 'lucide-react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import { useUser } from '@/contexts/UserContext';

// Types
interface UserProfile {
  name: string;
  farmName: string;
  location: string;
  lastVisit: string;
  profileImageUrl?: string;
}

interface FarmHealthMetrics {
  totalScans: number;
  activeAlerts: number;
  averageScanInterval: number;
  lastScanDate: string;
  weeklyScans: number[];
  nutrientLevels: {
    labels: string[];
    datasets: {
      data: number[];
    }[];
  };
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: '/scan' | '/recent' | '/help' | '/privacy' | '/' | '/settings' | '/profile/settings';
  color: string;
}

// Constants
const MOCK_USER: UserProfile = {
  name: 'John Doe',
  farmName: 'Green Valley Farm',
  location: 'Northern California',
  lastVisit: '2 days ago'
};

const MOCK_FARM_HEALTH: FarmHealthMetrics = {
  totalScans: 5,
  activeAlerts: 1,
  averageScanInterval: 3,
  lastScanDate: '2 days ago',
  weeklyScans: [2, 3, 1, 4, 2, 3, 2],
  nutrientLevels: {
    labels: ['N', 'P', 'K', 'pH', 'OM'],
    datasets: [
      {
        data: [12, 9, 18, 6.2, 3.4]
      }
    ]
  }
};

const quickActions: QuickAction[] = [
  {
    id: '1',
    title: 'New Scan',
    description: 'Analyze soil health',
    icon: 'camera',
    route: '/scan',
    color: colors.primary[500]
  },
  {
    id: '2',
    title: 'History',
    description: 'View past analyses',
    icon: 'clock',
    route: '/recent',
    color: colors.warning[500]
  },
  {
    id: '3',
    title: 'Settings',
    description: 'Advanced settings',
    icon: 'settings',
    route: '/profile/settings',
    color: colors.neutral[700]
  }
];

// Mock data moved to a separate file in a real application
const MOCK_ANALYSES: SoilAnalysisResult[] = [
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

// Components
const WelcomeBanner = () => {
  const { user } = useUser();
  const router = useRouter();
  
  return (
    <View style={styles.welcomeSection}>
      <View style={styles.welcomeHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.nameText}>{user?.name || 'Guest'}</Text>
          {user?.farmName && (
            <Text style={styles.farmText}>{user.farmName}</Text>
          )}
          {user?.location && (
            <View style={styles.locationContainer}>
              <MapPin size={16} color={colors.white} />
              <Text style={styles.locationText}>{user.location}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => router.push('/profile')}
          activeOpacity={0.8}
        >
          <View style={styles.avatarShadow}>
            <User size={28} color={colors.white} />
          </View>
        </TouchableOpacity>
      </View>
      
      <View style={styles.quickStats}>
        <View style={styles.statItem}>
          <Sun size={22} color={colors.white} />
          <Text style={styles.statValue}>28°C</Text>
          <Text style={styles.statLabel}>Temperature</Text>
        </View>
        <View style={styles.statItem}>
          <Cloud size={22} color={colors.white} />
          <Text style={styles.statValue}>65%</Text>
          <Text style={styles.statLabel}>Humidity</Text>
        </View>
        <View style={styles.statItem}>
          <Droplets size={22} color={colors.white} />
          <Text style={styles.statValue}>Good</Text>
          <Text style={styles.statLabel}>Soil Moisture</Text>
        </View>
      </View>
    </View>
  );
};

const QuickActions = ({ actions }: { actions: QuickAction[] }) => {
  const router = useRouter();
  
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'camera':
        return <Camera size={28} color={colors.primary[500]} />;
      case 'clock':
        return <Clock size={28} color={colors.warning[500]} />;
      case 'settings':
        return <Settings size={28} color={colors.neutral[700]} />;
      default:
        return null;
    }
  };
  
  return (
    <View style={styles.quickActionsRow}>
      {actions.map((action) => (
        <TouchableOpacity
          key={action.id}
          style={styles.quickActionCard}
          onPress={() => router.push(action.route)}
          activeOpacity={0.85}
        >
          <View style={[styles.quickActionIconWrap, { backgroundColor: action.color + '22' }]}> 
            {getIcon(action.icon)}
          </View>
          <Text style={styles.quickActionTitle}>{action.title}</Text>
          <Text style={styles.quickActionDesc}>{action.description}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const FarmHealthSummary = ({ metrics }: { metrics: FarmHealthMetrics }) => {
  return (
    <Card style={styles.farmHealthCard}>
      <View style={styles.healthHeaderRow}>
        <Text style={styles.healthTitle}>Farm Health</Text>
        <View style={styles.lastScanBadge}>
          <Clock size={14} color={colors.primary[500]} />
          <Text style={styles.lastScanText}>Last Scan: {metrics.lastScanDate}</Text>
        </View>
      </View>
      <View style={styles.healthChartsRow}>
        <View style={styles.chartBlock}>
          <Text style={styles.chartLabel}>Weekly Scans</Text>
          <BarChart
            data={{
              labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
              datasets: [{ data: metrics.weeklyScans }],
            }}
            width={140}
            height={80}
            yAxisLabel={''}
            yAxisSuffix={''}
            chartConfig={{
              backgroundGradientFrom: colors.white,
              backgroundGradientTo: colors.white,
              fillShadowGradient: colors.primary[500],
              fillShadowGradientOpacity: 0.2,
              color: () => colors.primary[500],
              labelColor: () => colors.neutral[500],
              barPercentage: 0.6,
            }}
            style={styles.chartStyle}
            withInnerLines={false}
            withHorizontalLabels={false}
            fromZero
          />
        </View>
        <View style={styles.chartDivider} />
        <View style={styles.chartBlock}>
          <Text style={styles.chartLabel}>Nutrients</Text>
          <LineChart
            data={metrics.nutrientLevels}
            width={140}
            height={80}
            yAxisLabel={''}
            chartConfig={{
              backgroundGradientFrom: colors.white,
              backgroundGradientTo: colors.white,
              color: () => colors.success[500],
              labelColor: () => colors.neutral[500],
              propsForDots: { r: '3', strokeWidth: '2', stroke: colors.success[500] },
            }}
            style={styles.chartStyle}
            withInnerLines={false}
            withHorizontalLabels={false}
            fromZero
          />
        </View>
      </View>
    </Card>
  );
};

const HealthStat = ({ value, label }: { value: number; label: string }) => (
  <View style={styles.healthStat}>
    <Text style={styles.healthStatValue}>{value}</Text>
    <Text style={styles.healthStatLabel}>{label}</Text>
  </View>
);

const MoistureStatusBar = ({ value, label, color }: { value: number; label: string; color: string }) => (
  <View style={styles.moistureBarContainer}>
    <View style={styles.moistureBarHeader}>
      <Text style={styles.moistureBarLabel}>{label}</Text>
      <Text style={styles.moistureBarValue}>{value}%</Text>
    </View>
    <View style={styles.moistureBarBackground}>
      <View 
        style={[
          styles.moistureBarFill, 
          { 
            width: `${value}%`,
            backgroundColor: color
          }
        ]} 
      />
    </View>
  </View>
);

const CircularProgress = ({ value, label, color }: { value: number; label: string; color: string }) => {
  const size = 80;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = value / 100;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View style={styles.circularProgressContainer}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.neutral[200]}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <SvgText
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          alignmentBaseline="middle"
          fill={colors.neutral[800]}
          fontSize="16"
          fontWeight="bold"
        >
          {value}%
        </SvgText>
      </Svg>
      <Text style={styles.circularProgressLabel}>{label}</Text>
    </View>
  );
};

const MoistureIndicators = () => (
  <Card style={styles.moistureIndicatorsCard}>
    <Text style={styles.moistureIndicatorsTitle}>Moisture & Humidity</Text>
    <View style={styles.moistureIndicatorsGrid}>
      <CircularProgress 
        value={68} 
        label="Soil Moisture" 
        color={colors.success[500]} 
      />
      <CircularProgress 
        value={55} 
        label="Air Humidity" 
        color={colors.primary[500]} 
      />
      <CircularProgress 
        value={75} 
        label="Water Level" 
        color={colors.primary[400]} 
      />
    </View>
  </Card>
);

const RecentAnalyses = ({ analyses, onAnalysisPress }: { 
  analyses: SoilAnalysisResult[]; 
  onAnalysisPress: (id: string) => void;
}) => {
  const router = useRouter();
  return (
    <View style={styles.recentAnalysesSection}>
      <View style={styles.recentHeaderRow}>
        <Text style={styles.sectionTitle}>Recent Analyses</Text>
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() => router.push('/recent')}
          activeOpacity={0.8}
        >
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.analysesCarousel}>
        {analyses.map((analysis) => (
          <TouchableOpacity
            key={analysis.id}
            style={styles.analysisCardWrap}
            activeOpacity={0.92}
            onPress={() => onAnalysisPress(analysis.id)}
          >
            <View style={styles.analysisCardEnhanced}>
              <Image source={{ uri: analysis.imageUrl }} style={styles.analysisImageEnhanced} />
              <View style={styles.analysisBadgeRow}>
                <View style={[styles.healthBadge, { backgroundColor: analysis.soilHealth === 'good' ? colors.success[100] : analysis.soilHealth === 'fair' ? colors.warning[100] : colors.error[100] }]}> 
                  <Text style={[styles.healthText, { color: analysis.soilHealth === 'good' ? colors.success[700] : analysis.soilHealth === 'fair' ? colors.warning[700] : colors.error[700] }]}> 
                    {analysis.soilHealth.charAt(0).toUpperCase() + analysis.soilHealth.slice(1)}
                  </Text>
                </View>
                {!analysis.isSynced && (
                  <View style={styles.offlineBadge}><Text style={styles.offlineBadgeText}>Offline</Text></View>
                )}
              </View>
              <View style={styles.analysisContentEnhanced}>
                <Text style={styles.diseaseType}>{analysis.disease.type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</Text>
                <View style={styles.analysisMetaRow}>
                  <Text style={styles.analysisDate}>{new Date(analysis.timestamp).toLocaleDateString()}</Text>
                  <Text style={styles.analysisConfidence}>{Math.round(analysis.disease.confidence * 100)}% conf.</Text>
                </View>
                <View style={styles.nutrientGridEnhanced}>
                  <View style={styles.nutrientItem}><Text style={styles.nutrientLabel}>N</Text><Text style={styles.nutrientValue}>{analysis.nutrients.nitrogen}</Text></View>
                  <View style={styles.nutrientItem}><Text style={styles.nutrientLabel}>P</Text><Text style={styles.nutrientValue}>{analysis.nutrients.phosphorus}</Text></View>
                  <View style={styles.nutrientItem}><Text style={styles.nutrientLabel}>K</Text><Text style={styles.nutrientValue}>{analysis.nutrients.potassium}</Text></View>
                  <View style={styles.nutrientItem}><Text style={styles.nutrientLabel}>pH</Text><Text style={styles.nutrientValue}>{analysis.nutrients.ph}</Text></View>
                </View>
                <Text style={styles.recommendationText} numberOfLines={2}>{analysis.recommendations[0]}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleAnalysisPress = (analysisId: string) => {
    router.push(`/analysis/${analysisId}`);
  };
  
  const handleRefresh = React.useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={colors.primary[500]} />
        }
        showsVerticalScrollIndicator={false}
      >
        <WelcomeBanner />
        
        <View style={styles.mainContent}>
          <QuickActions actions={quickActions} />
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today's Overview</Text>
            <View style={styles.overviewGrid}>
              <WeatherCard />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Farm Health</Text>
            <FarmHealthSummary metrics={MOCK_FARM_HEALTH} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sensor Readings</Text>
            <SensorReadings 
              soilMoisture={68}
              airHumidity={55}
              temperature={28}
              windSpeed={12}
            />
          </View>
          
          <View style={styles.section}>
            <RecentAnalyses 
              analyses={MOCK_ANALYSES} 
              onAnalysisPress={handleAnalysisPress}
            />
          </View>
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
  scrollContent: {
    paddingBottom: spacing.lg,
  },
  welcomeSection: {
    padding: spacing.md,
    paddingTop: spacing.lg,
    backgroundColor: colors.primary[500],
    borderBottomLeftRadius: spacing.lg,
    borderBottomRightRadius: spacing.lg,
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  welcomeText: {
    ...typography.bodyLarge,
    color: colors.white,
    opacity: 0.9,
  },
  nameText: {
    ...typography.headingLarge,
    color: colors.white,
    fontSize: 32,
  },
  farmInfo: {
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  farmText: {
    ...typography.headingMedium,
    color: colors.white,
    opacity: 0.9,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xxs,
  },
  locationText: {
    ...typography.bodyMedium,
    color: colors.white,
    opacity: 0.9,
    marginLeft: spacing.xxs,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: colors.white,
    elevation: 2,
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarShadow: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  mainContent: {
    padding: spacing.md,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.headingSmall,
    color: colors.neutral[800],
    marginBottom: spacing.sm,
  },
  overviewGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  quickActionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
    backgroundColor: colors.white,
    borderRadius: spacing.sm,
    padding: spacing.md,
    gap: spacing.sm,
  },
  quickActionCard: {
    flex: 1,
    alignItems: "center",
    padding: spacing.sm,
    backgroundColor: colors.neutral[50],
    borderRadius: spacing.sm,
    gap: spacing.xs,
  },
  quickActionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  quickActionTitle: {
    ...typography.labelMedium,
    color: colors.neutral[800],
    textAlign: "center",
  },
  quickActionDesc: {
    ...typography.bodySmall,
    color: colors.neutral[600],
    textAlign: "center",
  },
  healthCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  healthCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  healthCardTitle: {
    ...typography.headingSmall,
    color: colors.neutral[800],
  },
  lastScanText: {
    ...typography.bodySmall,
    color: colors.neutral[600],
  },
  healthStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
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
  recentAnalysesSection: {
    marginTop: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionSubtitle: {
    ...typography.bodySmall,
    color: colors.neutral[600],
    marginTop: spacing.xxs,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    padding: spacing.xs,
    borderRadius: spacing.sm,
    backgroundColor: colors.primary[50],
  },
  viewAllText: {
    ...typography.labelMedium,
    color: colors.primary[500],
  },
  analysesGrid: {
    gap: spacing.md,
  },
  analysisCard: {
    backgroundColor: colors.white,
    borderRadius: spacing.md,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  analysisImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  analysisContent: {
    padding: spacing.md,
  },
  analysisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  analysisStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  analysisDate: {
    ...typography.labelSmall,
    color: colors.neutral[600],
  },
  healthBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: spacing.sm,
  },
  healthText: {
    ...typography.labelSmall,
    fontWeight: '600',
  },
  diseaseType: {
    ...typography.headingSmall,
    color: colors.neutral[800],
    marginBottom: spacing.sm,
  },
  nutrientGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.neutral[50],
    borderRadius: spacing.sm,
    padding: spacing.sm,
  },
  nutrientItem: {
    alignItems: 'center',
    flex: 1,
  },
  nutrientLabel: {
    ...typography.labelSmall,
    color: colors.neutral[600],
    marginBottom: spacing.xxs,
  },
  nutrientValue: {
    ...typography.headingSmall,
    color: colors.primary[500],
  },
  moistureCard: {
    flex: 1,
    padding: spacing.md,
  },
  moistureTitle: {
    ...typography.labelLarge,
    color: colors.neutral[800],
    marginBottom: spacing.sm,
  },
  moistureContent: {
    gap: spacing.sm,
  },
  moistureBarContainer: {
    marginBottom: spacing.xs,
  },
  moistureBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xxs,
  },
  moistureBarLabel: {
    ...typography.labelSmall,
    color: colors.neutral[700],
  },
  moistureBarValue: {
    ...typography.labelSmall,
    color: colors.neutral[800],
    fontWeight: '600',
  },
  moistureBarBackground: {
    height: 6,
    backgroundColor: colors.neutral[200],
    borderRadius: 3,
    overflow: 'hidden',
  },
  moistureBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  moistureIndicatorsCard: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: spacing.md,
    elevation: 2,
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  moistureIndicatorsTitle: {
    ...typography.labelLarge,
    color: colors.neutral[800],
    marginBottom: spacing.sm,
  },
  moistureIndicatorsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  circularProgressContainer: {
    alignItems: "center",
    flex: 1,
    padding: spacing.sm,
    backgroundColor: colors.neutral[50],
    borderRadius: spacing.sm,
  },
  circularProgressLabel: {
    ...typography.labelSmall,
    color: colors.neutral[700],
    marginTop: spacing.xs,
    textAlign: "center",
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: spacing.sm,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    ...typography.headingSmall,
    color: colors.primary[500],
    marginTop: spacing.xxs,
  },
  statLabel: {
    ...typography.labelSmall,
    color: colors.neutral[600],
    marginTop: spacing.xxs,
  },
  chartContainer: {
    marginVertical: spacing.sm,
  },
  chartTitle: {
    ...typography.labelLarge,
    color: colors.neutral[800],
    marginBottom: spacing.xs,
  },
  chart: {
    marginVertical: spacing.xs,
    borderRadius: spacing.sm,
  },
  farmHealthCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  healthHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  healthTitle: {
    ...typography.headingSmall,
    color: colors.neutral[800],
  },
  lastScanBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    padding: spacing.xs,
    borderRadius: spacing.sm,
    backgroundColor: colors.primary[50],
  },
  healthChartsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chartBlock: {
    flex: 1,
    alignItems: 'center',
  },
  chartLabel: {
    ...typography.labelMedium,
    color: colors.neutral[800],
    marginBottom: spacing.xs,
  },
  chartDivider: {
    width: 1,
    height: '100%',
    backgroundColor: colors.neutral[200],
  },
  chartStyle: {
    marginVertical: spacing.xs,
    borderRadius: spacing.sm,
  },
  analysesCarousel: {
    gap: spacing.md,
  },
  analysisCardWrap: {
    width: 220,
    marginRight: spacing.md,
  },
  analysisCardEnhanced: {
    backgroundColor: colors.white,
    borderRadius: spacing.md,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    marginBottom: spacing.sm,
  },
  analysisImageEnhanced: {
    width: '100%',
    height: 90,
    borderTopLeftRadius: spacing.md,
    borderTopRightRadius: spacing.md,
  },
  analysisBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    marginTop: -spacing.md,
    zIndex: 2,
  },
  offlineBadge: {
    backgroundColor: colors.warning[500],
    borderRadius: spacing.xs,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  offlineBadgeText: {
    ...typography.labelSmall,
    color: colors.white,
  },
  analysisContentEnhanced: {
    padding: spacing.md,
  },
  analysisMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  analysisConfidence: {
    ...typography.bodySmall,
    color: colors.neutral[500],
  },
  nutrientGridEnhanced: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.neutral[50],
    borderRadius: spacing.sm,
    padding: spacing.xs,
    marginVertical: spacing.xs,
  },
  recommendationText: {
    ...typography.bodySmall,
    color: colors.neutral[700],
    marginTop: spacing.xs,
  },
  recentHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    paddingRight: spacing.sm,
  },
});