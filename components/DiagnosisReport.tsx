import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ViewStyle, TextStyle } from 'react-native';
import Animated, { 
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { colors, spacing, typography } from '@/theme';
import { AlertTriangle, CheckCircle2, Leaf, Droplet } from 'lucide-react-native';

interface ReportSection {
  description?: string;
  causes?: string[];
  treatment?: string[];
  notes?: string;
  message?: string;
  recommendations?: string[];
}

interface DiagnosisData {
  status: 'infected' | 'healthy';
  disease?: string;
  severity?: 'low' | 'medium' | 'high';
  source?: 'soil' | 'plant';
  report: ReportSection;
}

interface DiagnosisReportProps {
  data: DiagnosisData;
  style?: ViewStyle;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export const DiagnosisReport: React.FC<DiagnosisReportProps> = ({ data, style }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 500 });
    translateY.value = withTiming(0, { duration: 500 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'low':
        return colors.warning[500];
      case 'medium':
        return colors.warning[700];
      case 'high':
        return colors.error[500];
      default:
        return colors.success[500];
    }
  };

  const getSeverityIcon = (severity?: string) => {
    switch (severity) {
      case 'low':
        return <AlertTriangle size={20} color={colors.warning[500]} />;
      case 'medium':
        return <AlertTriangle size={24} color={colors.warning[700]} />;
      case 'high':
        return <AlertTriangle size={28} color={colors.error[500]} />;
      default:
        return <CheckCircle2 size={24} color={colors.success[500]} />;
    }
  };

  const renderBulletPoints = (items: string[] | undefined) => {
    if (!items || items.length === 0) return null;
    
    return (
      <View style={styles.bulletList}>
        {items.map((item, index) => (
          <AnimatedView
            key={index}
            entering={FadeInDown.delay(index * 100)}
            style={styles.bulletItem}
          >
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.bulletText}>{item}</Text>
          </AnimatedView>
        ))}
      </View>
    );
  };

  return (
    <AnimatedView 
      style={[styles.container, style, animatedStyle]}
      entering={FadeIn.duration(500)}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          {data.status === 'infected' ? (
            <>
              <View style={styles.titleContainer}>
                <AnimatedView 
                  entering={FadeInDown.delay(100)}
                  style={styles.iconContainer}
                >
                  {data.source === 'soil' ? (
                    <Droplet size={24} color={colors.primary[500]} />
                  ) : (
                    <Leaf size={24} color={colors.primary[500]} />
                  )}
                </AnimatedView>
                <AnimatedView entering={FadeInDown.delay(200)}>
                  <Text style={styles.diseaseTitle}>{data.disease}</Text>
                  <Text style={styles.sourceText}>
                    {data.source === 'soil' ? 'Soil Disease' : 'Plant Disease'}
                  </Text>
                </AnimatedView>
              </View>
              <AnimatedView 
                entering={FadeInDown.delay(300)}
                style={styles.severityContainer}
              >
                {getSeverityIcon(data.severity)}
                <Text style={[
                  styles.severityText,
                  { color: getSeverityColor(data.severity) }
                ]}>
                  {data.severity?.charAt(0).toUpperCase() + data.severity?.slice(1)} Severity
                </Text>
              </AnimatedView>
            </>
          ) : (
            <AnimatedView 
              entering={FadeInDown.delay(100)}
              style={styles.healthyContainer}
            >
              <CheckCircle2 size={32} color={colors.success[500]} />
              <Text style={styles.healthyTitle}>Healthy</Text>
            </AnimatedView>
          )}
        </View>

        <View style={styles.content}>
          {data.status === 'infected' ? (
            <>
              {data.report.description && (
                <AnimatedView 
                  entering={FadeInUp.delay(400)}
                  style={styles.section}
                >
                  <Text style={styles.sectionTitle}>Description</Text>
                  <Text style={styles.descriptionText}>{data.report.description}</Text>
                </AnimatedView>
              )}

              {data.report.causes && data.report.causes.length > 0 && (
                <AnimatedView 
                  entering={FadeInUp.delay(500)}
                  style={styles.section}
                >
                  <Text style={styles.sectionTitle}>Causes</Text>
                  {renderBulletPoints(data.report.causes)}
                </AnimatedView>
              )}

              {data.report.treatment && data.report.treatment.length > 0 && (
                <AnimatedView 
                  entering={FadeInUp.delay(600)}
                  style={styles.section}
                >
                  <Text style={styles.sectionTitle}>Treatment</Text>
                  {renderBulletPoints(data.report.treatment)}
                </AnimatedView>
              )}

              {data.report.notes && (
                <AnimatedView 
                  entering={FadeInUp.delay(700)}
                  style={styles.section}
                >
                  <Text style={styles.sectionTitle}>Notes</Text>
                  <Text style={styles.notesText}>{data.report.notes}</Text>
                </AnimatedView>
              )}
            </>
          ) : (
            <>
              <AnimatedView 
                entering={FadeInUp.delay(200)}
                style={styles.section}
              >
                <Text style={styles.messageText}>{data.report.message}</Text>
              </AnimatedView>

              {data.report.recommendations && data.report.recommendations.length > 0 && (
                <AnimatedView 
                  entering={FadeInUp.delay(300)}
                  style={styles.section}
                >
                  <Text style={styles.sectionTitle}>Recommendations</Text>
                  {renderBulletPoints(data.report.recommendations)}
                </AnimatedView>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </AnimatedView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  } as ViewStyle,
  scrollView: {
    flex: 1,
  },
  header: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  } as ViewStyle,
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  } as ViewStyle,
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  } as ViewStyle,
  diseaseTitle: {
    ...typography.headingMedium,
    color: colors.neutral[800],
    marginBottom: spacing.xxs,
  } as TextStyle,
  sourceText: {
    ...typography.bodyMedium,
    color: colors.neutral[600],
  } as TextStyle,
  severityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  } as ViewStyle,
  severityText: {
    ...typography.labelLarge,
    marginLeft: spacing.xs,
  } as TextStyle,
  healthyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  } as ViewStyle,
  healthyTitle: {
    ...typography.headingMedium,
    color: colors.success[500],
    marginLeft: spacing.sm,
  } as TextStyle,
  content: {
    padding: spacing.lg,
  } as ViewStyle,
  section: {
    marginBottom: spacing.lg,
  } as ViewStyle,
  sectionTitle: {
    ...typography.headingSmall,
    color: colors.neutral[800],
    marginBottom: spacing.sm,
  } as TextStyle,
  descriptionText: {
    ...typography.bodyMedium,
    color: colors.neutral[700],
    lineHeight: 24,
  } as TextStyle,
  bulletList: {
    marginTop: spacing.xs,
  } as ViewStyle,
  bulletItem: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  } as ViewStyle,
  bulletPoint: {
    ...typography.bodyMedium,
    color: colors.primary[500],
    marginRight: spacing.xs,
  } as TextStyle,
  bulletText: {
    ...typography.bodyMedium,
    color: colors.neutral[700],
    flex: 1,
  } as TextStyle,
  notesText: {
    ...typography.bodyMedium,
    color: colors.neutral[600],
    fontStyle: 'italic',
  } as TextStyle,
  messageText: {
    ...typography.bodyLarge,
    color: colors.success[700],
    textAlign: 'center',
    lineHeight: 24,
  } as TextStyle,
}); 