import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography } from '@/theme';
import { Card } from '@/components/Card';
import { Header } from '@/components/Header';
import {
  LogIn,
  LogOut,
  Key,
  Smartphone,
  Globe,
  AlertTriangle,
  Clock,
} from 'lucide-react-native';

// Mock activity data
const mockActivities = [
  {
    id: '1',
    type: 'login',
    title: 'Logged in from new device',
    description: 'iPhone 13 Pro • iOS 15.4',
    timestamp: '2024-03-15T10:30:00Z',
    icon: LogIn,
  },
  {
    id: '2',
    type: 'security',
    title: 'Password changed',
    description: 'Your account password was updated',
    timestamp: '2024-03-14T15:45:00Z',
    icon: Key,
  },
  {
    id: '3',
    type: 'device',
    title: 'New device connected',
    description: 'iPad Pro • iPadOS 16.2',
    timestamp: '2024-03-13T09:15:00Z',
    icon: Smartphone,
  },
  {
    id: '4',
    type: 'location',
    title: 'Login from new location',
    description: 'New York, United States',
    timestamp: '2024-03-12T18:20:00Z',
    icon: Globe,
  },
  {
    id: '5',
    type: 'security',
    title: 'Failed login attempt',
    description: 'Multiple failed attempts detected',
    timestamp: '2024-03-11T14:10:00Z',
    icon: AlertTriangle,
  },
];

// Activity Item Component
const ActivityItem = ({ 
  activity 
}: { 
  activity: typeof mockActivities[0];
}) => {
  const Icon = activity.icon;
  const date = new Date(activity.timestamp);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={styles.activityItem}>
      <View style={styles.activityLeft}>
        <View style={styles.iconContainer}>
          <Icon size={20} color={colors.neutral[600]} />
        </View>
        <View style={styles.activityContent}>
          <Text style={styles.activityTitle}>{activity.title}</Text>
          <Text style={styles.activityDescription}>{activity.description}</Text>
        </View>
      </View>
      <View style={styles.activityRight}>
        <Text style={styles.activityDate}>{formattedDate}</Text>
        <Text style={styles.activityTime}>{formattedTime}</Text>
      </View>
    </View>
  );
};

export default function ActivityLogScreen() {
  return (
    <View style={styles.container}>
      <Header 
        title="Activity Log"
        showBackButton
      />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          <Card style={styles.activitiesCard}>
            {mockActivities.map((activity) => (
              <React.Fragment key={activity.id}>
                <ActivityItem activity={activity} />
                {activity.id !== mockActivities[mockActivities.length - 1].id && (
                  <View style={styles.divider} />
                )}
              </React.Fragment>
            ))}
          </Card>
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
  activitiesCard: {
    padding: spacing.md,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  activityLeft: {
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
  activityContent: {
    flex: 1,
    gap: spacing.xs,
  },
  activityTitle: {
    ...typography.bodyMedium,
    color: colors.neutral[900],
  },
  activityDescription: {
    ...typography.bodySmall,
    color: colors.neutral[600],
  },
  activityRight: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  activityDate: {
    ...typography.bodySmall,
    color: colors.neutral[700],
  },
  activityTime: {
    ...typography.bodySmall,
    color: colors.neutral[500],
  },
  divider: {
    height: 1,
    backgroundColor: colors.neutral[200],
    marginVertical: spacing.xs,
  },
}); 