import React, { useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { colors, spacing, typography } from '@/theme';
import { CameraService, CameraStatus } from '@/services/CameraService';

interface CameraInitializerProps {
  onCameraReady: (status: CameraStatus) => void;
}

export function CameraInitializer({ onCameraReady }: CameraInitializerProps) {
  const [status, setStatus] = useState<string>('Connecting to external camera...');
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    initializeCamera();
  }, []);

  const initializeCamera = async () => {
    try {
      const cameraService = CameraService.getInstance();
      const cameraStatus = await cameraService.initializeCamera();
      
      if (cameraStatus.error) {
        setStatus(cameraStatus.error);
      }
      
      // Small delay to show the status message
      setTimeout(() => {
        setIsLoading(false);
        onCameraReady(cameraStatus);
      }, 1000);
    } catch (error) {
      setStatus('Failed to initialize camera. Please try again.');
      setIsLoading(false);
      onCameraReady({
        isAvailable: false,
        type: 'mobile',
        error: 'Failed to initialize camera. Please try again.',
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {isLoading && <ActivityIndicator size="large" color={colors.primary[500]} />}
        <Text style={styles.statusText}>{status}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  statusText: {
    ...typography.bodyLarge,
    color: colors.neutral[800],
    textAlign: 'center',
    marginTop: spacing.md,
  },
}); 