import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { colors, spacing, typography } from '@/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Farm } from '@/types';
import { MapPin, Crop } from 'lucide-react-native';

// Mock farm data
const mockFarms: Record<string, Farm> = {
  'farm1': {
    id: 'farm1',
    name: 'Green Valley Farm',
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
    },
    size: 250,
    crops: ['Corn', 'Soybeans', 'Wheat'],
    soilHealth: 'good',
    lastAnalysis: Date.now() - 86400000 * 5,
    totalAnalyses: 12,
    alerts: 2,
    averageNutrients: {
      nitrogen: 15,
      phosphorus: 12,
      potassium: 20,
      ph: 6.5,
      organicMatter: 3.8,
    },
  },
  'farm2': {
    id: 'farm2',
    name: 'Sunset Hills',
    location: {
      latitude: 37.7849,
      longitude: -122.4294,
    },
    size: 180,
    crops: ['Rice', 'Cotton'],
    soilHealth: 'fair',
    lastAnalysis: Date.now() - 86400000 * 2,
    totalAnalyses: 8,
    alerts: 1,
    averageNutrients: {
      nitrogen: 12,
      phosphorus: 8,
      potassium: 15,
      ph: 6.2,
      organicMatter: 3.2,
    },
  },
};

export default function EditFarmScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    // Simulate API call to fetch farm details
    setLoading(true);
    setTimeout(() => {
      if (id && mockFarms[id]) {
        const farm = mockFarms[id];
        setFormData({
          name: farm.name,
          size: farm.size.toString(),
          crops: farm.crops.join(', '),
          location: farm.location,
        });
      }
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Farm name is required');
      return;
    }

    if (!formData.size.trim() || isNaN(Number(formData.size))) {
      Alert.alert('Error', 'Please enter a valid farm size');
      return;
    }

    setSaving(true);
    try {
      // Simulate API call to save farm
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would update the farm in the backend
      console.log('Saving farm:', {
        ...formData,
        size: Number(formData.size),
        crops: formData.crops.split(',').map(crop => crop.trim()),
      });

      Alert.alert(
        'Success',
        'Farm details updated successfully',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update farm details');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header 
        title="Edit Farm"
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
          <View style={styles.locationContainer}>
            <MapPin size={20} color={colors.neutral[600]} />
            <Text style={styles.locationText}>
              {formData.location.latitude.toFixed(4)}, {formData.location.longitude.toFixed(4)}
            </Text>
          </View>
          <Text style={styles.locationNote}>
            Location can only be updated through the mobile app
          </Text>
        </Card>

        <View style={styles.actionsContainer}>
          <Button
            title="Save Changes"
            onPress={handleSave}
            loading={saving}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  locationNote: {
    ...typography.labelSmall,
    color: colors.neutral[500],
    fontStyle: 'italic',
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
  unitNote: {
    ...typography.labelSmall,
    color: colors.neutral[500],
    fontStyle: 'italic',
    marginTop: -spacing.md,
    marginBottom: spacing.md,
  },
}); 