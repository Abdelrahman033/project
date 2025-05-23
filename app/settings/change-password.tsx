import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Button } from '@/components/Button';
import { colors, spacing, typography } from '@/theme';
import { useRouter } from 'expo-router';
import { ArrowLeft, CheckCircle } from 'lucide-react-native';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { Header } from '@/components/Header';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get current user's email
  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser?.email) {
      setEmail(currentUser.email);
    }
  }, []);

  const handleSubmit = async () => {
    setError(null);

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    try {
      setIsLoading(true);

      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);

      setIsSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (isSubmitted) {
    return (
      <View style={styles.container}>
        <Header 
          title="Change Password"
          showBackButton
        />
        <View style={styles.successContainer}>
          <CheckCircle size={64} color={colors.success[500]} />
          <Text style={styles.successTitle}>Reset Link Sent</Text>
          <Text style={styles.successText}>
            We've sent a password reset link to {email}. Please check your email and follow the instructions.
          </Text>
          <Button
            title="Back to Settings"
            onPress={handleBack}
            style={styles.button}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header 
        title="Change Password"
        showBackButton
      />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={10}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                accessibilityLabel="Email input"
              />
            </View>

            <Button
              title="Send Reset Link"
              onPress={handleSubmit}
              loading={isLoading}
              style={styles.button}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.xl,
  },
  formContainer: {
    width: '100%',
  },
  errorContainer: {
    backgroundColor: colors.error[50],
    padding: spacing.md,
    borderRadius: spacing.sm,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.error[500],
  },
  errorText: {
    color: colors.error[700],
    ...typography.bodyMedium,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.labelMedium,
    color: colors.neutral[700],
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.neutral[300],
    borderRadius: spacing.sm,
    padding: spacing.md,
    ...typography.bodyMedium,
    color: colors.neutral[800],
    backgroundColor: colors.neutral[50],
  },
  button: {
    marginTop: spacing.md,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  successTitle: {
    ...typography.headingLarge,
    color: colors.neutral[800],
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  successText: {
    ...typography.bodyLarge,
    color: colors.neutral[600],
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
}); 