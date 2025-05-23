import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography } from '@/theme';
import { Card } from '@/components/Card';
import { Header } from '@/components/Header';
import {
  Clock,
  ChevronRight,
} from 'lucide-react-native';

// Reusable Setting Item Component
const SettingItem = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  onPress, 
  showChevron = true,
}: { 
  icon: React.ElementType; 
  title: string; 
  subtitle?: string; 
  onPress?: () => void; 
  showChevron?: boolean;
}) => (
  <TouchableOpacity
    style={styles.settingItem}
    onPress={onPress}
    disabled={!onPress}
  >
    <View style={styles.settingLeft}>
      <Icon size={20} color={colors.neutral[600]} />
      <View style={styles.settingTextContainer}>
        <Text style={styles.settingText}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtext}>{subtitle}</Text>}
      </View>
    </View>
    {showChevron && <ChevronRight size={20} color={colors.neutral[600]} />}
  </TouchableOpacity>
);

// Section Component
const Section = ({ 
  title, 
  children 
}: { 
  title: string; 
  children: React.ReactNode;
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Card style={styles.sectionCard}>{children}</Card>
  </View>
);

export default function DataRetentionScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Header 
        title="Data Retention"
        showBackButton
      />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          <Section title="Data Management">
            <SettingItem
              icon={Clock}
              title="Data Retention Policy"
              subtitle="View and manage how long we keep your data"
              onPress={() => router.push('/settings/data-retention')}
            />
          </Section>
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
    padding: spacing.lg,
  },
  content: {
    gap: spacing.xl,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.headingSmall,
    color: colors.neutral[900],
    marginBottom: spacing.xs,
  },
  sectionCard: {
    gap: spacing.xs,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  settingTextContainer: {
    flex: 1,
    gap: spacing.xs,
  },
  settingText: {
    ...typography.bodyMedium,
    color: colors.neutral[900],
  },
  settingSubtext: {
    ...typography.bodySmall,
    color: colors.neutral[600],
  },
}); 