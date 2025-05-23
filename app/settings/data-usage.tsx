import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography } from '@/theme';
import { Card } from '@/components/Card';
import { Header } from '@/components/Header';
import { Database, User, Clock, Mail } from 'lucide-react-native';
import { useUser } from '@/contexts/UserContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

interface UserData {
  displayName: string;
  email: string;
  lastLogin: {
    toDate: () => Date;
  };
  createdAt: {
    toDate: () => Date;
  };
}

export default function DataUsageScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;
      
      try {
        const userDoc = await getDoc(doc(db, 'users', user.id));
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user?.id]);

  const formatDate = (timestamp: { toDate: () => Date } | undefined) => {
    if (!timestamp) return 'Never';
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header 
          title="Data Usage"
          showBackButton
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading user data...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header 
        title="Data Usage"
        showBackButton
      />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <User size={24} color={colors.primary[500]} />
              <Text style={styles.cardTitle}>Account Information</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>Display Name</Text>
              <Text style={styles.infoValue}>{userData?.displayName || 'Not set'}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{userData?.email || 'Not set'}</Text>
            </View>
          </Card>

          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Clock size={24} color={colors.primary[500]} />
              <Text style={styles.cardTitle}>Activity</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>Last Login</Text>
              <Text style={styles.infoValue}>{formatDate(userData?.lastLogin)}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>Account Created</Text>
              <Text style={styles.infoValue}>{formatDate(userData?.createdAt)}</Text>
            </View>
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
    gap: spacing.lg,
  },
  card: {
    padding: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  cardTitle: {
    ...typography.headingSmall,
    color: colors.neutral[900],
  },
  infoContainer: {
    marginBottom: spacing.md,
  },
  infoLabel: {
    ...typography.bodySmall,
    color: colors.neutral[600],
    marginBottom: spacing.xs,
  },
  infoValue: {
    ...typography.bodyMedium,
    color: colors.neutral[900],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.bodyMedium,
    color: colors.neutral[600],
  },
}); 