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

export default function AddFarmScreen() {
  const router = useRouter();
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
    // Validate form data
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Farm name is required');
      return;
    }

    if (!formData.size.trim() || isNaN(Number(formData.size))) {
      Alert.alert('Error', 'Please enter a valid farm size');
      return;
    }

    if (formData.location.latitude === 0 && formData.location.longitude === 0) {
      Alert.alert('Error', 'Please set your farm location');
      return;
    }

    if (!formData.crops.trim()) {
      Alert.alert('Error', 'Please enter at least one crop');
      return;
    }

    setSaving(true);
    try {
      // Simulate API call to create farm
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would create the farm in the backend
      console.log('Creating farm:', {
        ...formData,
        size: Number(formData.size),
        crops: formData.crops.split(',').map(crop => crop.trim()),
      });

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
      Alert.alert('Error', 'Failed to add farm');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Add New Farm"
        showBackButton
      />
      
      <ScrollView style={styles.content}>
        <Card style={styles.formCard}>
          <Text style={styles.label}>Farm Name</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
            placeholder="Enter farm name"
            placeholderTextColor={colors.neutral[400]}
          />

          <Text style={styles.label}>Farm Size (square meters)</Text>
          <TextInput
            style={styles.input}
            value={formData.size}
            onChangeText={(text) => setFormData(prev => ({ ...prev, size: text }))}
            placeholder="Enter farm size in square meters"
            placeholderTextColor={colors.neutral[400]}
            keyboardType="numeric"
          />
          <Text style={styles.unitNote}>
            Enter the total area of your farm in square meters (m²)
          </Text>

          <Text style={styles.label}>Crops (comma-separated)</Text>
          <TextInput
            style={styles.input}
            value={formData.crops}
            onChangeText={(text) => setFormData(prev => ({ ...prev, crops: text }))}
            placeholder="Enter crops (e.g., Corn, Wheat, Soybeans)"
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
              {locationLoading ? 'Getting Location...' : 'Get Current Location'}
            </Text>
          </TouchableOpacity>

          {formData.location.latitude !== 0 && formData.location.longitude !== 0 && (
            <View style={styles.locationContainer}>
              <MapPin size={20} color={colors.neutral[600]} />
              <Text style={styles.locationText}>
                {formData.location.latitude.toFixed(4)}, {formData.location.longitude.toFixed(4)}
              </Text>
            </View>
          )}
        </Card>

        <View style={styles.actionsContainer}>
          <Button
            title="Add Farm"
            onPress={handleSave}
            loading={saving}
            icon={<Plus size={20} color={colors.white} />}
            style={styles.saveButton}
          />
          
          <Button
            title="Cancel"
            variant="outline"
            onPress={() => router.back()}
            style={styles.cancelButton}
          />
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
  content: {
    flex: 1,
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
  unitNote: {
    ...typography.labelSmall,
    color: colors.neutral[500],
    fontStyle: 'italic',
    marginTop: -spacing.md,
    marginBottom: spacing.md,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[50],
    padding: spacing.sm,
    borderRadius: spacing.sm,
    marginBottom: spacing.md,
  },
  locationButtonText: {
    ...typography.labelMedium,
    color: colors.primary[500],
    marginLeft: spacing.xs,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral[50],
    padding: spacing.sm,
    borderRadius: spacing.sm,
    marginBottom: spacing.xs,
  },
  locationText: {
    ...typography.bodyMedium,
    color: colors.neutral[600],
    marginLeft: spacing.xs,
  },
  actionsContainer: {
    marginBottom: spacing.xl,
  },
  saveButton: {
    marginBottom: spacing.sm,
  },
  cancelButton: {
    borderColor: colors.neutral[300],
  },
}); 