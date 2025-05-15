import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { colors, spacing, typography } from '@/theme';
import { useRouter } from 'expo-router';
import { MapPin, Crop, Plus } from 'lucide-react-native';
import * as Location from 'expo-location';
import { useUser } from '@/contexts/UserContext';
import { Farm } from '@/types/auth';

export default function AddFarmScreen() {
  const router = useRouter();
  const { user, updateUser } = useUser();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    size: '',
    crops: '',
    location: {
      latitude: 0,
      longitude: 0,
    },
  });
  const [locationLoading, setLocationLoading] = useState(false);

  const handleGetCurrentLocation = async () => {
    try {
      setLocationLoading(true);
      
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Please enable location services to add your farm location.'
        );
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setFormData(prev => ({
        ...prev,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      }));
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to get your current location. Please try again.'
      );
    } finally {
      setLocationLoading(false);
    }
  };

  const handleSave = async () => {
    // Basic validation
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter farm name');
      return;
    }

    if (!formData.size.trim()) {
      Alert.alert('Error', 'Please enter farm size');
      return;
    }

    if (!formData.crops.trim()) {
      Alert.alert('Error', 'Please enter crops');
      return;
    }

    const size = parseFloat(formData.size);
    if (isNaN(size) || size <= 0) {
      Alert.alert('Error', 'Please enter a valid farm size');
      return;
    }

    setSaving(true);
    try {
      const newFarm: Farm = {
        id: Date.now().toString(), // Temporary ID, will be replaced by Firestore
        name: formData.name.trim(),
        size: size,
        crops: formData.crops.split(',').map(crop => crop.trim()),
        location: formData.location,
        createdAt: new Date().toISOString(),
      };

      // Update user's farms array
      const updatedFarms = [...(user?.farms || []), newFarm];
      await updateUser({ farms: updatedFarms });

      Alert.alert(
        'Success',
        'Farm added successfully',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Error adding farm:', error);
      Alert.alert(
        'Error',
        'Failed to add farm. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Add Farm"
        showBackButton
      />
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        <Card style={styles.formCard}>
          <Text style={styles.label}>Farm Name</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
            placeholder="Enter farm name"
            placeholderTextColor={colors.neutral[400]}
          />

          <Text style={styles.label}>Farm Size (m²)</Text>
          <TextInput
            style={styles.input}
            value={formData.size}
            onChangeText={(text) => setFormData(prev => ({ ...prev, size: text }))}
            placeholder="Enter farm size in square meters"
            placeholderTextColor={colors.neutral[400]}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Crops</Text>
          <TextInput
            style={styles.input}
            value={formData.crops}
            onChangeText={(text) => setFormData(prev => ({ ...prev, crops: text }))}
            placeholder="Enter crops (comma-separated)"
            placeholderTextColor={colors.neutral[400]}
          />

          <Text style={styles.label}>Location</Text>
          <TouchableOpacity
            style={styles.locationButton}
            onPress={handleGetCurrentLocation}
            disabled={locationLoading}
          >
            <MapPin size={20} color={colors.primary[500]} />
            <Text style={styles.locationButtonText}>
              {locationLoading ? 'Getting Location...' : 'Use Current Location'}
            </Text>
          </TouchableOpacity>

          {formData.location.latitude !== 0 && (
            <Text style={styles.locationText}>
              Latitude: {formData.location.latitude.toFixed(6)}{'\n'}
              Longitude: {formData.location.longitude.toFixed(6)}
            </Text>
          )}
        </Card>

        <Button
          title="Add Farm"
          onPress={handleSave}
          loading={saving}
          style={styles.saveButton}
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
  },
  scrollContent: {
    padding: spacing.md,
  },
  formCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
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
    borderWidth: 1,
    borderColor: colors.neutral[300],
    borderRadius: spacing.sm,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary[50],
    borderWidth: 1,
    borderColor: colors.primary[200],
    borderRadius: spacing.sm,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  locationButtonText: {
    ...typography.button,
    color: colors.primary[500],
  },
  locationText: {
    ...typography.bodySmall,
    color: colors.neutral[600],
    marginBottom: spacing.md,
  },
  saveButton: {
    marginTop: spacing.sm,
  },
}); 