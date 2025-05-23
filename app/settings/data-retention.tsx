import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography } from '@/theme';
import { Card } from '@/components/Card';
import { Header } from '@/components/Header';
import { Clock, Shield, AlertTriangle } from 'lucide-react-native';

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
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Clock size={24} color={colors.primary[500]} />
              <Text style={styles.cardTitle}>Data Retention Policy</Text>
            </View>
            <Text style={styles.description}>
              We retain your personal data for as long as necessary to provide our services and fulfill the purposes outlined in our privacy policy. Here's how we handle different types of data:
            </Text>
            <View style={styles.policySection}>
              <Text style={styles.policyTitle}>Account Data</Text>
              <Text style={styles.policyText}>
                • Basic account information is retained while your account is active{'\n'}
                • After account deletion, data is anonymized within 30 days{'\n'}
                • Some data may be retained for legal compliance
              </Text>
            </View>
            <View style={styles.policySection}>
              <Text style={styles.policyTitle}>Usage Data</Text>
              <Text style={styles.policyText}>
                • Activity logs are retained for 90 days{'\n'}
                • Analytics data is anonymized after 12 months{'\n'}
                • Performance metrics are stored for 6 months
              </Text>
            </View>
          </Card>

          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Shield size={24} color={colors.primary[500]} />
              <Text style={styles.cardTitle}>Your Rights</Text>
            </View>
            <Text style={styles.description}>
              Under data protection laws, you have the right to:
            </Text>
            <View style={styles.policySection}>
              <Text style={styles.policyText}>
                • Access your personal data{'\n'}
                • Request correction of inaccurate data{'\n'}
                • Request deletion of your data{'\n'}
                • Object to data processing{'\n'}
                • Request data portability
              </Text>
            </View>
          </Card>

          <View style={styles.warningContainer}>
            <AlertTriangle size={20} color={colors.warning[500]} />
            <Text style={styles.warningText}>
              Note: Some data may be retained for legal or regulatory purposes, even after account deletion.
            </Text>
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
    padding: spacing.lg,
  },
  content: {
    gap: spacing.lg,
  },
  card: {
    padding: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  cardTitle: {
    ...typography.headingSmall,
    color: colors.neutral[900],
  },
  description: {
    ...typography.bodyMedium,
    color: colors.neutral[600],
    marginBottom: spacing.md,
  },
  policySection: {
    marginBottom: spacing.md,
  },
  policyTitle: {
    ...typography.bodyMedium,
    color: colors.neutral[900],
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  policyText: {
    ...typography.bodyMedium,
    color: colors.neutral[700],
    lineHeight: 24,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.warning[100],
    borderRadius: spacing.sm,
  },
  warningText: {
    ...typography.bodySmall,
    color: colors.warning[700],
    flex: 1,
  },
}); 