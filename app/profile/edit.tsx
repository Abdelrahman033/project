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
import { useRouter } from 'expo-router';
import { useUser } from '@/contexts/UserContext';
import { colors, spacing, typography } from '@/theme';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { 
  Save, 
  Phone, 
  Mail,
  MapPin,
  User,
  Home,
  ChevronDown,
} from 'lucide-react-native';
import CountryPicker, { Country, CountryCode } from 'react-native-country-picker-modal';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateUser } = useUser();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    location: user?.location || '',
    farmName: user?.farmName || '',
  });

  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>({
    callingCode: ['1'],
    cca2: 'US',
    currency: ['USD'],
    flag: 'flag-us',
    name: 'United States',
    region: 'Americas',
    subregion: 'North America',
  });

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setShowCountryPicker(false);
  };

  const handleSave = async () => {
    // Basic validation
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return;
    }

    if (!formData.location.trim()) {
      Alert.alert('Error', 'Please enter your location');
      return;
    }

    if (!formData.farmName.trim()) {
      Alert.alert('Error', 'Please enter your farm name');
      return;
    }

    setSaving(true);
    try {
      // Ensure we preserve the existing farms array and other required fields
      const updates = {
        ...formData,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        location: formData.location.trim(),
        farmName: formData.farmName.trim(),
        // Preserve existing farms array if it exists
        farms: user?.farms || [],
        // Preserve role if it exists
        role: user?.role || 'farmer',
      };

      await updateUser(updates);

      Alert.alert(
        'Success',
        'Profile updated successfully',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert(
        'Error',
        'Failed to update profile. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Edit Profile"
        showBackButton
      />
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Personal Information */}
        <Card style={styles.formCard}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
            placeholder="Enter your full name"
            placeholderTextColor={colors.neutral[400]}
          />

          <Text style={styles.label}>Email</Text>
          <View style={styles.emailContainer}>
            <Mail size={20} color={colors.neutral[600]} />
            <Text style={styles.emailText}>{user?.email}</Text>
          </View>

          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.phoneInputContainer}>
            <TouchableOpacity
              style={styles.countryCodeButton}
              onPress={() => setShowCountryPicker(true)}
            >
              <CountryPicker
                countryCode={selectedCountry.cca2 as CountryCode}
                withFilter
                withFlag
                withCallingCode
                withEmoji
                onSelect={handleCountrySelect}
                visible={showCountryPicker}
                onClose={() => setShowCountryPicker(false)}
                containerButtonStyle={styles.countryPickerButton}
                theme={{
                  backgroundColor: colors.white,
                  primaryColor: colors.primary[500],
                  onBackgroundTextColor: colors.neutral[800],
                  fontSize: 16,
                }}
              />
              <Text style={styles.countryCodeText}>
                +{selectedCountry.callingCode[0]}
              </Text>
              <ChevronDown size={16} color={colors.neutral[600]} />
            </TouchableOpacity>
            <TextInput
              style={styles.phoneInput}
              value={formData.phone}
              onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
              placeholder="(555) 555-5555"
              placeholderTextColor={colors.neutral[400]}
              keyboardType="phone-pad"
            />
          </View>

          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            value={formData.location}
            onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
            placeholder="Enter your location"
            placeholderTextColor={colors.neutral[400]}
          />

          <Text style={styles.label}>Farm Name</Text>
          <View style={styles.inputContainer}>
            <Home size={20} color={colors.neutral[600]} />
            <TextInput
              style={styles.inputWithIcon}
              value={formData.farmName}
              onChangeText={(text) => setFormData(prev => ({ ...prev, farmName: text }))}
              placeholder="Enter your farm name"
              placeholderTextColor={colors.neutral[400]}
            />
          </View>
        </Card>

        <View style={styles.actionsContainer}>
          <Button
            title="Save Changes"
            onPress={handleSave}
            loading={saving}
            icon={<Save size={20} color={colors.white} />}
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
  },
  scrollContent: {
    padding: spacing.md,
  },
  formCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  sectionTitle: {
    ...typography.headingSmall,
    color: colors.neutral[800],
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
    borderWidth: 1,
    borderColor: colors.neutral[300],
    borderRadius: spacing.sm,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.md,
  },
  inputWithIcon: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.neutral[800],
    padding: spacing.sm,
    marginLeft: spacing.xs,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral[50],
    borderWidth: 1,
    borderColor: colors.neutral[300],
    borderRadius: spacing.sm,
    padding: spacing.sm,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  emailText: {
    ...typography.bodyMedium,
    color: colors.neutral[600],
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    borderRadius: spacing.sm,
    marginBottom: spacing.md,
  },
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    borderRightWidth: 1,
    borderRightColor: colors.neutral[300],
    backgroundColor: colors.neutral[50],
    height: '100%',
    gap: spacing.xs,
  },
  countryPickerButton: {
    padding: 0,
  },
  countryCodeText: {
    ...typography.bodyMedium,
    color: colors.neutral[800],
  },
  phoneInput: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.neutral[800],
    padding: spacing.sm,
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