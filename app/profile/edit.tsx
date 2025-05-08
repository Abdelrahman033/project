import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { colors, spacing, typography } from '@/theme';
import { useRouter } from 'expo-router';
import { Camera, User, Mail, Phone, MapPin, Building, ChevronDown } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

// Country codes data
const countryCodes = [
  { code: '+1', country: 'United States' },
  { code: '+44', country: 'United Kingdom' },
  { code: '+91', country: 'India' },
  { code: '+86', country: 'China' },
  { code: '+81', country: 'Japan' },
  { code: '+49', country: 'Germany' },
  { code: '+33', country: 'France' },
  { code: '+61', country: 'Australia' },
  { code: '+55', country: 'Brazil' },
  { code: '+27', country: 'South Africa' },
  { code: '+234', country: 'Nigeria' },
  { code: '+254', country: 'Kenya' },
  { code: '+20', country: 'Egypt' },
  { code: '+212', country: 'Morocco' },
  { code: '+216', country: 'Tunisia' },
];

// Mock user data - replace with actual user data from your auth context
const mockUser = {
  id: 'user1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 234 567 8900',
  farm: 'Green Valley Farm',
  location: 'San Francisco, CA',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
};

export default function EditProfileScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(mockUser);
  const [avatar, setAvatar] = useState(mockUser.avatar);
  const [showCountryCodes, setShowCountryCodes] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState(mockUser.phone.replace('+1 ', ''));

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setAvatar(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      
      // Update phone number with country code
      const updatedUserData = {
        ...userData,
        phone: `${selectedCountryCode} ${phoneNumber}`,
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would update the user data in your backend
      console.log('Updated user data:', updatedUserData);
      
      Alert.alert('Success', 'Profile updated successfully');
      router.back();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderCountryCodeItem = ({ item }: { item: typeof countryCodes[0] }) => (
    <TouchableOpacity
      style={styles.countryCodeItem}
      onPress={() => {
        setSelectedCountryCode(item.code);
        setShowCountryCodes(false);
      }}
    >
      <Text style={styles.countryCodeText}>{item.code}</Text>
      <Text style={styles.countryNameText}>{item.country}</Text>
    </TouchableOpacity>
  );

  const renderInputField = (
    icon: React.ReactNode,
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string,
    keyboardType: 'default' | 'email-address' | 'phone-pad' = 'default'
  ) => (
    <View style={styles.inputContainer}>
      <View style={styles.inputLabelContainer}>
        {icon}
        <Text style={styles.inputLabel}>{label}</Text>
      </View>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.neutral[400]}
        keyboardType={keyboardType}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Header 
        title="Edit Profile" 
        showBackButton
      />
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.avatarCard}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: avatar }} 
              style={styles.avatar}
            />
            <TouchableOpacity 
              style={styles.avatarEditButton}
              onPress={handleImagePick}
            >
              <Camera size={20} color={colors.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.avatarText}>Tap to change profile picture</Text>
        </Card>

        <Card style={styles.formCard}>
          {renderInputField(
            <User size={20} color={colors.neutral[600]} />,
            'Full Name',
            userData.name,
            (text) => setUserData(prev => ({ ...prev, name: text })),
            'Enter your full name'
          )}
          
          {renderInputField(
            <Mail size={20} color={colors.neutral[600]} />,
            'Email',
            userData.email,
            (text) => setUserData(prev => ({ ...prev, email: text })),
            'Enter your email',
            'email-address'
          )}
          
          <View style={styles.inputContainer}>
            <View style={styles.inputLabelContainer}>
              <Phone size={20} color={colors.neutral[600]} />
              <Text style={styles.inputLabel}>Phone</Text>
            </View>
            <View style={styles.phoneInputContainer}>
              <TouchableOpacity
                style={styles.countryCodeButton}
                onPress={() => setShowCountryCodes(true)}
              >
                <Text style={styles.countryCodeButtonText}>{selectedCountryCode}</Text>
                <ChevronDown size={16} color={colors.neutral[600]} />
              </TouchableOpacity>
              <TextInput
                style={styles.phoneInput}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Enter your phone number"
                placeholderTextColor={colors.neutral[400]}
                keyboardType="phone-pad"
              />
            </View>
          </View>
          
          {renderInputField(
            <Building size={20} color={colors.neutral[600]} />,
            'Farm Name',
            userData.farm,
            (text) => setUserData(prev => ({ ...prev, farm: text })),
            'Enter your farm name'
          )}
          
          {renderInputField(
            <MapPin size={20} color={colors.neutral[600]} />,
            'Location',
            userData.location,
            (text) => setUserData(prev => ({ ...prev, location: text })),
            'Enter your location'
          )}
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            title={isLoading ? 'Saving...' : 'Save Changes'}
            onPress={handleSave}
            disabled={isLoading}
            icon={isLoading ? <ActivityIndicator color={colors.white} /> : undefined}
          />
        </View>
      </ScrollView>

      <Modal
        visible={showCountryCodes}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCountryCodes(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country Code</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowCountryCodes(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={countryCodes}
              renderItem={renderCountryCodeItem}
              keyExtractor={(item) => item.code}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
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
  avatarCard: {
    alignItems: 'center',
    padding: spacing.xl,
    marginBottom: spacing.md,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary[500],
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
  },
  avatarText: {
    ...typography.bodySmall,
    color: colors.neutral[600],
  },
  formCard: {
    padding: spacing.lg,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  inputLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  inputLabel: {
    ...typography.labelMedium,
    color: colors.neutral[800],
    marginLeft: spacing.sm,
  },
  input: {
    ...typography.bodyMedium,
    color: colors.neutral[900],
    borderWidth: 1,
    borderColor: colors.neutral[300],
    borderRadius: 8,
    padding: spacing.sm,
    backgroundColor: colors.white,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral[100],
    borderWidth: 1,
    borderColor: colors.neutral[300],
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    minWidth: 80,
  },
  countryCodeButtonText: {
    ...typography.bodyMedium,
    color: colors.neutral[900],
    marginRight: spacing.xs,
  },
  phoneInput: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.neutral[900],
    borderWidth: 1,
    borderColor: colors.neutral[300],
    borderRadius: 8,
    padding: spacing.sm,
    backgroundColor: colors.white,
  },
  buttonContainer: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  modalTitle: {
    ...typography.headingSmall,
    color: colors.neutral[900],
  },
  closeButton: {
    padding: spacing.xs,
  },
  closeButtonText: {
    ...typography.labelMedium,
    color: colors.primary[500],
  },
  countryCodeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  countryCodeText: {
    ...typography.bodyMedium,
    color: colors.neutral[900],
    width: 60,
  },
  countryNameText: {
    ...typography.bodyMedium,
    color: colors.neutral[600],
  },
}); 