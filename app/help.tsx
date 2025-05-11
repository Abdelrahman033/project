import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { colors, spacing, typography } from '@/theme';
import { useRouter } from 'expo-router';
import {
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  FileText,
  ChevronRight,
  ChevronDown,
  Globe,
  BookOpen,
  Video,
} from 'lucide-react-native';

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

export default function HelpSupportScreen() {
  const router = useRouter();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleFaqPress = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@agritech.com');
  };

  const handleCallSupport = () => {
    Linking.openURL('tel:+1234567890');
  };

  const handleOpenDocumentation = () => {
    // In a real app, this would open the documentation website
    Linking.openURL('https://docs.agritech.com');
  };

  const handleOpenTutorials = () => {
    // In a real app, this would open the tutorials page
    Linking.openURL('https://agritech.com/tutorials');
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Help & Support"
        showBackButton
      />
      <ScrollView style={styles.content}>
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={handleContactSupport}
          >
            <Mail size={20} color={colors.neutral[600]} />
            <Text style={styles.contactText}>Email Support</Text>
            <ChevronRight size={20} color={colors.neutral[400]} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={handleCallSupport}
          >
            <Phone size={20} color={colors.neutral[600]} />
            <Text style={styles.contactText}>Call Support</Text>
            <ChevronRight size={20} color={colors.neutral[400]} />
          </TouchableOpacity>
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Resources</Text>
          <TouchableOpacity 
            style={styles.resourceItem}
            onPress={handleOpenDocumentation}
          >
            <FileText size={20} color={colors.neutral[600]} />
            <Text style={styles.resourceText}>Documentation</Text>
            <ChevronRight size={20} color={colors.neutral[400]} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.resourceItem}
            onPress={handleOpenTutorials}
          >
            <Video size={20} color={colors.neutral[600]} />
            <Text style={styles.resourceText}>Video Tutorials</Text>
            <ChevronRight size={20} color={colors.neutral[400]} />
          </TouchableOpacity>
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {faqData.map((faq, index) => (
            <TouchableOpacity
              key={index}
              style={styles.faqItem}
              onPress={() => handleFaqPress(index)}
            >
              <View style={styles.faqHeader}>
                <HelpCircle size={20} color={colors.neutral[600]} />
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                {expandedFaq === index ? (
                  <ChevronDown size={20} color={colors.neutral[400]} />
                ) : (
                  <ChevronRight size={20} color={colors.neutral[400]} />
                )}
              </View>
              
              {expandedFaq === index && (
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              )}
            </TouchableOpacity>
          ))}
        </Card>
      </ScrollView>
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
    padding: spacing.md,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.headingSmall,
    color: colors.neutral[800],
    marginBottom: spacing.md,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  contactText: {
    ...typography.bodyMedium,
    color: colors.neutral[700],
    flex: 1,
    marginLeft: spacing.sm,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  resourceText: {
    ...typography.bodyMedium,
    color: colors.neutral[700],
    flex: 1,
    marginLeft: spacing.sm,
  },
  faqItem: {
    marginBottom: spacing.sm,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  faqQuestion: {
    ...typography.bodyMedium,
    color: colors.neutral[800],
    flex: 1,
    marginLeft: spacing.sm,
  },
  faqAnswer: {
    ...typography.bodyMedium,
    color: colors.neutral[600],
    marginLeft: spacing.xl,
    marginBottom: spacing.sm,
  },
}); 