import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { colors, spacing, typography } from '@/theme';
import { Card } from './Card';

interface ProfileSectionProps {
  title: string;
  children: React.ReactNode;
}

export const ProfileSection = ({ title, children }: ProfileSectionProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Card style={styles.content}>
        {children}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.headingSmall,
    color: colors.neutral[800],
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  content: {
    padding: spacing.sm,
  },
}); 