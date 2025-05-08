/**
 * AnalysisCard component for the SoilSense AI app
 * Displays a summary of a soil analysis result
 */

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SoilAnalysisResult } from '../types';
import { Card } from './Card';
import { SeverityIndicator } from './SeverityIndicator';
import { colors, spacing, typography } from '../theme';
import { Clock, MapPin, Leaf } from 'lucide-react-native';

interface AnalysisCardProps {
  analysis: SoilAnalysisResult;
  onPress?: () => void;
}

export const AnalysisCard = ({ analysis, onPress }: AnalysisCardProps) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card 
      onPress={onPress} 
      style={styles.card}
      elevation={3}
    >
      <View style={styles.header}>
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
        <View style={styles.headerContent}>
          <View style={styles.diseaseContainer}>
            <Text style={styles.diseaseText}>
              {analysis.disease.type.split('_').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </Text>
            <Text style={styles.confidenceText}>
              {Math.round(analysis.disease.confidence * 100)}% confidence
            </Text>
          </View>
          <SeverityIndicator 
            level={analysis.disease.severity} 
            size="small"
            showLabel={true}
          />
        </View>
      </View>
      
      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Clock size={16} color={colors.neutral[600]} />
          <Text style={styles.infoText}>{formatDate(analysis.timestamp)}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <MapPin size={16} color={colors.neutral[600]} />
          <Text style={styles.infoText} numberOfLines={1}>
            {analysis.location.latitude.toFixed(4)}, {analysis.location.longitude.toFixed(4)}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Leaf size={16} color={colors.neutral[600]} />
          <Text style={styles.infoText}>
            Soil Health: <Text style={styles.soilHealthText}>{analysis.soilHealth.charAt(0).toUpperCase() + analysis.soilHealth.slice(1)}</Text>
          </Text>
        </View>
      </View>
      
      {analysis.recommendations.length > 0 && (
        <View style={styles.recommendationsSection}>
          <Text style={styles.recommendationsTitle}>Top Recommendation:</Text>
          <Text style={styles.recommendationText} numberOfLines={2}>
            {analysis.recommendations[0]}
          </Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
  },
  imageContainer: {
    position: 'relative',
    width: 120,
    height: 120,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  syncBadge: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    backgroundColor: colors.warning[500],
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
    borderRadius: spacing.xs,
  },
  syncText: {
    ...typography.labelSmall,
    color: colors.white,
  },
  headerContent: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'center',
  },
  diseaseContainer: {
    marginBottom: spacing.sm,
  },
  diseaseText: {
    ...typography.headingSmall,
    color: colors.neutral[800],
    marginBottom: spacing.xxs,
  },
  confidenceText: {
    ...typography.bodySmall,
    color: colors.neutral[600],
  },
  infoSection: {
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
    padding: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  infoText: {
    ...typography.bodyMedium,
    color: colors.neutral[700],
    marginLeft: spacing.sm,
  },
  soilHealthText: {
    fontWeight: 'bold',
  },
  recommendationsSection: {
    backgroundColor: colors.primary[50],
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.primary[100],
  },
  recommendationsTitle: {
    ...typography.labelMedium,
    color: colors.primary[600],
    marginBottom: spacing.xxs,
  },
  recommendationText: {
    ...typography.bodyMedium,
    color: colors.neutral[800],
  },
});