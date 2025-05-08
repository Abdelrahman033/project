/**
 * Header component for the SoilSense AI app
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { colors, spacing, typography } from '../theme';
import { ArrowLeft, BellRing } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  showNotifications?: boolean;
  onNotificationsPress?: () => void;
  backgroundColor?: string;
  textColor?: string;
  rightComponent?: React.ReactNode;
}

export const Header = ({
  title,
  showBackButton = false,
  showNotifications = false,
  onNotificationsPress,
  backgroundColor = colors.white,
  textColor = colors.neutral[900],
  rightComponent,
}: HeaderProps) => {
  const router = useRouter();
  
  const handleBackPress = () => {
    router.back();
  };
  
  return (
    <>
      <StatusBar 
        barStyle={backgroundColor === colors.white ? 'dark-content' : 'light-content'}
        backgroundColor="transparent"
        translucent
      />
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <View style={styles.content}>
          <View style={styles.leftSection}>
            {showBackButton && (
              <TouchableOpacity
                onPress={handleBackPress}
                style={styles.backButton}
                accessibilityLabel="Back"
                accessibilityRole="button"
              >
                <ArrowLeft size={24} color={textColor} />
              </TouchableOpacity>
            )}
          </View>
          
          <Text 
            style={[styles.title, { color: textColor }]}
            numberOfLines={1}
            accessibilityRole="header"
          >
            {title}
          </Text>
          
          <View style={styles.rightSection}>
            {showNotifications && (
              <TouchableOpacity
                onPress={onNotificationsPress}
                style={styles.notificationButton}
                accessibilityLabel="Notifications"
                accessibilityRole="button"
              >
                <BellRing size={24} color={textColor} />
              </TouchableOpacity>
            )}
            {rightComponent}
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    height: 56,
  },
  leftSection: {
    width: 40,
    alignItems: 'flex-start',
  },
  backButton: {
    padding: spacing.xs,
  },
  title: {
    ...typography.headingMedium,
    flex: 1,
    textAlign: 'center',
  },
  rightSection: {
    width: 40,
    alignItems: 'flex-end',
  },
  notificationButton: {
    padding: spacing.xs,
  },
});