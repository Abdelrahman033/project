import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography } from '@/theme';
import { Card } from '@/components/Card';
import { Header } from '@/components/Header';
import { Bell, Mail, Share2 } from 'lucide-react-native';
import { useUser } from '@/contexts/UserContext';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

interface PrivacySettings {
  personalizedAds: boolean;
  emailNotifications: boolean;
  marketingEmails: boolean;
}

export default function PrivacySettingsScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [settings, setSettings] = useState<PrivacySettings>({
    personalizedAds: false,
    emailNotifications: false,
    marketingEmails: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const unsubscribe = onSnapshot(
      doc(db, 'users', user.id, 'privacySettings', 'settings'),
      (doc) => {
        if (doc.exists()) {
          setSettings(doc.data() as PrivacySettings);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching privacy settings:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.id]);

  const updateSetting = async (key: keyof PrivacySettings, value: boolean) => {
    if (!user?.id) return;

    try {
      const newSettings = { ...settings, [key]: value };
      await setDoc(
        doc(db, 'users', user.id, 'privacySettings', 'settings'),
        newSettings,
        { merge: true }
      );
    } catch (error) {
      console.error('Error updating privacy settings:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header 
          title="Privacy Settings"
          showBackButton
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading privacy settings...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header 
        title="Privacy Settings"
        showBackButton
      />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          <Card style={styles.card}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Share2 size={20} color={colors.neutral[600]} />
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingText}>Personalized Ads</Text>
                  <Text style={styles.settingSubtext}>
                    Show ads based on your interests
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.personalizedAds}
                onValueChange={(value) => updateSetting('personalizedAds', value)}
                trackColor={{ false: colors.neutral[300], true: colors.primary[300] }}
                thumbColor={settings.personalizedAds ? colors.primary[500] : colors.neutral[400]}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Bell size={20} color={colors.neutral[600]} />
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingText}>Email Notifications</Text>
                  <Text style={styles.settingSubtext}>
                    Receive important updates via email
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.emailNotifications}
                onValueChange={(value) => updateSetting('emailNotifications', value)}
                trackColor={{ false: colors.neutral[300], true: colors.primary[300] }}
                thumbColor={settings.emailNotifications ? colors.primary[500] : colors.neutral[400]}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Mail size={20} color={colors.neutral[600]} />
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingText}>Marketing Emails</Text>
                  <Text style={styles.settingSubtext}>
                    Receive promotional offers and updates
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.marketingEmails}
                onValueChange={(value) => updateSetting('marketingEmails', value)}
                trackColor={{ false: colors.neutral[300], true: colors.primary[300] }}
                thumbColor={settings.marketingEmails ? colors.primary[500] : colors.neutral[400]}
              />
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  settingTextContainer: {
    flex: 1,
    gap: spacing.xs,
  },
  settingText: {
    ...typography.bodyMedium,
    color: colors.neutral[900],
  },
  settingSubtext: {
    ...typography.bodySmall,
    color: colors.neutral[600],
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