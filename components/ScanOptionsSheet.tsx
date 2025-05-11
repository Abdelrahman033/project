import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { Camera, CameraOff } from 'lucide-react-native';
import { colors, spacing, typography } from '@/theme';

interface ScanOptionsSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet>;
  onPhoneCameraPress: () => void;
  onExternalCameraPress: () => void;
}

export function ScanOptionsSheet({
  bottomSheetRef,
  onPhoneCameraPress,
  onExternalCameraPress,
}: ScanOptionsSheetProps) {
  // Bottom sheet snap points
  const snapPoints = useMemo(() => ['50%'], []);

  // Callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Choose Scan Method</Text>
        
        <TouchableOpacity
          style={styles.optionButton}
          onPress={onPhoneCameraPress}
        >
          <View style={styles.optionContent}>
            <Camera size={24} color={colors.primary[500]} />
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Phone Camera</Text>
              <Text style={styles.optionDescription}>
                Use your phone's camera to scan soil samples
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={onExternalCameraPress}
        >
          <View style={styles.optionContent}>
            <CameraOff size={24} color={colors.neutral[400]} />
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>External Camera</Text>
              <Text style={styles.optionDescription}>
                Connect your external soil analysis camera
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handleIndicator: {
    backgroundColor: colors.neutral[300],
    width: 40,
  },
  contentContainer: {
    flex: 1,
    padding: spacing.xl,
  },
  title: {
    ...typography.headingMedium,
    color: colors.neutral[800],
    marginBottom: spacing.xl,
  },
  optionButton: {
    backgroundColor: colors.neutral[50],
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionTextContainer: {
    marginLeft: spacing.md,
    flex: 1,
  },
  optionTitle: {
    ...typography.labelLarge,
    color: colors.neutral[800],
    marginBottom: spacing.xs,
  },
  optionDescription: {
    ...typography.bodySmall,
    color: colors.neutral[600],
  },
}); 