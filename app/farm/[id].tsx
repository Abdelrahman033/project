import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { colors, spacing, typography } from '@/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Farm } from '@/types/auth';
import {
  MapPin,
  Crop,
  Ruler,
  Calendar,
  BarChart2,
  Edit2,
  Trash2,
  AlertTriangle,
  Pencil,
  Droplet,
  Leaf,
} from 'lucide-react-native';
import { useUser } from '@/contexts/UserContext';

export default function FarmDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user, updateUser } = useUser();

  const farm = user?.farms?.find((f: Farm) => f.id === id);

  if (!farm) {
    return (
      <View style={styles.container}>
        <Header 
          title="Farm Details"
          showBackButton
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Farm not found</Text>
        </View>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Farm',
      'Are you sure you want to delete this farm? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              if (!user) return;
              const updatedFarms = user.farms.filter((f: Farm) => f.id !== id);
              await updateUser({ farms: updatedFarms });
              router.back();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete farm. Please try again.');
            }
          },
        },
      ]
    );
  };

  const nutrientLabels: Record<string, string> = {
    nitrogen: 'Nitrogen',
    phosphorus: 'Phosphorus',
    potassium: 'Potassium',
    ph: 'pH',
    organicMatter: 'Organic Matter',
    moisture: 'Moisture',
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Farm Details"
        showBackButton
        rightElement={
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => router.push(`/farm/edit/${id}`)}
            >
              <Pencil size={20} color={colors.neutral[800]} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleDelete}
            >
              <Trash2 size={20} color={colors.error[500]} />
            </TouchableOpacity>
          </View>
        }
      />
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Basic Information */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Crop size={20} color={colors.primary[500]} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Farm Name</Text>
              <Text style={styles.infoValue}>{farm.name}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ruler size={20} color={colors.primary[500]} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Size</Text>
              <Text style={styles.infoValue}>{farm.size} m²</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <MapPin size={20} color={colors.primary[500]} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>
                {typeof farm.location === 'string' 
                  ? farm.location 
                  : farm.location 
                    ? `${farm.location.latitude.toFixed(6)}, ${farm.location.longitude.toFixed(6)}`
                    : 'No location set'}
              </Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Leaf size={20} color={colors.primary[500]} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Crops</Text>
              <Text style={styles.infoValue}>{farm.crops.join(', ')}</Text>
            </View>
          </View>
        </Card>

        {/* Soil Health */}
        {farm.soilHealth && (
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Soil Health</Text>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Droplet size={20} color={colors.primary[500]} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Last Analysis</Text>
                <Text style={styles.infoValue}>
                  {farm.lastAnalysis ? new Date(farm.lastAnalysis).toLocaleDateString() : 'No analysis yet'}
                </Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <AlertTriangle size={20} color={colors.primary[500]} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Alerts</Text>
                <Text style={styles.infoValue}>
                  {Array.isArray(farm.alerts) && farm.alerts.length > 0 ? farm.alerts.join(', ') : 'No alerts'}
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Nutrient Levels */}
        {farm.averageNutrients && (
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Average Nutrients</Text>
            {Object.entries(farm.averageNutrients).map(([key, value]) => (
              <View key={key} style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Droplet size={20} color={colors.primary[500]} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>{nutrientLabels[key] || key}</Text>
                  <Text style={styles.infoValue}>{value}</Text>
                </View>
              </View>
            ))}
          </Card>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push(`/farm/${id}/analyses`)}
          >
            <BarChart2 size={20} color={colors.primary[500]} />
            <Text style={styles.actionText}>View Analyses</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  scrollContent: {
    padding: spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...typography.bodyMedium,
    color: colors.error[500],
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerButton: {
    padding: spacing.xs,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.headingSmall,
    color: colors.neutral[800],
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    ...typography.bodySmall,
    color: colors.neutral[600],
    marginBottom: spacing.xs,
  },
  infoValue: {
    ...typography.bodyMedium,
    color: colors.neutral[800],
  },
  actions: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary[50],
    padding: spacing.sm,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  actionText: {
    ...typography.button,
    color: colors.primary[500],
  },
}); 