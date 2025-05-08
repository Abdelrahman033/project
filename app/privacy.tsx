import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { colors, spacing, typography } from '@/theme';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import {
  Shield,
  Lock,
  FileText,
  ChevronRight,
  ChevronDown,
  Download,
  Trash2,
  Eye,
  Key,
  AlertCircle,
  Mail,
  Phone,
} from 'lucide-react-native';

// Privacy sections data
const privacySections = [
  {
    title: '1. Data Privacy',
    content: 'We collect soil images, GPS, sensor data, and user feedback to provide real-time soil health analysis.\n\nYour data is encrypted and securely stored.\n\nWe do not sell or share your data without your permission.',
  },
  {
    title: '2. User Responsibility',
    content: 'Provide accurate information when registering or submitting data.\n\nDo not misuse forums or upload harmful content.\n\nUse the app only for agricultural or educational purposes.',
  },
  {
    title: '3. Security',
    content: 'All data is encrypted (AES-256).\n\nWe use role-based access and secure login to protect user accounts.',
  },
  {
    title: '4. Acceptable Use',
    content: 'No hacking, reverse engineering, or misuse of features.\n\nForum misuse (e.g., spamming or harassment) may lead to suspension.',
  },
  {
    title: '5. Third-Party Services',
    content: 'We integrate secure weather and agricultural APIs.\n\nAll partners follow strict data protection standards.',
  },
  {
    title: '6. Updates and Maintenance',
    content: 'App updates may require downtime; users will be notified in advance.\n\nWe regularly improve features and security.',
  },
  {
    title: '7. Compliance',
    content: 'We follow data laws (e.g., GDPR) and agricultural regulations.\n\nPartner farms must report major land or soil changes for database accuracy.',
  },
  {
    title: '8. Support',
    content: 'For help or questions:\n📧 soilpuls@gmail.com\n📞 +201067882339',
  },
];

// User rights data
const userRights = [
  {
    title: 'Access Your Data',
    description: 'View and download all your farm data and analyses',
    icon: <Eye size={20} color={colors.primary[500]} />,
  },
  {
    title: 'Delete Your Data',
    description: 'Request complete deletion of your account and data',
    icon: <Trash2 size={20} color={colors.primary[500]} />,
  },
  {
    title: 'Export Data',
    description: 'Download your data in various formats',
    icon: <Download size={20} color={colors.primary[500]} />,
  },
  {
    title: 'Update Preferences',
    description: 'Manage your privacy settings and notifications',
    icon: <Key size={20} color={colors.primary[500]} />,
  },
];

export default function PrivacyScreen() {
  const router = useRouter();
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const handleSectionPress = (index: number) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  const handleEmailSupport = () => {
    Linking.openURL('mailto:soilpuls@gmail.com');
  };

  const handleCallSupport = () => {
    Linking.openURL('tel:+201067882339');
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Privacy Policy"
        showBackButton
      />
      
      <ScrollView style={styles.content}>
        <Card style={styles.overviewCard}>
          <View style={styles.overviewHeader}>
            <Shield size={24} color={colors.primary[500]} />
            <Text style={styles.overviewTitle}>Soil Pulse App Policy</Text>
          </View>
          <Text style={styles.overviewText}>
            We are committed to protecting your privacy and ensuring the security of your farm data. 
            This page explains how we handle your information and your rights regarding your data.
          </Text>
          <Text style={styles.lastUpdated}>Last Updated: May 2025</Text>
        </Card>

        {privacySections.map((section, index) => (
          <Card 
            key={index}
            style={styles.sectionCard}
            onPress={() => handleSectionPress(index)}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <ChevronRight 
                size={20} 
                color={colors.neutral[600]}
                style={[
                  styles.chevron,
                  expandedSection === index && styles.chevronRotated
                ]}
              />
            </View>
            
            {expandedSection === index && (
              <Text style={styles.sectionContent}>{section.content}</Text>
            )}
          </Card>
        ))}

        <Card style={styles.actionsCard}>
          <View style={styles.supportSection}>
            <Text style={styles.supportTitle}>Need Help?</Text>
            <TouchableOpacity 
              style={styles.supportButton}
              onPress={handleEmailSupport}
            >
              <Mail size={20} color={colors.primary[500]} />
              <Text style={styles.supportButtonText}>Email Support</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.supportButton}
              onPress={handleCallSupport}
            >
              <Phone size={20} color={colors.primary[500]} />
              <Text style={styles.supportButtonText}>Call Support</Text>
            </TouchableOpacity>
          </View>
        </Card>
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
    padding: spacing.md,
  },
  overviewCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  overviewTitle: {
    ...typography.headingSmall,
    color: colors.neutral[800],
    marginLeft: spacing.sm,
  },
  overviewText: {
    ...typography.bodyMedium,
    color: colors.neutral[600],
    lineHeight: 24,
  },
  sectionCard: {
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    ...typography.labelLarge,
    color: colors.neutral[800],
    flex: 1,
  },
  chevron: {
    transform: [{ rotate: '0deg' }],
  },
  chevronRotated: {
    transform: [{ rotate: '90deg' }],
  },
  sectionContent: {
    ...typography.bodyMedium,
    color: colors.neutral[700],
    marginTop: spacing.md,
    lineHeight: 24,
  },
  actionsCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  supportSection: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  supportTitle: {
    ...typography.headingSmall,
    color: colors.neutral[800],
    marginBottom: spacing.md,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: spacing.sm,
    marginBottom: spacing.sm,
  },
  supportButtonText: {
    ...typography.labelMedium,
    color: colors.primary[500],
    marginLeft: spacing.sm,
  },
  lastUpdated: {
    ...typography.labelSmall,
    color: colors.neutral[600],
    textAlign: 'center',
    marginTop: spacing.xs,
  },
}); 