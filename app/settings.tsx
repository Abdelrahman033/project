import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '@/contexts/UserContext';
import { colors, spacing, typography } from '@/theme';
import { Card } from '@/components/Card';
import { SettingItem } from '@/components/SettingItem';
import {
  Bell,
  Moon,
  Info,
  FileText,
  MessageCircle,
  LogOut,
  User,
  Shield,
  HelpCircle,
  Globe,
  Mail,
  Phone,
  MapPin,
  Lock,
} from 'lucide-react-native';
import { Header } from '@/components/Header';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, signOut } = useUser();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleNotificationChange = (value: boolean) => {
    setNotifications(value);
  };

  const handleDarkModeChange = (value: boolean) => {
    setDarkMode(value);
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Settings"
        showBackButton
      />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          {/* Account Settings */}
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <Card style={styles.sectionCard}>
            <SettingItem 
              icon={User}
              title="Edit Profile"
              onPress={() => router.push('/profile/edit')}
            />
            <SettingItem 
              icon={Mail}
              title="Email"
              value={user?.email || 'Not provided'}
            />
            <SettingItem 
              icon={Phone}
              title="Phone"
              value={user?.phone || 'Not provided'}
            />
            <SettingItem 
              icon={MapPin}
              title="Location"
              value={user?.location || 'Not provided'}
            />
            <SettingItem 
              icon={Globe}
              title="Language"
              value={user?.language || 'English'}
            />
            <SettingItem
              icon={Lock}
              title="Change Password"
              onPress={() => router.push('change-password' as any)}
            />
            <SettingItem
              icon={Bell}
              title="Notifications"
              onPress={() => router.push('notifications' as any)}
            />
          </Card>

          {/* App Settings */}
          <Text style={styles.sectionTitle}>App Settings</Text>
          <Card style={styles.sectionCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Bell size={20} color={colors.neutral[600]} />
                <Text style={styles.settingText}>Push Notifications</Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={handleNotificationChange}
                trackColor={{ false: colors.neutral[300], true: colors.primary[500] }}
                thumbColor={colors.white}
              />
            </View>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Moon size={20} color={colors.neutral[600]} />
                <Text style={styles.settingText}>Dark Mode</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={handleDarkModeChange}
                trackColor={{ false: colors.neutral[300], true: colors.primary[500] }}
                thumbColor={colors.white}
              />
            </View>
          </Card>

          {/* More */}
          <Text style={styles.sectionTitle}>More</Text>
          <Card style={styles.sectionCard}>
            <SettingItem 
              icon={Info}
              title="About Soil Pulse"
              onPress={() => router.push('/about')}
            />
            <SettingItem 
              icon={FileText}
              title="Terms & Conditions"
              onPress={() => router.push('/terms')}
            />
            <SettingItem 
              icon={MessageCircle}
              title="Contact Support"
              onPress={() => router.push('/support')}
            />
            <SettingItem 
              icon={Shield}
              title="Privacy Policy"
              onPress={() => router.push('/privacy')}
            />
          </Card>

          {/* Sign Out */}
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={signOut}
          >
            <LogOut size={20} color={colors.error[500]} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
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
  sectionTitle: {
    ...typography.headingSmall,
    color: colors.neutral[900],
    marginBottom: spacing.xs,
  },
  sectionCard: {
    gap: spacing.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  settingText: {
    ...typography.bodyMedium,
    color: colors.neutral[900],
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.error[50],
    borderRadius: spacing.md,
    marginTop: spacing.lg,
  },
  signOutText: {
    ...typography.labelMedium,
    color: colors.error[500],
  },
}); 