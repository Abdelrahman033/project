import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '@/components/Card';
import { colors, spacing, typography } from '@/theme';
import { ArrowLeft, Bell, Shield, Database, HelpCircle, Info } from 'lucide-react-native';

export default function SettingsPage() {
  const router = useRouter();

  const settingsSections = [
    {
      title: 'Notifications',
      icon: <Bell size={24} color={colors.primary[500]} />,
      route: '/settings/notifications'
    },
    {
      title: 'Privacy & Security',
      icon: <Shield size={24} color={colors.primary[500]} />,
      route: '/settings/privacy'
    },
    {
      title: 'Data Management',
      icon: <Database size={24} color={colors.primary[500]} />,
      route: '/settings/data'
    },
    {
      title: 'Help & Support',
      icon: <HelpCircle size={24} color={colors.primary[500]} />,
      route: '/settings/help'
    },
    {
      title: 'About',
      icon: <Info size={24} color={colors.primary[500]} />,
      route: '/settings/about'
    }
  ];

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
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {settingsSections.map((section, index) => (
          <TouchableOpacity
            key={section.title}
            style={styles.sectionButton}
            onPress={() => router.push(section.route)}
          >
            <View style={styles.sectionContent}>
              {section.icon}
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
          </TouchableOpacity>
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
  backButton: {
    padding: spacing.xs,
    marginRight: spacing.sm,
  },
  headerTitle: {
    ...typography.headingMedium,
    color: colors.neutral[800],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },
  sectionButton: {
    backgroundColor: colors.white,
    borderRadius: spacing.sm,
    marginBottom: spacing.sm,
    padding: spacing.md,
    elevation: 2,
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  sectionTitle: {
    ...typography.bodyLarge,
    color: colors.neutral[800],
  },
}); 