import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography } from '@/theme';
import { Card } from '@/components/Card';
import { Header } from '@/components/Header';
import {
  Smartphone,
  Laptop,
  Tablet,
  LogOut,
  Check,
  AlertTriangle,
} from 'lucide-react-native';

// Mock devices data
const mockDevices = [
  {
    id: '1',
    name: 'iPhone 13 Pro',
    type: 'mobile',
    os: 'iOS 15.4',
    lastActive: '2024-03-15T10:30:00Z',
    isCurrent: true,
    icon: Smartphone,
  },
  {
    id: '2',
    name: 'MacBook Pro',
    type: 'desktop',
    os: 'macOS 12.3',
    lastActive: '2024-03-14T15:45:00Z',
    isCurrent: false,
    icon: Laptop,
  },
  {
    id: '3',
    name: 'iPad Pro',
    type: 'tablet',
    os: 'iPadOS 16.2',
    lastActive: '2024-03-13T09:15:00Z',
    isCurrent: false,
    icon: Tablet,
  },
];

// Device Item Component
const DeviceItem = ({ 
  device,
  onLogout,
}: { 
  device: typeof mockDevices[0];
  onLogout: (deviceId: string) => void;
}) => {
  const Icon = device.icon;
  const date = new Date(device.lastActive);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={styles.deviceItem}>
      <View style={styles.deviceLeft}>
        <View style={styles.iconContainer}>
          <Icon size={20} color={colors.neutral[600]} />
        </View>
        <View style={styles.deviceContent}>
          <View style={styles.deviceHeader}>
            <Text style={styles.deviceName}>{device.name}</Text>
            {device.isCurrent && (
              <View style={styles.currentBadge}>
                <Check size={14} color={colors.white} />
                <Text style={styles.currentText}>Current</Text>
              </View>
            )}
          </View>
          <Text style={styles.deviceInfo}>{device.os}</Text>
          <Text style={styles.deviceLastActive}>
            Last active: {formattedDate} at {formattedTime}
          </Text>
        </View>
      </View>
      {!device.isCurrent && (
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => onLogout(device.id)}
        >
          <LogOut size={20} color={colors.error[500]} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default function DevicesScreen() {
  const [devices, setDevices] = useState(mockDevices);

  const handleLogout = (deviceId: string) => {
    Alert.alert(
      'Log Out Device',
      'Are you sure you want to log out this device?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement device logout
            setDevices(devices.filter(device => device.id !== deviceId));
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Manage Devices"
        showBackButton
      />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          <Card style={styles.devicesCard}>
            {devices.map((device) => (
              <React.Fragment key={device.id}>
                <DeviceItem 
                  device={device}
                  onLogout={handleLogout}
                />
                {device.id !== devices[devices.length - 1].id && (
                  <View style={styles.divider} />
                )}
              </React.Fragment>
            ))}
          </Card>

          <View style={styles.infoCard}>
            <AlertTriangle size={20} color={colors.warning[500]} />
            <Text style={styles.infoText}>
              Logging out a device will immediately sign out that device and require re-authentication.
            </Text>
          </View>
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
    gap: spacing.xl,
  },
  devicesCard: {
    padding: spacing.md,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  deviceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceContent: {
    flex: 1,
    gap: spacing.xs,
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  deviceName: {
    ...typography.bodyMedium,
    color: colors.neutral[900],
  },
  currentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.sm,
  },
  currentText: {
    ...typography.labelSmall,
    color: colors.white,
  },
  deviceInfo: {
    ...typography.bodySmall,
    color: colors.neutral[700],
  },
  deviceLastActive: {
    ...typography.bodySmall,
    color: colors.neutral[600],
  },
  logoutButton: {
    padding: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.neutral[200],
    marginVertical: spacing.xs,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.warning[50],
    padding: spacing.md,
    borderRadius: spacing.sm,
  },
  infoText: {
    ...typography.bodySmall,
    color: colors.warning[700],
    flex: 1,
  },
}); 