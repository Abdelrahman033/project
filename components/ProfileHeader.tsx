import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { User as UserIcon, Edit2 } from 'lucide-react-native';
import { colors, spacing, typography } from '@/theme';
import { User } from '@/types/auth';

interface ProfileHeaderProps {
  user: User | null;
  onEditPress: () => void;
}

export const ProfileHeader = ({ user, onEditPress }: ProfileHeaderProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <View style={styles.imageContainer}>
          {user?.profileImage ? (
            <Image 
              source={{ uri: user.profileImage }} 
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.placeholderImage}>
              <UserIcon size={40} color={colors.primary[500]} />
            </View>
          )}
          <TouchableOpacity 
            style={styles.editButton}
            onPress={onEditPress}
            accessibilityRole="button"
            accessibilityLabel="Edit Profile"
          >
            <Edit2 size={16} color={colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.name}>{user?.name || 'Guest'}</Text>
          <View style={styles.roleContainer}>
            <UserIcon size={16} color={colors.primary[500]} />
            <Text style={styles.role}>{user?.role || 'User'}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.primary[100],
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.primary[100],
  },
  editButton: {
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
  infoContainer: {
    alignItems: 'center',
  },
  name: {
    ...typography.headingLarge,
    color: colors.neutral[800],
    marginBottom: spacing.xxs,
    fontSize: 28,
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
    borderWidth: 1,
    borderColor: colors.primary[100],
  },
  role: {
    ...typography.labelMedium,
    color: colors.primary[600],
    fontWeight: '600',
    fontSize: 14,
  },
}); 