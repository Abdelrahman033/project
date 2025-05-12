import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, TextInput, Dimensions, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '@/components/Card';
import { SeverityIndicator } from '@/components/SeverityIndicator';
import { colors, spacing, typography } from '@/theme';
import { SoilAnalysisResult } from '@/types';
import { Filter, SortAsc, SortDesc, Calendar, MapPin, ArrowLeft, BarChart2, Search, X, ChevronDown, Download, Share2, Clock } from 'lucide-react-native';

// Mock data (in a real app, this would come from an API or database)
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
  {
    id: '3',
    userId: 'user1',
    farmId: 'farm1',
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
  }
];

type SortOption = 'date' | 'severity' | 'health';
type SortOrder = 'asc' | 'desc';
type FilterOption = 'all' | 'good' | 'fair' | 'poor';

export default function RecentPage() {
  const router = useRouter();
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filter, setFilter] = useState<FilterOption>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSchedule, setShowSchedule] = useState(false);

  const sortedAndFilteredAnalyses = MOCK_ANALYSES
    .filter(analysis => {
      const matchesFilter = filter === 'all' || analysis.soilHealth === filter;
      const matchesSearch = searchQuery === '' || 
        analysis.disease.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        analysis.soilHealth.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? a.timestamp - b.timestamp 
          : b.timestamp - a.timestamp;
      }
      if (sortBy === 'severity') {
        return sortOrder === 'asc'
          ? a.disease.severity - b.disease.severity
          : b.disease.severity - a.disease.severity;
      }
      const healthOrder = { good: 3, fair: 2, poor: 1 };
      return sortOrder === 'asc'
        ? healthOrder[a.soilHealth] - healthOrder[b.soilHealth]
        : healthOrder[b.soilHealth] - healthOrder[a.soilHealth];
    });

  const handleAnalysisPress = (analysisId: string) => {
    router.push(`/analysis/${analysisId}`);
  };

  const handleShare = (analysis: SoilAnalysisResult) => {
    // Implement share functionality
    console.log('Share analysis:', analysis.id);
  };

  const handleDownload = (analysis: SoilAnalysisResult) => {
    // Implement download functionality
    console.log('Download analysis:', analysis.id);
  };

  const handleSchedulePress = () => {
    setShowSchedule(true);
  };

  const handleScheduleClose = () => {
    setShowSchedule(false);
  };

  const handleScheduleConfirm = () => {
    // Implement schedule confirmation logic
    console.log('Schedule confirmed');
    setShowSchedule(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.neutral[800]} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Recent Analyses</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={handleSchedulePress}
          >
            <Clock size={24} color={colors.primary[500]} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Filter size={24} color={colors.primary[500]} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={colors.neutral[500]} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search analyses..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.neutral[500]}
          />
          {searchQuery !== '' && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <X size={20} color={colors.neutral[500]} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {showFilters && (
        <Card style={styles.filtersCard}>
          <View style={styles.filterSection}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterSectionTitle}>Sort By</Text>
              <TouchableOpacity
                style={styles.orderButton}
                onPress={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? (
                  <SortAsc size={20} color={colors.primary[500]} />
                ) : (
                  <SortDesc size={20} color={colors.primary[500]} />
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.sortButtons}>
              <TouchableOpacity
                style={[
                  styles.sortButton,
                  sortBy === 'date' && styles.sortButtonActive
                ]}
                onPress={() => setSortBy('date')}
              >
                <Calendar size={20} color={sortBy === 'date' ? colors.white : colors.neutral[800]} />
                <Text style={[
                  styles.sortButtonText,
                  sortBy === 'date' && styles.sortButtonTextActive
                ]}>Date</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.sortButton,
                  sortBy === 'severity' && styles.sortButtonActive
                ]}
                onPress={() => setSortBy('severity')}
              >
                <BarChart2 size={20} color={sortBy === 'severity' ? colors.white : colors.neutral[800]} />
                <Text style={[
                  styles.sortButtonText,
                  sortBy === 'severity' && styles.sortButtonTextActive
                ]}>Severity</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.sortButton,
                  sortBy === 'health' && styles.sortButtonActive
                ]}
                onPress={() => setSortBy('health')}
              >
                <MapPin size={20} color={sortBy === 'health' ? colors.white : colors.neutral[800]} />
                <Text style={[
                  styles.sortButtonText,
                  sortBy === 'health' && styles.sortButtonTextActive
                ]}>Health</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Filter By Health</Text>
            <View style={styles.filterButtons}>
              {['all', 'good', 'fair', 'poor'].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.filterButton,
                    filter === option && styles.filterButtonActive
                  ]}
                  onPress={() => setFilter(option as FilterOption)}
                >
                  <Text style={[
                    styles.filterButtonText,
                    filter === option && styles.filterButtonTextActive
                  ]}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Card>
      )}

      <Modal
        visible={showSchedule}
        transparent
        animationType="slide"
        onRequestClose={handleScheduleClose}
      >
        <View style={styles.modalOverlay}>
          <Card style={styles.scheduleModal}>
            <View style={styles.scheduleHeader}>
              <Text style={styles.scheduleTitle}>Schedule Analysis</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleScheduleClose}
              >
                <X size={24} color={colors.neutral[800]} />
              </TouchableOpacity>
            </View>

            <View style={styles.scheduleContent}>
              <Text style={styles.scheduleLabel}>Select Date and Time</Text>
              <View style={styles.dateTimeContainer}>
                <TouchableOpacity style={styles.dateTimeButton}>
                  <Calendar size={20} color={colors.primary[500]} />
                  <Text style={styles.dateTimeText}>Choose Date</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dateTimeButton}>
                  <Clock size={20} color={colors.primary[500]} />
                  <Text style={styles.dateTimeText}>Choose Time</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.scheduleLabel}>Location</Text>
              <TouchableOpacity style={styles.locationButton}>
                <MapPin size={20} color={colors.primary[500]} />
                <Text style={styles.locationText}>Select Location</Text>
              </TouchableOpacity>

              <Text style={styles.scheduleLabel}>Notes</Text>
              <TextInput
                style={styles.notesInput}
                placeholder="Add any additional notes..."
                multiline
                numberOfLines={4}
                placeholderTextColor={colors.neutral[500]}
              />
            </View>

            <View style={styles.scheduleActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={handleScheduleClose}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.confirmButton]}
                onPress={handleScheduleConfirm}
              >
                <Text style={styles.confirmButtonText}>Schedule</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>
      </Modal>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {sortedAndFilteredAnalyses.map((analysis) => (
          <Card key={analysis.id} style={styles.analysisCard}>
            <TouchableOpacity
              onPress={() => handleAnalysisPress(analysis.id)}
              style={styles.cardContent}
            >
              <View style={styles.imageContainer}>
                <Image 
                  source={{ uri: analysis.imageUrl }} 
                  style={styles.analysisImage}
                />
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

              <View style={styles.analysisContent}>
                <View style={styles.analysisHeader}>
                  <View style={styles.analysisStatus}>
                    <SeverityIndicator level={analysis.disease.severity} />
                    <Text style={styles.analysisDate}>
                      {new Date(analysis.timestamp).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleDownload(analysis)}
                    >
                      <Download size={20} color={colors.primary[500]} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleShare(analysis)}
                    >
                      <Share2 size={20} color={colors.primary[500]} />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <Text style={styles.diseaseType}>
                  {analysis.disease.type.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </Text>
                
                <View style={styles.nutrientGrid}>
                  <View style={styles.nutrientItem}>
                    <Text style={styles.nutrientLabel}>N</Text>
                    <Text style={styles.nutrientValue}>{analysis.nutrients.nitrogen}</Text>
                  </View>
                  <View style={styles.nutrientItem}>
                    <Text style={styles.nutrientLabel}>P</Text>
                    <Text style={styles.nutrientValue}>{analysis.nutrients.phosphorus}</Text>
                  </View>
                  <View style={styles.nutrientItem}>
                    <Text style={styles.nutrientLabel}>K</Text>
                    <Text style={styles.nutrientValue}>{analysis.nutrients.potassium}</Text>
                  </View>
                  <View style={styles.nutrientItem}>
                    <Text style={styles.nutrientLabel}>pH</Text>
                    <Text style={styles.nutrientValue}>{analysis.nutrients.ph}</Text>
                  </View>
                </View>

                <View style={styles.recommendations}>
                  <Text style={styles.recommendationsTitle}>Recommendations:</Text>
                  {analysis.recommendations.map((rec, index) => (
                    <Text key={index} style={styles.recommendationText}>
                      • {rec}
                    </Text>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  backButton: {
    padding: spacing.xs,
    marginRight: spacing.sm,
  },
  headerTitle: {
    ...typography.headingMedium,
    color: colors.neutral[800],
  },
  iconButton: {
    padding: spacing.xs,
  },
  searchContainer: {
    padding: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral[100],
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  searchInput: {
    flex: 1,
    padding: spacing.sm,
    ...typography.bodyMedium,
    color: colors.neutral[800],
  },
  clearButton: {
    padding: spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },
  filtersCard: {
    margin: spacing.md,
    padding: spacing.md,
    borderRadius: spacing.md,
    elevation: 4,
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  filterSection: {
    marginBottom: spacing.md,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  filterSectionTitle: {
    ...typography.labelLarge,
    color: colors.neutral[800],
    marginBottom: spacing.sm,
  },
  sortButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: spacing.sm,
    backgroundColor: colors.neutral[100],
    gap: spacing.xs,
  },
  sortButtonActive: {
    backgroundColor: colors.primary[500],
  },
  sortButtonText: {
    ...typography.labelMedium,
    color: colors.neutral[800],
  },
  sortButtonTextActive: {
    color: colors.white,
  },
  orderButton: {
    padding: spacing.sm,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  filterButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.sm,
    backgroundColor: colors.neutral[100],
  },
  filterButtonActive: {
    backgroundColor: colors.primary[500],
  },
  filterButtonText: {
    ...typography.labelMedium,
    color: colors.neutral[800],
  },
  filterButtonTextActive: {
    color: colors.white,
  },
  analysisCard: {
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
  },
  analysisImage: {
    width: '100%',
    height: 200,
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
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    padding: spacing.xs,
  },
  healthBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
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
    marginBottom: spacing.md,
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
  recommendations: {
    marginTop: spacing.sm,
  },
  recommendationsTitle: {
    ...typography.labelMedium,
    color: colors.neutral[800],
    marginBottom: spacing.xs,
  },
  recommendationText: {
    ...typography.bodySmall,
    color: colors.neutral[700],
    marginBottom: spacing.xxs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scheduleModal: {
    width: '90%',
    maxWidth: 400,
    padding: spacing.lg,
    borderRadius: spacing.lg,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  scheduleTitle: {
    ...typography.headingMedium,
    color: colors.neutral[800],
  },
  closeButton: {
    padding: spacing.xs,
  },
  scheduleContent: {
    marginBottom: spacing.lg,
  },
  scheduleLabel: {
    ...typography.labelMedium,
    color: colors.neutral[800],
    marginBottom: spacing.sm,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  dateTimeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    padding: spacing.md,
    backgroundColor: colors.neutral[100],
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  dateTimeText: {
    ...typography.bodyMedium,
    color: colors.neutral[800],
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.md,
    backgroundColor: colors.neutral[100],
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    marginBottom: spacing.lg,
  },
  locationText: {
    ...typography.bodyMedium,
    color: colors.neutral[800],
  },
  notesInput: {
    padding: spacing.md,
    backgroundColor: colors.neutral[100],
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    ...typography.bodyMedium,
    color: colors.neutral[800],
    textAlignVertical: 'top',
  },
  scheduleActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  cancelButton: {
    backgroundColor: colors.neutral[100],
  },
  confirmButton: {
    backgroundColor: colors.primary[500],
  },
  cancelButtonText: {
    ...typography.labelLarge,
    color: colors.neutral[800],
  },
  confirmButtonText: {
    ...typography.labelLarge,
    color: colors.white,
  },
}); 