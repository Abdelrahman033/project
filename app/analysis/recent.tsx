import React, { useState, useRef, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Animated, Platform, Pressable } from 'react-native';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { colors, spacing, typography } from '@/theme';
import { Search, Filter, ChevronDown, ChevronUp, Download, Share2, Calendar } from 'lucide-react-native';
import { SeverityIndicator } from '@/components/SeverityIndicator';

// Types
interface FilterButtonProps {
  label: string;
  active: boolean;
  onPress: () => void;
  icon?: React.ComponentType<{ size: number; color: string; style?: any }>;
}

type SeverityLevel = 'high' | 'medium' | 'low';

interface Analysis {
  id: string;
  diseaseType: string;
  severity: SeverityLevel;
  date: string;
  location: string;
  health: number;
  nutrients: Record<string, number>;
  recommendations: string[];
}

interface AnalysisCardProps {
  analysis: Analysis;
  onSchedule: (analysis: Analysis) => void;
  onDownload: (analysis: Analysis) => void;
  onShare: (analysis: Analysis) => void;
}

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// Reusable filter button component with press animation
const FilterButton: React.FC<FilterButtonProps> = ({ label, active, onPress, icon: Icon }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [scaleAnim]);

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View
        style={[
          styles.filterButton,
          active && styles.filterButtonActive,
          { transform: [{ scale: scaleAnim }] }
        ]}
      >
        {Icon && <Icon size={16} color={active ? colors.white : colors.neutral[600]} style={styles.filterIcon} />}
        <Text style={[styles.filterButtonText, active && styles.filterButtonTextActive]}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

// Reusable analysis card component with enhanced animations
const AnalysisCard: React.FC<AnalysisCardProps> = ({ analysis, onSchedule, onDownload, onShare }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const expandAnim = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(1)).current;

  const toggleExpand = useCallback(() => {
    const toValue = isExpanded ? 0 : 1;
    Animated.spring(expandAnim, {
      toValue,
      useNativeDriver: false,
      tension: 40,
      friction: 7,
    }).start();
    setIsExpanded(!isExpanded);
  }, [isExpanded, expandAnim]);

  const handlePressIn = useCallback(() => {
    Animated.spring(cardScale, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [cardScale]);

  const handlePressOut = useCallback(() => {
    Animated.spring(cardScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [cardScale]);

  const severityMap: Record<SeverityLevel, number> = {
    high: 3,
    medium: 2,
    low: 1
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={{ transform: [{ scale: cardScale }] }}>
        <Card style={styles.analysisCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitle}>
              <Text style={styles.diseaseType}>{analysis.diseaseType}</Text>
              <SeverityIndicator level={severityMap[analysis.severity]} />
            </View>
            <View style={styles.cardActions}>
              <TouchableOpacity 
                onPress={() => onDownload(analysis)} 
                style={styles.actionButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Download size={20} color={colors.neutral[600]} />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => onShare(analysis)} 
                style={styles.actionButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Share2 size={20} color={colors.neutral[600]} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.cardMeta}>
            <Text style={styles.date}>
              {formatDate(analysis.date)}
            </Text>
            <Text style={styles.location}>{analysis.location}</Text>
          </View>

          <View style={styles.cardContent}>
            <View style={styles.healthSection}>
              <Text style={styles.sectionTitle}>Soil Health</Text>
              <Text style={styles.healthValue}>{analysis.health}%</Text>
            </View>

            <View style={styles.nutrientsSection}>
              <Text style={styles.sectionTitle}>Key Nutrients</Text>
              <View style={styles.nutrientsList}>
                {Object.entries(analysis.nutrients).map(([key, value]) => (
                  <View key={key} style={styles.nutrientItem}>
                    <Text style={styles.nutrientLabel}>{key}</Text>
                    <Text style={styles.nutrientValue}>{value}%</Text>
                  </View>
                ))}
              </View>
            </View>

            <TouchableOpacity 
              onPress={toggleExpand} 
              style={styles.recommendationsHeader}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.sectionTitle}>Recommendations</Text>
              <Animated.View style={{
                transform: [{
                  rotate: expandAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '180deg']
                  })
                }]
              }}>
                <ChevronDown size={20} color={colors.neutral[600]} />
              </Animated.View>
            </TouchableOpacity>

            <Animated.View style={[
              styles.recommendationsContent,
              {
                maxHeight: expandAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 200],
                }),
                opacity: expandAnim,
              }
            ]}>
              {analysis.recommendations.map((rec, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <Text style={styles.recommendationText}>{rec}</Text>
                </View>
              ))}
            </Animated.View>

            <TouchableOpacity 
              onPress={() => onSchedule(analysis)} 
              style={styles.scheduleButton}
              activeOpacity={0.8}
            >
              <Calendar size={20} color={colors.white} style={styles.scheduleIcon} />
              <Text style={styles.scheduleButtonText}>Schedule Follow-up</Text>
            </TouchableOpacity>
          </View>
        </Card>
      </Animated.View>
    </Pressable>
  );
};

export default function RecentAnalysesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState<SeverityLevel | 'all'>('all');
  const [sortBy, setSortBy] = useState('date');

  // Mock data
  const mockAnalyses: Analysis[] = useMemo(() => [
    {
      id: '1',
      diseaseType: 'Nitrogen Deficiency',
      severity: 'high',
      date: '2024-03-15',
      location: 'Field A',
      health: 65,
      nutrients: {
        Nitrogen: 30,
        Phosphorus: 75,
        Potassium: 80,
      },
      recommendations: [
        'Apply nitrogen-rich fertilizer',
        'Monitor soil moisture levels',
        'Consider crop rotation',
      ],
    },
    {
      id: '2',
      diseaseType: 'Phosphorus Deficiency',
      severity: 'medium',
      date: '2024-03-14',
      location: 'Field B',
      health: 75,
      nutrients: {
        Nitrogen: 85,
        Phosphorus: 35,
        Potassium: 90,
      },
      recommendations: [
        'Apply phosphate fertilizer',
        'Maintain soil pH between 6.0 and 7.0',
        'Consider organic phosphate sources',
      ],
    },
    // Add more mock data as needed
  ], []);

  // Filter and sort analyses
  const filteredAnalyses = useMemo(() => 
    mockAnalyses
      .filter(analysis => {
        if (activeFilter === 'all') return true;
        return analysis.severity === activeFilter;
      })
      .sort((a, b) => {
        if (sortBy === 'date') {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        return 0;
      }),
    [mockAnalyses, activeFilter, sortBy]
  );

  // Handlers
  const handleSchedule = useCallback((analysis: Analysis) => {
    // Implement schedule logic
    console.log('Schedule analysis:', analysis);
  }, []);

  const handleDownload = useCallback((analysis: Analysis) => {
    // Implement download logic
    console.log('Download analysis:', analysis);
  }, []);

  const handleShare = useCallback((analysis: Analysis) => {
    // Implement share logic
    console.log('Share analysis:', analysis);
  }, []);

  return (
    <View style={styles.container}>
      <Header title="Recent Analyses" showBackButton />
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={colors.neutral[400]} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search analyses..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.neutral[400]}
          />
        </View>
        <TouchableOpacity 
          style={styles.filterToggleButton}
          onPress={() => setShowFilters(!showFilters)}
          activeOpacity={0.7}
        >
          <Filter size={20} color={colors.neutral[600]} />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersScroll}
          >
            <FilterButton
              label="All"
              active={activeFilter === 'all'}
              onPress={() => setActiveFilter('all')}
            />
            <FilterButton
              label="High Severity"
              active={activeFilter === 'high'}
              onPress={() => setActiveFilter('high')}
            />
            <FilterButton
              label="Medium Severity"
              active={activeFilter === 'medium'}
              onPress={() => setActiveFilter('medium')}
            />
            <FilterButton
              label="Low Severity"
              active={activeFilter === 'low'}
              onPress={() => setActiveFilter('low')}
            />
          </ScrollView>

          <View style={styles.sortContainer}>
            <Text style={styles.sortLabel}>Sort by:</Text>
            <FilterButton
              label="Date"
              active={sortBy === 'date'}
              onPress={() => setSortBy('date')}
            />
            <FilterButton
              label="Severity"
              active={sortBy === 'severity'}
              onPress={() => setSortBy('severity')}
            />
          </View>
        </View>
      )}

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredAnalyses.map((analysis) => (
          <AnalysisCard
            key={analysis.id}
            analysis={analysis}
            onSchedule={handleSchedule}
            onDownload={handleDownload}
            onShare={handleShare}
          />
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.sm,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.md,
    height: 44,
    ...Platform.select({
      ios: {
        shadowColor: colors.neutral[900],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.neutral[800],
    padding: 0,
  },
  filterToggleButton: {
    width: 44,
    height: 44,
    borderRadius: spacing.sm,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.neutral[900],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  filtersContainer: {
    backgroundColor: colors.white,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  filtersScroll: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.xl,
    backgroundColor: colors.neutral[100],
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  filterButtonActive: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  filterIcon: {
    marginRight: spacing.xs,
  },
  filterButtonText: {
    ...typography.labelMedium,
    color: colors.neutral[600],
  },
  filterButtonTextActive: {
    color: colors.white,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  sortLabel: {
    ...typography.labelMedium,
    color: colors.neutral[600],
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
  },
  analysisCard: {
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  diseaseType: {
    ...typography.headingSmall,
    color: colors.neutral[800],
  },
  cardActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    padding: spacing.xs,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  date: {
    ...typography.bodySmall,
    color: colors.neutral[600],
  },
  location: {
    ...typography.bodySmall,
    color: colors.neutral[600],
  },
  cardContent: {
    gap: spacing.md,
  },
  healthSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  sectionTitle: {
    ...typography.labelLarge,
    color: colors.neutral[800],
  },
  healthValue: {
    ...typography.headingMedium,
    color: colors.primary[500],
  },
  nutrientsSection: {
    paddingVertical: spacing.sm,
  },
  nutrientsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  nutrientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  nutrientLabel: {
    ...typography.bodySmall,
    color: colors.neutral[600],
  },
  nutrientValue: {
    ...typography.bodyMedium,
    color: colors.neutral[800],
    fontWeight: '600',
  },
  recommendationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  recommendationsContent: {
    overflow: 'hidden',
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  recommendationText: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.neutral[700],
    lineHeight: 24,
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary[500],
    padding: spacing.md,
    borderRadius: spacing.sm,
    marginTop: spacing.sm,
  },
  scheduleIcon: {
    marginRight: spacing.sm,
  },
  scheduleButtonText: {
    ...typography.labelLarge,
    color: colors.white,
  },
}); 