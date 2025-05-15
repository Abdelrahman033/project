import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useUser } from '@/contexts/UserContext';
import { uploadProfileImage } from '@/utils/storage';
import { colors, spacing, typography } from '@/theme';

export default function TestFirebase() {
  const { user, signIn, signOut, updateUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [testResult, setTestResult] = useState<string>('');

  const testAuth = async () => {
    try {
      setTestResult('Testing authentication...');
      await signIn(email, password);
      setTestResult('Authentication successful!');
    } catch (error: any) {
      setTestResult(`Authentication failed: ${error?.message || 'Unknown error'}`);
    }
  };

  const testUpdateUser = async () => {
    try {
      setTestResult('Testing user update...');
      await updateUser({ name: 'Test User Updated' });
      setTestResult('User update successful!');
    } catch (error: any) {
      setTestResult(`User update failed: ${error?.message || 'Unknown error'}`);
    }
  };

  const testSignOut = async () => {
    try {
      setTestResult('Testing sign out...');
      await signOut();
      setTestResult('Sign out successful!');
    } catch (error: any) {
      setTestResult(`Sign out failed: ${error?.message || 'Unknown error'}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase Integration Test</Text>

      {!user ? (
        <View style={styles.authContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={testAuth}>
            <Text style={styles.buttonText}>Test Sign In</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.userContainer}>
          <Text style={styles.userInfo}>Logged in as: {user.email}</Text>
          <Text style={styles.userInfo}>Name: {user.name}</Text>
          <Text style={styles.userInfo}>Role: {user.role}</Text>
          
          <TouchableOpacity style={styles.button} onPress={testUpdateUser}>
            <Text style={styles.buttonText}>Test Update User</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={testSignOut}>
            <Text style={styles.buttonText}>Test Sign Out</Text>
          </TouchableOpacity>
        </View>
      )}

      {testResult ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{testResult}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.neutral[100],
  },
  title: {
    ...typography.h1,
    color: colors.neutral[900],
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  authContainer: {
    gap: spacing.md,
  },
  input: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.neutral[300],
  },
  button: {
    backgroundColor: colors.primary[500],
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    ...typography.button,
    color: colors.white,
  },
  userContainer: {
    gap: spacing.md,
  },
  userInfo: {
    ...typography.body1,
    color: colors.neutral[700],
  },
  resultContainer: {
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.neutral[200],
    borderRadius: 8,
  },
  resultText: {
    ...typography.body2,
    color: colors.neutral[900],
  },
}); 