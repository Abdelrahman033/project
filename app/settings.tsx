import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '@/contexts/UserContext';
import { colors, spacing, typography } from '@/theme';
import { Card } from '@/components/Card';
import { SettingItem } from '@/components/SettingItem';
import {
  Globe,
  Bell,
  User,
  Phone,
  Info,
  FileText,
  MessageCircle,
  LogOut,
  ChevronRight,
  RefreshCw,
  Wifi,
  Shield,
} from 'lucide-react-native';
import { Header } from '@/components/Header';
import { SettingItemCard } from '@/components/SettingItemCard';

export default function SettingsScreen() {
  const router = useRouter();
  const { signOut } = useUser();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Settings"
        showBackButton
      />
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {/* General Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General Settings</Text>
          <Card style={styles.sectionCard}>
            <SettingItem 
              icon={Globe}
              title="Language"
              value="English"
              onPress={() => router.push('/about' as any)}
              showChevron
            />
            <SettingItem 
              icon={Bell}
              title="Notifications"
              value="Enabled"
              onPress={() => router.push('/about' as any)}
              showChevron
            />
          </Card>
        </View>

        {/* Profile & Account */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile & Account</Text>
          <Card style={styles.sectionCard}>
            <SettingItem 
              icon={User}
              title="Edit Profile"
              onPress={() => router.push('/profile/edit')}
              showChevron
            />
            <SettingItem 
              icon={Phone}
              title="Change Phone Number"
              value="+1 (234) 567-8900"
              onPress={() => router.push('/about' as any)}
              showChevron
            />
          </Card>
        </View>

        {/* App Info & Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Info & Support</Text>
          <Card style={styles.sectionCard}>
            <SettingItem 
              icon={Info}
              title="About Soil Pulse"
              onPress={() => router.push('/about')}
              showChevron
            />
            <SettingItem 
              icon={FileText}
              title="Privacy Policy"
              onPress={() => router.push('/privacy')}
              showChevron
            />
            <SettingItem 
              icon={FileText}
              title="Terms & Conditions"
              onPress={() => router.push('/terms')}
              showChevron
            />
            <SettingItem 
              icon={MessageCircle}
              title="Contact Support"
              onPress={() => router.push('/support')}
              showChevron
            />
          </Card>
        </View>

        {/* Advanced Settings Section */}
        <View style={styles.section}>
          <SettingItemCard
            icon={<Bell size={24} color={colors.primary[500]} />}
            title="Advanced Notifications"
            description="Manage alerts, thresholds, and AI-based soil warnings"
            onPress={() => router.push('/settings/advanced-notifications' as any)}
          />
          
          <SettingItemCard
            icon={<RefreshCw size={24} color={colors.primary[500]} />}
            title="Data Synchronization"
            description="Control offline/online sync options and data refresh intervals"
            onPress={() => router.push('/settings/data-sync' as any)}
          />
          
          <SettingItemCard
            icon={<Wifi size={24} color={colors.primary[500]} />}
            title="Network Settings"
            description="Manage data usage, low bandwidth mode, and Wi-Fi-only mode"
            onPress={() => router.push('/settings/network' as any)}
          />
          
          <SettingItemCard
            icon={<Shield size={24} color={colors.primary[500]} />}
            title="Security Settings"
            description="Manage app security, PIN code, biometric lock, and session timeouts"
            onPress={() => router.push('/settings/security' as any)}
          />
        </View>
      </ScrollView>

      {/* Fixed Logout Button */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleSignOut}
          accessibilityRole="button"
          accessibilityLabel="Sign Out"
        >
          <LogOut size={20} color={colors.error[500]} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
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
  scrollContent: {
    padding: spacing.md,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.neutral[700],
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  sectionCard: {
    padding: spacing.md,
  },
  logoutContainer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
    backgroundColor: colors.white,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
  },
  logoutText: {
    ...typography.button,
    color: colors.error[500],
  },
}); 