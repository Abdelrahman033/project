import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Switch, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '@/contexts/UserContext';
import { colors, spacing, typography } from '@/theme';
import { Card } from '@/components/Card';
import { ProfileHeader } from '@/components/ProfileHeader';
import { ProfileSection } from '@/components/ProfileSection';
import { SettingItem } from '@/components/SettingItem';
import {
  MapPin, 
  Calendar, 
  Shield, 
  HelpCircle,
  Info,
  Plus,
  LogOut,
  Edit2,
  Settings,
  Mail,
  Phone,
  Bell,
  Globe,
  Moon,
  FileText,
  MessageCircle,
  ChevronRight,
  User as UserIcon,
  Crop,
  Ruler,
  AlertTriangle,
} from 'lucide-react-native';
import { User as AuthUser, Farm } from '@/types/auth';

const { width } = Dimensions.get('window');

// Mock weather data
const mockWeather = {
  temperature: 24,
  condition: 'Sunny',
  humidity: 65,
  windSpeed: 12,
};

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut, updateUser } = useUser();
  const [notifications, setNotifications] = useState(user?.notificationsEnabled ?? true);
  const [darkMode, setDarkMode] = useState(user?.darkMode ?? false);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleNotificationChange = async (value: boolean) => {
    try {
      setNotifications(value);
      await updateUser({ notificationsEnabled: value });
    } catch (error) {
      console.error('Error updating notifications:', error);
      setNotifications(!value); // Revert on error
    }
  };

  const handleDarkModeChange = async (value: boolean) => {
    try {
      setDarkMode(value);
      await updateUser({ darkMode: value });
    } catch (error) {
      console.error('Error updating dark mode:', error);
      setDarkMode(!value); // Revert on error
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Please sign in to view your profile</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <ProfileHeader 
          user={user}
          onEditPress={() => router.push('/profile/edit')}
        />

        <View style={styles.content}>
          {/* Weather Summary */}
          <ProfileSection title="Weather Summary">
            <Card style={styles.weatherCard}>
              <View style={styles.weatherInfo}>
                <Text style={styles.temperature}>{mockWeather.temperature}°C</Text>
                <Text style={styles.condition}>{mockWeather.condition}</Text>
                <View style={styles.weatherDetails}>
                  <Text style={styles.detail}>Humidity: {mockWeather.humidity}%</Text>
                  <Text style={styles.detail}>Wind: {mockWeather.windSpeed} km/h</Text>
                </View>
              </View>
            </Card>
          </ProfileSection>

          {/* Account Information */}
          <ProfileSection title="Account Information">
            <Card style={styles.sectionCard}>
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
            </Card>
          </ProfileSection>

          {/* Farms Section */}
          <ProfileSection title="Farms">
            <Card style={styles.sectionCard}>
              {user?.farms && user.farms.length > 0 ? (
                user.farms.map((farm) => (
                  <TouchableOpacity
                    key={farm.id}
                    style={styles.farmItem}
                    onPress={() => router.push(`/farm/${farm.id}`)}
                  >
                    <View style={styles.farmInfo}>
                      <Text style={styles.farmName}>{farm.name}</Text>
                      <View style={styles.farmDetails}>
                        <View style={styles.farmDetail}>
                          <Ruler size={16} color={colors.neutral[600]} />
                          <Text style={styles.farmDetailText}>{farm.size} m²</Text>
                        </View>
                        <View style={styles.farmDetail}>
                          <Crop size={16} color={colors.neutral[600]} />
                          <Text style={styles.farmDetailText}>{farm.crops.join(', ')}</Text>
                        </View>
                        {farm.soilHealth && (
                          <View style={styles.farmDetail}>
                            <AlertTriangle size={16} color={colors.neutral[600]} />
                            <Text style={styles.farmDetailText}>{farm.soilHealth}</Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <ChevronRight size={20} color={colors.neutral[600]} />
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noFarmsText}>No farms added yet</Text>
              )}
              <TouchableOpacity
                style={styles.addFarmButton}
                onPress={() => router.push('/farm/add')}
              >
                <Plus size={20} color={colors.primary[500]} />
                <Text style={styles.addFarmText}>Add Farm</Text>
              </TouchableOpacity>
            </Card>
          </ProfileSection>

          {/* App Settings */}
          <ProfileSection title="App Settings">
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
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Shield size={20} color={colors.neutral[600]} />
                  <Text style={styles.settingText}>Security Settings</Text>
                </View>
                <TouchableOpacity onPress={() => router.push('/security')}>
                  <ChevronRight size={20} color={colors.neutral[400]} />
                </TouchableOpacity>
              </View>
            </Card>
          </ProfileSection>

          {/* More */}
          <ProfileSection title="More">
            <Card style={styles.sectionCard}>
              <SettingItem 
                icon={Info}
                title="About Soil Pulse"
                onPress={() => router.push('/about' as any)}
              />
              <SettingItem 
                icon={FileText}
                title="Terms & Conditions"
                onPress={() => router.push('/terms' as any)}
              />
              <SettingItem 
                icon={MessageCircle}
                title="Contact Support"
                onPress={() => router.push('/support' as any)}
              />
            </Card>
          </ProfileSection>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  content: {
    padding: spacing.md,
  },
  weatherCard: {
    padding: spacing.md,
  },
  weatherInfo: {
    alignItems: 'center',
  },
  temperature: {
    ...typography.h1,
    color: colors.neutral[900],
  },
  condition: {
    ...typography.h3,
    color: colors.neutral[700],
    marginTop: spacing.xs,
  },
  weatherDetails: {
    flexDirection: 'row',
    marginTop: spacing.sm,
    gap: spacing.md,
  },
  detail: {
    ...typography.body2,
    color: colors.neutral[600],
  },
  sectionCard: {
    padding: spacing.md,
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
    ...typography.body1,
    color: colors.neutral[900],
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
  errorText: {
    ...typography.body1,
    color: colors.error[500],
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  farmItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  farmInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  farmName: {
    ...typography.bodyLarge,
    color: colors.neutral[800],
    marginBottom: spacing.xs,
  },
  farmDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  farmDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  farmDetailText: {
    ...typography.bodySmall,
    color: colors.neutral[600],
  },
  noFarmsText: {
    ...typography.bodyMedium,
    color: colors.neutral[600],
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
  addFarmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    marginTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  addFarmText: {
    ...typography.button,
    color: colors.primary[500],
  },
});