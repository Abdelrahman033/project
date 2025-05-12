import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '../context/UserContext';
import { colors, spacing, typography } from '@/theme';
import { Card } from '@/components/Card';
import { 
  User, 
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
  Camera,
  Activity,
  FileText,
  Clock
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Reusable Components
const ProfileHeader = ({ user, onEditCover, onEditProfile }: { 
  user: any; 
  onEditCover: () => void;
  onEditProfile: () => void;
}) => (
  <View style={styles.headerContainer}>
    <View style={styles.coverPhotoContainer}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }}
        style={styles.coverPhoto}
      />
      <View style={styles.coverOverlay} />
      <TouchableOpacity 
        style={styles.editCoverButton}
        onPress={onEditCover}
        accessibilityRole="button"
        accessibilityLabel="Edit Cover Photo"
      >
        <Camera size={20} color={colors.white} />
      </TouchableOpacity>
    </View>
    
    <View style={styles.profileImageContainer}>
      <View style={styles.profileImageWrapper}>
        <Image
          source={{ uri: 'https://ui-avatars.com/api/?name=' + (user?.name || 'User') }}
          style={styles.profileImage}
        />
        <View style={styles.profileImageBorder} />
      </View>
      <TouchableOpacity 
        style={styles.editProfileImageButton}
        onPress={onEditProfile}
        accessibilityRole="button"
        accessibilityLabel="Edit Profile Picture"
      >
        <Camera size={16} color={colors.white} />
      </TouchableOpacity>
    </View>

    <View style={styles.profileInfo}>
      <View style={styles.nameContainer}>
        <Text style={styles.name}>{user?.name || 'Guest'}</Text>
        <View style={styles.roleContainer}>
          <User size={16} color={colors.primary[500]} />
          <Text style={styles.role}>Farm Owner</Text>
        </View>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>24</Text>
          <Text style={styles.statLabel}>Scans</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>8</Text>
          <Text style={styles.statLabel}>Reports</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>2d</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.editProfileButton}
        onPress={onEditProfile}
        accessibilityRole="button"
        accessibilityLabel="Edit Profile"
      >
        <Edit2 size={16} color={colors.white} />
        <Text style={styles.editProfileText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const InfoSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Card style={styles.sectionCard}>
      {children}
    </Card>
  </View>
);

const InfoItem = ({ icon: Icon, label, value }: { 
  icon: React.ElementType; 
  label: string; 
  value: string;
}) => (
  <View style={styles.infoItem}>
    <Icon size={20} color={colors.neutral[600]} />
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const SettingItem = ({ 
  icon: Icon, 
  title, 
  onPress 
}: { 
  icon: React.ElementType; 
  title: string; 
  onPress: () => void;
}) => (
  <TouchableOpacity 
    style={styles.settingItem}
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={title}
  >
    <Icon size={20} color={colors.neutral[600]} />
    <Text style={styles.settingText}>{title}</Text>
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useUser();

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
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <ProfileHeader 
          user={user}
          onEditCover={() => router.push('/profile/edit-cover')}
          onEditProfile={() => router.push('/profile/edit')}
        />

        <View style={styles.content}>
          {/* General Information Section */}
          <InfoSection title="General Information">
            <InfoItem 
              icon={Mail}
              label="Email"
              value={user?.email || 'Not provided'}
            />
            <InfoItem 
              icon={Phone}
              label="Phone"
              value={user?.phone || 'Not provided'}
            />
            <InfoItem 
              icon={MapPin}
              label="Location"
              value={user?.location || 'Not provided'}
            />
            <InfoItem 
              icon={User}
              label="Farm Name"
              value={user?.farmName || 'Not provided'}
            />
          </InfoSection>

          {/* Farm Activity Section */}
          <InfoSection title="Farm Activity">
            <View style={styles.activityGrid}>
              <View style={styles.activityItem}>
                <Activity size={24} color={colors.primary[500]} />
                <Text style={styles.activityValue}>24</Text>
                <Text style={styles.activityLabel}>Total Scans</Text>
              </View>
              <View style={styles.activityItem}>
                <FileText size={24} color={colors.warning[500]} />
                <Text style={styles.activityValue}>8</Text>
                <Text style={styles.activityLabel}>Reports</Text>
              </View>
              <View style={styles.activityItem}>
                <Clock size={24} color={colors.success[500]} />
                <Text style={styles.activityValue}>2d</Text>
                <Text style={styles.activityLabel}>Last Active</Text>
              </View>
            </View>
          </InfoSection>

          {/* Add Farm Section */}
          {!user?.farmName && (
            <TouchableOpacity 
              style={styles.addFarmButton}
              onPress={() => router.push('/farm/add')}
              accessibilityRole="button"
              accessibilityLabel="Add Farm"
            >
              <Plus size={24} color={colors.white} />
              <Text style={styles.addFarmText}>Add Your Farm</Text>
            </TouchableOpacity>
          )}

          {/* Settings Section */}
          <InfoSection title="Settings">
            <SettingItem
              icon={Shield}
              title="Security Settings"
              onPress={() => router.push('/settings/security')}
            />
            <SettingItem
              icon={Settings}
              title="App Settings"
              onPress={() => router.push('/settings/app')}
            />
            <SettingItem
              icon={Info}
              title="About"
              onPress={() => router.push('/about')}
            />
            <SettingItem
              icon={HelpCircle}
              title="Help & Support"
              onPress={() => router.push('/help')}
            />
          </InfoSection>
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
    paddingBottom: 80, // Space for fixed logout button
  },
  headerContainer: {
    backgroundColor: colors.white,
    marginBottom: spacing.lg,
  },
  coverPhotoContainer: {
    height: 200,
    position: 'relative',
  },
  coverPhoto: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  editCoverButton: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: spacing.sm,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  profileImageContainer: {
    position: 'absolute',
    bottom: -50,
    left: spacing.lg,
  },
  profileImageWrapper: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: colors.white,
  },
  profileImageBorder: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 62,
    borderWidth: 2,
    borderColor: colors.primary[500],
    opacity: 0.5,
  },
  editProfileImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary[500],
    padding: spacing.xs,
    borderRadius: spacing.sm,
    borderWidth: 2,
    borderColor: colors.white,
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  profileInfo: {
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    backgroundColor: colors.white,
    borderBottomLeftRadius: spacing.lg,
    borderBottomRightRadius: spacing.lg,
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  nameContainer: {
    marginBottom: spacing.md,
  },
  name: {
    ...typography.headingLarge,
    color: colors.neutral[800],
    marginBottom: spacing.xxs,
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: spacing.sm,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.primary[100],
  },
  role: {
    ...typography.labelMedium,
    color: colors.primary[600],
    fontWeight: '600',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.neutral[50],
    padding: spacing.md,
    borderRadius: spacing.sm,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    ...typography.headingSmall,
    color: colors.neutral[800],
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    ...typography.labelSmall,
    color: colors.neutral[600],
    marginTop: spacing.xxs,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.neutral[200],
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: spacing.sm,
    alignSelf: 'flex-start',
    gap: spacing.sm,
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.primary[600],
  },
  editProfileText: {
    ...typography.labelMedium,
    color: colors.white,
    fontWeight: '600',
    fontSize: 15,
    letterSpacing: 0.3,
  },
  content: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.headingSmall,
    color: colors.neutral[800],
    marginBottom: spacing.sm,
  },
  sectionCard: {
    padding: spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  infoContent: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  infoLabel: {
    ...typography.labelSmall,
    color: colors.neutral[600],
  },
  infoValue: {
    ...typography.bodyMedium,
    color: colors.neutral[800],
  },
  activityGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  activityItem: {
    alignItems: 'center',
    flex: 1,
  },
  activityValue: {
    ...typography.headingSmall,
    color: colors.neutral[800],
    marginTop: spacing.xxs,
  },
  activityLabel: {
    ...typography.labelSmall,
    color: colors.neutral[600],
    marginTop: spacing.xxs,
  },
  addFarmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary[500],
    padding: spacing.md,
    borderRadius: spacing.sm,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  addFarmText: {
    ...typography.bodyMedium,
    color: colors.white,
    fontWeight: '600',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.sm,
    borderRadius: spacing.sm,
  },
  settingText: {
    ...typography.bodyMedium,
    color: colors.neutral[800],
  },
  logoutContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    backgroundColor: colors.error[50],
    borderRadius: spacing.sm,
    gap: spacing.sm,
  },
  logoutText: {
    ...typography.bodyMedium,
    color: colors.error[500],
    fontWeight: '600',
  },
});