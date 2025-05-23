import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { colors, spacing, typography } from '@/theme';
import { MessageCircle, Rocket } from 'lucide-react-native';

export default function LiveChatScreen() {
  // Fade-in animation
  const fadeAnim = new Animated.Value(0);
  
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <Header 
        title="Live Chat"
        showBackButton
      />
      <Animated.View 
        style={[styles.content, { opacity: fadeAnim }]}
      >
        <Card style={styles.messageCard}>
          <View style={styles.iconContainer}>
            <Rocket size={48} color={colors.primary[500]} />
          </View>
          
          <Text style={styles.title}>Coming Soon!</Text>
          
          <Text style={styles.message}>
            We're working on something exciting! Our live chat feature is currently in development to provide you with real-time support.
          </Text>
          
          <Text style={styles.subMessage}>
            In the meantime, you can reach us through:
          </Text>
          
          <View style={styles.contactOptions}>
            <View style={styles.contactOption}>
              <MessageCircle size={20} color={colors.primary[500]} />
              <Text style={styles.contactText}>WhatsApp Chat</Text>
            </View>
            <View style={styles.contactOption}>
              <MessageCircle size={20} color={colors.primary[500]} />
              <Text style={styles.contactText}>Email Support</Text>
            </View>
            <View style={styles.contactOption}>
              <MessageCircle size={20} color={colors.primary[500]} />
              <Text style={styles.contactText}>Phone Support</Text>
            </View>
          </View>
        </Card>
      </Animated.View>
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
    padding: spacing.lg,
  },
  messageCard: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.headingLarge,
    color: colors.primary[700],
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  message: {
    ...typography.bodyLarge,
    color: colors.neutral[700],
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 24,
  },
  subMessage: {
    ...typography.bodyMedium,
    color: colors.neutral[600],
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  contactOptions: {
    width: '100%',
    gap: spacing.sm,
  },
  contactOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.neutral[50],
    borderRadius: spacing.sm,
  },
  contactText: {
    ...typography.bodyMedium,
    color: colors.neutral[700],
  },
}); 