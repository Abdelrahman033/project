import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Switch } from 'react-native';
import { colors, spacing, typography } from '@/theme';
import { ChevronRight } from 'lucide-react-native';

interface SettingItemProps {
  icon: React.ElementType;
  title: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
  rightElement?: React.ReactNode;
  isToggle?: boolean;
  toggleValue?: boolean;
  onToggleChange?: (value: boolean) => void;
}

export const SettingItem = ({
  icon: Icon,
  title,
  value,
  onPress,
  showChevron = true,
  rightElement,
  isToggle = false,
  toggleValue,
  onToggleChange,
}: SettingItemProps) => {
  const content = (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Icon size={20} color={colors.neutral[600]} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {value && <Text style={styles.value}>{value}</Text>}
        </View>
      </View>
      <View style={styles.rightSection}>
        {isToggle && onToggleChange && (
          <Switch
            value={toggleValue}
            onValueChange={onToggleChange}
            trackColor={{ false: colors.neutral[300], true: colors.primary[500] }}
            thumbColor={colors.white}
          />
        )}
        {rightElement}
        {showChevron && !isToggle && (
          <ChevronRight size={20} color={colors.neutral[400]} />
        )}
      </View>
    </View>
  );

  if (onPress && !isToggle) {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={styles.touchable}
        accessibilityRole="button"
        accessibilityLabel={title}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  touchable: {
    borderRadius: spacing.sm,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.sm,
    borderRadius: spacing.sm,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...typography.bodyMedium,
    color: colors.neutral[800],
  },
  value: {
    ...typography.bodySmall,
    color: colors.neutral[600],
    marginTop: spacing.xxs,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
}); 