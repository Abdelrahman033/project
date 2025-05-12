import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '@/components/Card';
import { colors, spacing, typography } from '@/theme';
import { ArrowLeft, Bell, Shield, Database, HelpCircle, Info, Cloud, Wifi, Lock } from 'lucide-react-native';

export default function ProfileSettingsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = React.useState(true);
  const [autoSync, setAutoSync] = React.useState(true);
  const [offlineMode, setOfflineMode] = React.useState(false);

  const settingsSections = [
    {
      title: 'Advanced Notifications',
      icon: <Bell size={24} color={colors.primary[500]} />,
      description: 'Configure detailed notification preferences',
      route: '/profile/settings/notifications'
    },
    {
      title: 'Data Synchronization',
      icon: <Cloud size={24} color={colors.primary[500]} />,
      description: 'Manage data sync and backup settings',
      route: '/profile/settings/sync'
    },
    {
      title: 'Network Settings',
      icon: <Wifi size={24} color={colors.primary[500]} />,
      description: 'Configure network and connectivity options',
      route: '/profile/settings/network'
    },
    {
      title: 'Security Settings',
      icon: <Lock size={24} color={colors.primary[500]} />,
      description: 'Manage security and privacy options',
      route: '/profile/settings/security'
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
          <Text style={styles.headerTitle}>Advanced Settings</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Card style={styles.quickSettings}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Push Notifications</Text>
              <Text style={styles.settingDescription}>Receive real-time updates</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: colors.neutral[300], true: colors.primary[500] }}
            />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Auto Sync</Text>
              <Text style={styles.settingDescription}>Automatically sync data</Text>
            </View>
            <Switch
              value={autoSync}
              onValueChange={setAutoSync}
              trackColor={{ false: colors.neutral[300], true: colors.primary[500] }}
            />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Offline Mode</Text>
              <Text style={styles.settingDescription}>Work without internet</Text>
            </View>
            <Switch
              value={offlineMode}
              onValueChange={setOfflineMode}
              trackColor={{ false: colors.neutral[300], true: colors.primary[500] }}
            />
          </View>
        </Card>

        {settingsSections.map((section) => (
          <TouchableOpacity
            key={section.title}
            style={styles.sectionButton}
            onPress={() => router.push(section.route)}
          >
            <View style={styles.sectionContent}>
              {section.icon}
              <View style={styles.sectionInfo}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text style={styles.sectionDescription}>{section.description}</Text>
              </View>
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
  quickSettings: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  settingInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingTitle: {
    ...typography.bodyLarge,
    color: colors.neutral[800],
    marginBottom: spacing.xxs,
  },
  settingDescription: {
    ...typography.bodySmall,
    color: colors.neutral[600],
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
  sectionInfo: {
    flex: 1,
  },
  sectionTitle: {
    ...typography.bodyLarge,
    color: colors.neutral[800],
    marginBottom: spacing.xxs,
  },
  sectionDescription: {
    ...typography.bodySmall,
    color: colors.neutral[600],
  },
}); 