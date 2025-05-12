import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '../context/UserContext';
import { colors, spacing, typography } from '@/theme';
import { Card } from '@/components/Card';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { ArrowLeft, Save } from 'lucide-react-native';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateUser } = useUser();
  const [name, setName] = useState(user?.name || '');
  const [farmName, setFarmName] = useState(user?.farmName || '');
  const [location, setLocation] = useState(user?.location || '');

  const handleSave = async () => {
    try {
      await updateUser({
        name,
        farmName,
        location,
      });
      router.back();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Edit Profile"
        leftIcon={<ArrowLeft size={24} color={colors.neutral[800]} />}
        onLeftPress={() => router.back()}
      />
      
      <ScrollView style={styles.content}>
        <Card style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor={colors.neutral[400]}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Farm Name</Text>
            <TextInput
              style={styles.input}
              value={farmName}
              onChangeText={setFarmName}
              placeholder="Enter your farm name"
              placeholderTextColor={colors.neutral[400]}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="Enter your location"
              placeholderTextColor={colors.neutral[400]}
            />
          </View>
        </Card>

        <Button
          title="Save Changes"
          onPress={handleSave}
          style={styles.saveButton}
          icon={<Save size={20} color={colors.white} />}
        />
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
  formCard: {
    marginBottom: spacing.md,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.labelMedium,
    color: colors.neutral[700],
    marginBottom: spacing.xs,
  },
  input: {
    ...typography.bodyMedium,
    color: colors.neutral[800],
    backgroundColor: colors.white,
    padding: spacing.sm,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.neutral[300],
  },
  saveButton: {
    marginTop: spacing.md,
  },
}); 