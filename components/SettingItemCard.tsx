import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { colors, spacing, typography } from '@/theme';

interface SettingItemCardProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  onPress: () => void;
}

export function SettingItemCard({ icon, title, description, onPress }: SettingItemCardProps) {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          {icon}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {description && (
            <Text style={styles.description}>{description}</Text>
          )}
        </View>
        <ChevronRight size={20} color={colors.neutral[400]} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: spacing.sm,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: spacing.sm,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...typography.subtitle1,
    color: colors.neutral[900],
    marginBottom: spacing.xs,
  },
  description: {
    ...typography.body2,
    color: colors.neutral[600],
  },
}); 