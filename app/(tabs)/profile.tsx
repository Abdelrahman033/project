import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { colors, spacing, typography } from '@/theme';
import { useRouter } from 'expo-router';
import { User } from '@/types';
import { 
  LogOut, 
  User as UserIcon, 
  Settings, 
  Bell, 
  HelpCircle, 
  Shield, 
  Globe, 
  Database,
  ArrowRight,
  PlusCircle,
  MapPin,
  ChevronRight,
} from 'lucide-react-native';

// Mock user data
const mockUser: User = {
  id: 'user1',
  email: 'john.doe@example.com',
  name: 'John Doe',
  role: 'farmer',
  profileImageUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
  farms: [
    {
      id: 'farm1',
      name: 'Green Valley Farm',
      location: {
        latitude: 37.7749,
        longitude: -122.4194,
      },
      size: 250,
      crops: ['Corn', 'Soybeans', 'Wheat'],
    },
    {
      id: 'farm2',
      name: 'Sunset Hills',
      location: {
        latitude: 37.7849,
        longitude: -122.4294,
      },
      size: 180,
      crops: ['Rice', 'Cotton'],
    },
  ],
};

export default function ProfileScreen() {
  const router = useRouter();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [highQualityImages, setHighQualityImages] = useState(true);
  
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            // Clear authentication and navigate to login
            router.replace('/(auth)/login');
          },
          style: 'destructive',
        },
      ]
    );
  };
  
  const handleEditProfile = () => {
    router.push('/profile/edit');
  };
  
  const handleSettingsPress = () => {
    router.push('/settings');
  };
  
  const handleFarmPress = (farmId: string) => {
    router.push(`/farm/${farmId}`);
  };
  
  const handleAddFarm = () => {
    router.push('/farm/add');
  };
  
  const handleAdvancedSettingsPress = () => {
    router.push('/settings/advanced');
  };
  
  return (
    <View style={styles.container}>
      <Header title="Profile" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.profileSection}>
          <Image 
            source={{ uri: mockUser.profileImageUrl }}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>{mockUser.name}</Text>
          <Text style={styles.profileEmail}>{mockUser.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>
              {mockUser.role.charAt(0).toUpperCase() + mockUser.role.slice(1)}
            </Text>
          </View>
          
          <Button
            title="Edit Profile"
            variant="outline"
            size="small"
            onPress={handleEditProfile}
            style={styles.editButton}
            icon={<UserIcon size={16} color={colors.primary[500]} />}
          />
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Farms</Text>
            <TouchableOpacity 
              style={styles.addFarmButton}
              onPress={handleAddFarm}
            >
              <PlusCircle size={20} color={colors.primary[500]} />
              <Text style={styles.addFarmText}>Add Farm</Text>
            </TouchableOpacity>
          </View>
          
          {mockUser.farms?.map(farm => (
            <Card 
              key={farm.id}
              onPress={() => handleFarmPress(farm.id)}
              style={styles.farmCard}
            >
              <View style={styles.farmHeader}>
                <View style={styles.farmTitleContainer}>
                  <Text style={styles.farmName}>{farm.name}</Text>
                  <View style={styles.farmSizeBadge}>
                    <Text style={styles.farmSizeText}>{farm.size.toLocaleString()} m²</Text>
                  </View>
                </View>
                <ArrowRight size={20} color={colors.neutral[400]} />
              </View>
              
              <View style={styles.farmDetails}>
                <View style={styles.farmDetailRow}>
                  <MapPin size={16} color={colors.neutral[600]} />
                  <Text style={styles.farmLocation}>
                    {farm.location.latitude.toFixed(4)}, {farm.location.longitude.toFixed(4)}
                  </Text>
                </View>
                
                <View style={styles.cropContainer}>
                  <Text style={styles.cropsLabel}>Crops: </Text>
                  <View style={styles.cropTags}>
                    {farm.crops.map((crop, index) => (
                      <View key={index} style={styles.cropTag}>
                        <Text style={styles.cropTagText}>{crop}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </Card>
          ))}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <Card style={styles.settingsCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingLabelContainer}>
                <Bell size={20} color={colors.neutral[600]} />
                <Text style={styles.settingLabel}>Push Notifications</Text>
              </View>
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                trackColor={{ false: colors.neutral[300], true: colors.primary[300] }}
                thumbColor={pushNotifications ? colors.primary[500] : colors.neutral[100]}
              />
            </View>
            
            <View style={styles.settingItem}>
              <View style={styles.settingLabelContainer}>
                <Globe size={20} color={colors.neutral[600]} />
                <Text style={styles.settingLabel}>Email Notifications</Text>
              </View>
              <Switch
                value={emailNotifications}
                onValueChange={setEmailNotifications}
                trackColor={{ false: colors.neutral[300], true: colors.primary[300] }}
                thumbColor={emailNotifications ? colors.primary[500] : colors.neutral[100]}
              />
            </View>
            
            <View style={styles.settingItem}>
              <View style={styles.settingLabelContainer}>
                <Database size={20} color={colors.neutral[600]} />
                <Text style={styles.settingLabel}>Offline Mode</Text>
              </View>
              <Switch
                value={offlineMode}
                onValueChange={setOfflineMode}
                trackColor={{ false: colors.neutral[300], true: colors.primary[300] }}
                thumbColor={offlineMode ? colors.primary[500] : colors.neutral[100]}
              />
            </View>
            
            <View style={styles.settingItem}>
              <View style={styles.settingLabelContainer}>
                <Image size={20} color={colors.neutral[600]} />
                <Text style={styles.settingLabel}>High Quality Images</Text>
              </View>
              <Switch
                value={highQualityImages}
                onValueChange={setHighQualityImages}
                trackColor={{ false: colors.neutral[300], true: colors.primary[300] }}
                thumbColor={highQualityImages ? colors.primary[500] : colors.neutral[100]}
              />
            </View>
          </Card>
          
          <TouchableOpacity 
            style={styles.settingButton}
            onPress={handleAdvancedSettingsPress}
          >
            <Settings size={20} color={colors.neutral[700]} />
            <Text style={styles.settingButtonText}>Advanced Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingButton}
            onPress={() => router.push('/help')}
          >
            <HelpCircle size={20} color={colors.neutral[700]} />
            <Text style={styles.settingButtonText}>Help & Support</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/privacy')}
          >
            <View style={styles.menuItemLeft}>
              <Shield size={20} color={colors.neutral[600]} />
              <Text style={styles.menuItemText}>Privacy & Security</Text>
            </View>
            <ChevronRight size={20} color={colors.neutral[400]} />
          </TouchableOpacity>
        </View>
        
        <Button
          title="Logout"
          variant="outline"
          onPress={handleLogout}
          style={styles.logoutButton}
          icon={<LogOut size={20} color={colors.error[500]} />}
          textStyle={{ color: colors.error[500] }}
        />
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
  profileSection: {
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: spacing.md,
  },
  profileName: {
    ...typography.headingMedium,
    color: colors.neutral[800],
  },
  profileEmail: {
    ...typography.bodyMedium,
    color: colors.neutral[600],
    marginTop: spacing.xs,
  },
  roleBadge: {
    backgroundColor: colors.primary[100],
    paddingVertical: spacing.xxs,
    paddingHorizontal: spacing.sm,
    borderRadius: spacing.sm,
    marginTop: spacing.sm,
  },
  roleText: {
    ...typography.labelSmall,
    color: colors.primary[700],
  },
  editButton: {
    marginTop: spacing.md,
  },
  section: {
    padding: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.headingSmall,
    color: colors.neutral[800],
  },
  farmCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  farmHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  farmTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  farmName: {
    ...typography.labelLarge,
    color: colors.neutral[800],
    marginRight: spacing.sm,
  },
  farmSizeBadge: {
    backgroundColor: colors.primary[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: spacing.sm,
  },
  farmSizeText: {
    ...typography.labelSmall,
    color: colors.primary[700],
  },
  farmDetails: {
    marginTop: spacing.sm,
  },
  farmDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  farmLocation: {
    ...typography.bodySmall,
    color: colors.neutral[600],
    marginLeft: spacing.xs,
  },
  cropContainer: {
    marginTop: spacing.xs,
  },
  cropsLabel: {
    ...typography.bodySmall,
    color: colors.neutral[600],
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  cropTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  cropTag: {
    backgroundColor: colors.neutral[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: spacing.sm,
  },
  cropTagText: {
    ...typography.labelSmall,
    color: colors.neutral[700],
  },
  settingsCard: {
    marginBottom: spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    ...typography.labelMedium,
    color: colors.neutral[700],
    marginLeft: spacing.sm,
  },
  settingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: spacing.sm,
    marginBottom: spacing.sm,
  },
  settingButtonText: {
    ...typography.bodyMedium,
    color: colors.neutral[800],
    marginLeft: spacing.md,
  },
  logoutButton: {
    marginHorizontal: spacing.md,
    marginVertical: spacing.xl,
    borderColor: colors.error[300],
  },
  addFarmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.sm,
  },
  addFarmText: {
    ...typography.labelMedium,
    color: colors.primary[500],
    marginLeft: spacing.xs,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: spacing.sm,
    marginBottom: spacing.sm,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    ...typography.bodyMedium,
    color: colors.neutral[800],
    marginLeft: spacing.md,
  },
});