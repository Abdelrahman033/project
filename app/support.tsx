import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity, Animated } from 'react-native';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { colors, spacing, typography } from '@/theme';
import { Phone, Mail, MessageCircle, HelpCircle, ChevronRight, LucideIcon } from 'lucide-react-native';

interface ContactMethodProps {
  icon: LucideIcon;
  title: string;
  value: string;
  onPress: () => void;
  color?: string;
}

interface FAQItemProps {
  question: string;
  answer: string;
}

// Reusable contact method component
const ContactMethod = ({ icon: Icon, title, value, onPress, color = colors.primary[500] }: ContactMethodProps) => (
  <TouchableOpacity onPress={onPress} style={styles.contactMethod}>
    <View style={styles.contactIcon}>
      <Icon size={24} color={color} />
    </View>
    <View style={styles.contactInfo}>
      <Text style={styles.contactTitle}>{title}</Text>
      <Text style={styles.contactValue}>{value}</Text>
    </View>
    <ChevronRight size={20} color={colors.neutral[400]} />
  </TouchableOpacity>
);

// Reusable FAQ item component
const FAQItem = ({ question, answer }: FAQItemProps) => (
  <Card style={styles.faqItem}>
    <Text style={styles.question}>{question}</Text>
    <Text style={styles.answer}>{answer}</Text>
  </Card>
);

export default function SupportScreen() {
  // Fade-in animation
  const fadeAnim = new Animated.Value(0);
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePhonePress = () => {
    Linking.openURL('tel:+201067882339');
  };

  const handleWhatsAppPress = () => {
    Linking.openURL('https://wa.me/201067882339');
  };

  const handleEmailPress = () => {
    Linking.openURL('mailto:support@soilpulse.com');
  };

  return (
    <View style={styles.container}>
      <Header title="Support" showBackButton />
      <Animated.ScrollView 
        style={[styles.content, { opacity: fadeAnim }]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>How can we help you?</Text>
        <Text style={styles.description}>
          Choose your preferred contact method or check our frequently asked questions below.
        </Text>

        <Card style={styles.contactCard}>
          <ContactMethod
            icon={Phone}
            title="Call Us"
            value="+20 106 788 2339"
            onPress={handlePhonePress}
          />
          <View style={styles.divider} />
          <ContactMethod
            icon={MessageCircle}
            title="Chat on WhatsApp"
            value="Message us on WhatsApp"
            onPress={handleWhatsAppPress}
            color="#25D366"
          />
          <View style={styles.divider} />
          <ContactMethod
            icon={Mail}
            title="Email Us"
            value="support@soilpulse.com"
            onPress={handleEmailPress}
          />
        </Card>

        <View style={styles.faqSection}>
          <View style={styles.faqHeader}>
            <HelpCircle size={24} color={colors.primary[500]} />
            <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
          </View>

          <FAQItem
            question="How do I add a new farm?"
            answer="To add a new farm, go to the Farms tab and tap the + button. Follow the on-screen instructions to enter your farm details and location."
          />

          <FAQItem
            question="How accurate are the soil analysis results?"
            answer="Our soil analysis uses advanced technology to provide highly accurate results. However, we recommend regular testing to track changes over time."
          />

          <FAQItem
            question="Can I export my farm data?"
            answer="Yes, you can export your farm data in various formats. Go to the farm details screen and tap the export button to choose your preferred format."
          />

          <FAQItem
            question="How often should I test my soil?"
            answer="We recommend testing your soil at least once per growing season. However, the frequency may vary depending on your crops and farming practices."
          />
        </View>
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
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  description: {
    ...typography.bodyMedium,
    color: colors.neutral[700],
    marginBottom: spacing.xl,
    textAlign: 'center',
    lineHeight: 24,
  },
  contactCard: {
    marginBottom: spacing.xl,
    padding: spacing.md,
  },
  contactMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    ...typography.labelLarge,
    color: colors.neutral[800],
    marginBottom: 2,
  },
  contactValue: {
    ...typography.bodyMedium,
    color: colors.neutral[600],
  },
  divider: {
    height: 1,
    backgroundColor: colors.neutral[200],
    marginVertical: spacing.sm,
  },
  faqSection: {
    marginBottom: spacing.xl,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  faqTitle: {
    ...typography.headingSmall,
    color: colors.neutral[800],
    marginLeft: spacing.sm,
  },
  faqItem: {
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  question: {
    ...typography.labelLarge,
    color: colors.neutral[800],
    marginBottom: spacing.sm,
  },
  answer: {
    ...typography.bodyMedium,
    color: colors.neutral[700],
    lineHeight: 24,
  },
}); 