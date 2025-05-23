import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '@/contexts/UserContext';
import { colors, spacing, typography } from '@/theme';
import { Card } from '@/components/Card';
import { Header } from '@/components/Header';
import {
  Shield,
  Lock,
  Eye,
  Key,
  Smartphone,
  Mail,
  AlertTriangle,
  ChevronRight,
  Clock,
} from 'lucide-react-native';
import { getLastLoginInfo } from '@/utils/deviceManager';

interface LoginInfo {
  lastLogin: {
    toDate: () => Date;
  };
  lastDevice: string;
}

// Reusable Setting Item Component
const SettingItem = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  onPress, 
  showChevron = true 
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

export default function SecurityScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [lastLogin, setLastLogin] = useState<LoginInfo | null>(null);

  useEffect(() => {
    const loadLastLoginInfo = async () => {
      if (user?.id) {
        const loginInfo = await getLastLoginInfo(user.id);
        if (loginInfo) {
          setLastLogin(loginInfo as LoginInfo);
        }
      }
    };

    loadLastLoginInfo();
  }, [user]);

  const formatDate = (timestamp: LoginInfo['lastLogin'] | undefined) => {
    if (!timestamp) return 'Never';
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Privacy & Security"
        showBackButton
      />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          {/* Last Login Section */}
          <Section title="Last Login">
            <SettingItem
              icon={Clock}
              title="Last login"
              subtitle={`${formatDate(lastLogin?.lastLogin)} • ${lastLogin?.lastDevice || 'No device information available'}`}
              showChevron={false}
            />
          </Section>

          {/* Authentication Section */}
          <Section title="Authentication">
            <SettingItem
              icon={Lock}
              title="Change Password"
              onPress={() => router.push('/settings/change-password' as any)}
            />
          </Section>

          {/* Privacy Section */}
          <Section title="Privacy">
            <SettingItem
              icon={Eye}
              title="Data Privacy"
              onPress={() => router.push('data-privacy' as any)}
            />
            <SettingItem
              icon={AlertTriangle}
              title="Activity Log"
              onPress={() => router.push('activity-log' as any)}
            />
          </Section>

          {/* Connected Devices Section */}
          <Section title="Connected Devices">
            <SettingItem
              icon={Smartphone}
              title="Manage Devices"
              onPress={() => router.push('devices' as any)}
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