import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { colors, spacing, typography } from '@/theme';
import { Shield, FileText, Database, Lock, AlertTriangle, Mail, LucideIcon } from 'lucide-react-native';

interface TermsSectionProps {
  title: string;
  children: ReactNode;
  icon: LucideIcon;
}

// Reusable section component for consistent styling
const TermsSection = ({ title, children, icon: Icon }: TermsSectionProps) => (
  <Card style={styles.section}>
    <View style={styles.sectionHeader}>
      <Icon size={24} color={colors.primary[500]} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    <View style={styles.sectionContent}>
      {children}
    </View>
  </Card>
);

export default function TermsScreen() {
  return (
    <View style={styles.container}>
      <Header title="Terms & Conditions" showBackButton />
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Terms & Conditions</Text>
        <Text style={styles.description}>
          Please read these terms and conditions carefully before using Soil Pulse.
        </Text>

        <TermsSection title="Acceptance of Terms" icon={Shield}>
          <Text style={styles.sectionText}>
            By accessing and using Soil Pulse, you agree to be bound by these Terms and Conditions. 
            If you do not agree to these terms, please do not use the application.
          </Text>
        </TermsSection>

        <TermsSection title="Use of Service" icon={FileText}>
          <Text style={styles.sectionText}>
            Soil Pulse is designed for agricultural professionals and farmers. You agree to use the 
            service only for lawful purposes and in accordance with these terms. You are responsible 
            for maintaining the confidentiality of your account information.
          </Text>
        </TermsSection>

        <TermsSection title="Data Collection and Privacy" icon={Database}>
          <Text style={styles.sectionText}>
            We collect and process data as described in our Privacy Policy. By using Soil Pulse, you 
            consent to such collection and processing. We are committed to protecting your privacy and 
            handling your data in accordance with applicable laws.
          </Text>
        </TermsSection>

        <TermsSection title="Intellectual Property" icon={Lock}>
          <Text style={styles.sectionText}>
            All content, features, and functionality of Soil Pulse are owned by us and are protected 
            by international copyright, trademark, and other intellectual property laws. You may not 
            reproduce, distribute, or create derivative works from this content without our permission.
          </Text>
        </TermsSection>

        <TermsSection title="Limitation of Liability" icon={AlertTriangle}>
          <Text style={styles.sectionText}>
            Soil Pulse provides soil analysis and recommendations based on available data. While we 
            strive for accuracy, we cannot guarantee the results. We are not liable for any decisions 
            made based on the information provided through our service.
          </Text>
        </TermsSection>

        <TermsSection title="Changes to Terms" icon={FileText}>
          <Text style={styles.sectionText}>
            We reserve the right to modify these terms at any time. We will notify users of any 
            material changes. Your continued use of Soil Pulse after such modifications constitutes 
            your acceptance of the new terms.
          </Text>
        </TermsSection>

        <TermsSection title="Contact Information" icon={Mail}>
          <Text style={styles.sectionText}>
            If you have any questions about these Terms and Conditions, please contact us at 
            support@soilpulse.com
          </Text>
        </TermsSection>

        <Text style={styles.lastUpdated}>Last Updated: March 2024</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[100],
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  title: {
    ...typography.headingLarge,
    color: colors.neutral[800],
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  description: {
    ...typography.bodyMedium,
    color: colors.neutral[700],
    marginBottom: spacing.xl,
    textAlign: 'center',
    lineHeight: 24,
  },
  section: {
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.headingSmall,
    color: colors.neutral[800],
    marginLeft: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
    paddingTop: spacing.md,
  },
  sectionText: {
    ...typography.bodyMedium,
    color: colors.neutral[700],
    lineHeight: 24,
  },
  lastUpdated: {
    ...typography.bodySmall,
    color: colors.neutral[500],
    textAlign: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
}); 