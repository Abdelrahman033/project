import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Animated,
} from 'react-native';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { colors, spacing, typography } from '@/theme';
import {
  MessageCircle,
  Phone,
  Mail,
  HelpCircle,
  ChevronRight,
  MessageSquare,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

// FAQ data
const faqData = [
  {
    question: 'How do I add a new farm?',
    answer: 'To add a new farm, go to your Profile page and click the "Add Farm" button. You\'ll need to provide the farm name, size in square meters, crops, and location. You can use your current location or enter coordinates manually.',
  },
  {
    question: 'How do I interpret soil analysis results?',
    answer: 'Soil analysis results show nutrient levels (nitrogen, phosphorus, potassium), pH level, and organic matter content. Green indicators mean optimal levels, yellow means moderate, and red indicates areas needing attention. Check our detailed guide in the Resources section.',
  },
  {
    question: 'What do the alerts mean?',
    answer: 'Alerts notify you about potential issues with your farm\'s soil health, such as nutrient deficiencies, pH imbalances, or disease risks. Each alert includes severity level and recommended actions.',
  },
  {
    question: 'How accurate is the location tracking?',
    answer: 'Our location tracking uses high-accuracy GPS when available. For best results, ensure your device\'s location services are enabled and you\'re outdoors with a clear view of the sky.',
  },
  {
    question: 'Can I export my farm data?',
    answer: 'Yes, you can export your farm data including soil analyses, trends, and reports. Go to the farm details page and use the export option in the menu.',
  },
];

export default function SupportScreen() {
  // Fade-in animation
  const fadeAnim = new Animated.Value(0);
  
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@soilpulse.com');
  };

  const handleCallSupport = () => {
    Linking.openURL('tel:+201067882339');
  };

  const handleWhatsAppSupport = () => {
    Linking.openURL('https://wa.me/201067882339');
  };

  const router = useRouter();

  return (
    <View style={styles.container}>
      <Header 
        title="Contact Support"
        showBackButton
      />
      <Animated.ScrollView 
        style={[styles.content, { opacity: fadeAnim }]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Contact Options */}
        <Card style={styles.contactCard}>
          <TouchableOpacity
            style={styles.contactItem}
            onPress={handleEmailSupport}
          >
            <View style={styles.contactLeft}>
              <Mail size={24} color={colors.primary[500]} />
              <View style={styles.contactInfo}>
                <Text style={styles.contactTitle}>Email Support</Text>
                <Text style={styles.contactText}>support@soilpulse.com</Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.neutral[600]} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactItem}
            onPress={handleCallSupport}
          >
            <View style={styles.contactLeft}>
              <Phone size={24} color={colors.primary[500]} />
              <View style={styles.contactInfo}>
                <Text style={styles.contactTitle}>Phone Support</Text>
                <Text style={styles.contactText}>+20 106 788 2339</Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.neutral[600]} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactItem}
            onPress={handleWhatsAppSupport}
          >
            <View style={styles.contactLeft}>
              <MessageSquare size={24} color="#25D366" />
              <View style={styles.contactInfo}>
                <Text style={styles.contactTitle}>WhatsApp Chat</Text>
                <Text style={styles.contactText}>Chat with us on WhatsApp</Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.neutral[600]} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => router.replace('/live-chat' as any)}
          >
            <View style={styles.contactLeft}>
              <MessageCircle size={24} color={colors.primary[500]} />
              <View style={styles.contactInfo}>
                <Text style={styles.contactTitle}>Live Chat</Text>
                <Text style={styles.contactText}>Chat with our support team</Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.neutral[600]} />
          </TouchableOpacity>
        </Card>

        {/* FAQ Section */}
        <View style={styles.faqSection}>
          <View style={styles.faqHeader}>
            <HelpCircle size={24} color={colors.primary[500]} />
            <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
          </View>
          <Card style={styles.faqCard}>
            {faqData.map((faq, index) => (
              <View key={index} style={styles.faqItem}>
                <View style={styles.faqQuestionContainer}>
                  <Text style={styles.question}>{faq.question}</Text>
                </View>
                <View style={styles.faqAnswerContainer}>
                  <Text style={styles.answer}>{faq.answer}</Text>
                </View>
              </View>
            ))}
          </Card>
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
  contactCard: {
    gap: spacing.sm,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  contactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  contactInfo: {
    gap: spacing.xs,
  },
  contactTitle: {
    ...typography.bodyMedium,
    color: colors.neutral[900],
  },
  contactText: {
    ...typography.bodySmall,
    color: colors.neutral[600],
  },
  faqSection: {
    marginTop: spacing.xl,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  faqTitle: {
    ...typography.headingSmall,
    color: colors.neutral[900],
  },
  faqCard: {
    gap: spacing.md,
    padding: spacing.md,
  },
  faqItem: {
    backgroundColor: colors.neutral[50],
    borderRadius: spacing.sm,
    overflow: 'hidden',
  },
  faqQuestionContainer: {
    padding: spacing.md,
    backgroundColor: colors.primary[50],
  },
  faqAnswerContainer: {
    padding: spacing.md,
  },
  question: {
    ...typography.bodyMedium,
    color: colors.primary[700],
    fontWeight: '600',
  },
  answer: {
    ...typography.bodySmall,
    color: colors.neutral[700],
    lineHeight: 20,
  },
}); 