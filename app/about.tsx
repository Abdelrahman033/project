import React, { useEffect, ReactNode } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { colors, spacing, typography } from '@/theme';
import { Target, ListChecks, Mail, Leaf, LucideIcon } from 'lucide-react-native';

interface AboutSectionProps {
  title: string;
  children: ReactNode;
  icon: LucideIcon;
}

// Reusable section component for consistent styling
const AboutSection = ({ title, children, icon: Icon }: AboutSectionProps) => (
  <Card style={styles.section}>
    <View style={styles.sectionHeader}>
      <Icon size={24} color={colors.primary[500]} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    {children}
  </Card>
);

export default function AboutScreen() {
  // Fade-in animation
  const fadeAnim = new Animated.Value(0);
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <Header title="About Soil Pulse" showBackButton />
      <Animated.ScrollView 
        style={[styles.content, { opacity: fadeAnim }]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>About Soil Pulse</Text>
        <Text style={styles.description}>
          Soil Pulse is a revolutionary soil analysis application that helps farmers and agricultural professionals 
          monitor and improve soil health. Our mission is to make soil analysis accessible and easy to understand 
          for everyone in the agricultural industry.
        </Text>

        <AboutSection title="Our Mission" icon={Target}>
          <Text style={styles.description}>
            We believe that healthy soil is the foundation of sustainable agriculture. By providing accurate and 
            easy-to-understand soil analysis, we help farmers make informed decisions about their land management 
            practices.
          </Text>
        </AboutSection>

        <AboutSection title="Features" icon={ListChecks}>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Leaf size={16} color={colors.primary[500]} />
              <Text style={styles.featureText}>Real-time soil analysis</Text>
            </View>
            <View style={styles.featureItem}>
              <Leaf size={16} color={colors.primary[500]} />
              <Text style={styles.featureText}>Detailed nutrient reports</Text>
            </View>
            <View style={styles.featureItem}>
              <Leaf size={16} color={colors.primary[500]} />
              <Text style={styles.featureText}>Historical data tracking</Text>
            </View>
            <View style={styles.featureItem}>
              <Leaf size={16} color={colors.primary[500]} />
              <Text style={styles.featureText}>Expert recommendations</Text>
            </View>
            <View style={styles.featureItem}>
              <Leaf size={16} color={colors.primary[500]} />
              <Text style={styles.featureText}>Multi-farm management</Text>
            </View>
          </View>
        </AboutSection>

        <AboutSection title="Contact Us" icon={Mail}>
          <Text style={styles.description}>
            Have questions or need support? Reach out to our team at support@soilpulse.com
          </Text>
        </AboutSection>

        <Text style={styles.version}>Version 1.0.0</Text>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[100],
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  title: {
    ...typography.headingLarge,
    color: colors.neutral[800],
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  description: {
    ...typography.bodyMedium,
    color: colors.neutral[700],
    lineHeight: 24,
  },
  section: {
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.headingSmall,
    color: colors.neutral[800],
    marginLeft: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  featuresList: {
    gap: spacing.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  featureText: {
    ...typography.bodyMedium,
    color: colors.neutral[700],
  },
  version: {
    ...typography.bodySmall,
    color: colors.neutral[500],
    textAlign: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
}); 