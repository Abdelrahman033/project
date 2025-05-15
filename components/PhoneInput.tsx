import React, { useRef, useState } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import PhoneNumberInput from 'react-native-phone-number-input';
import { colors, spacing, typography } from '@/theme';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
}

// Mock existing phone numbers for validation
const EXISTING_PHONE_NUMBERS = [
  '+201234567890',
  '+201234567891',
  '+201234567892',
];

export const PhoneInput = ({ value, onChange, error, label }: PhoneInputProps) => {
  const phoneInput = useRef<PhoneNumberInput>(null);
  const [formattedValue, setFormattedValue] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [isDuplicate, setIsDuplicate] = useState(false);

  const handlePhoneChange = (text: string) => {
    const checkValid = phoneInput.current?.isValidNumber(text);
    const isDuplicateNumber = EXISTING_PHONE_NUMBERS.includes(text);
    
    setIsValid(checkValid || false);
    setIsDuplicate(isDuplicateNumber);
    
    if (checkValid && !isDuplicateNumber) {
      onChange(text);
    }
  };

  const getErrorMessage = () => {
    if (isDuplicate) {
      return 'This phone number is already registered';
    }
    if (!isValid && value) {
      return 'Please enter a valid phone number';
    }
    return error;
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <PhoneNumberInput
        ref={phoneInput}
        defaultValue={value}
        defaultCode="EG"
        layout="first"
        onChangeText={handlePhoneChange}
        onChangeFormattedText={setFormattedValue}
        withDarkTheme={false}
        withShadow={false}
        containerStyle={styles.phoneInputContainer}
        textContainerStyle={styles.phoneInputTextContainer}
        textInputStyle={styles.phoneInputText}
        codeTextStyle={styles.phoneInputCode}
        flagButtonStyle={styles.flagButton}
        countryPickerButtonStyle={styles.countryPickerButton}
        placeholder="Enter phone number"
      />
      {getErrorMessage() && (
        <Text style={styles.errorText}>{getErrorMessage()}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.labelMedium,
    color: colors.neutral[700],
    marginBottom: spacing.xs,
  },
  phoneInputContainer: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.neutral[300],
  },
  phoneInputTextContainer: {
    backgroundColor: colors.white,
    paddingVertical: spacing.xs,
  },
  phoneInputText: {
    ...typography.bodyMedium,
    color: colors.neutral[800],
    height: 40,
  },
  phoneInputCode: {
    ...typography.bodyMedium,
    color: colors.neutral[800],
  },
  flagButton: {
    backgroundColor: colors.white,
    borderRightWidth: 1,
    borderRightColor: colors.neutral[300],
  },
  countryPickerButton: {
    backgroundColor: colors.white,
  },
  errorText: {
    ...typography.labelSmall,
    color: colors.error[500],
    marginTop: spacing.xs,
  },
}); 