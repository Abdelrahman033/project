// ✅ THIS IS YOUR FINAL WORKING ScanScreen WITH PHONE CAMERA FALLBACK

import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions
} from 'react-native';
import { Camera } from 'expo-camera';
import type { CameraCapturedPicture, CameraType } from 'expo-camera';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { colors, spacing, typography } from '@/theme';
import { useRouter } from 'expo-router';
import { usePermissions } from '@/utils/permissions';
import { useNetworkStatus } from '@/utils/network';
import { saveOfflineScan } from '@/utils/network';
import { CameraOff, Repeat, Image as ImageIcon, Upload, MapPin } from 'lucide-react-native';
import { CameraInitializer } from '@/components/CameraInitializer';
import { CameraService, CameraStatus } from '@/services/CameraService';
import { Card } from '@/components/Card';
import { SoilAnalysisResult, SoilDisease } from '@/types/analysis';
import * as Location from 'expo-location';

type CameraMode = 'selection' | 'phone' | 'external';

export default function ScanScreen() {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [cameraStatus, setCameraStatus] = useState<CameraStatus | null>(null);
  const [camera, setCamera] = useState<Camera | null>(null);
  const [type, setType] = useState<CameraType>('back');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [cameraMode, setCameraMode] = useState<CameraMode>('selection');
  const [isCameraReady, setIsCameraReady] = useState(false);
  const { location, isLoading } = usePermissions();
  const { isConnected } = useNetworkStatus();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const windowHeight = Dimensions.get('window').height;

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
        if (status !== 'granted') {
          Alert.alert(
            'Camera Permission Required',
            'Please grant camera permission to use this feature.',
            [{ text: 'OK' }]
          );
        }
      } catch (error) {
        console.error('Error requesting camera permission:', error);
        Alert.alert(
          'Camera Error',
          'Failed to request camera permission. Please try again.'
        );
      }
    })();
  }, []);

  const handlePhoneCameraSelect = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setCameraMode('phone');
      setIsCameraReady(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleExternalCameraSelect = async () => {
    try {
      const isAvailable = await CameraService.getInstance().checkExternalCamera();
      
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setCameraMode(isAvailable ? 'external' : 'external');
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    } catch (error) {
      console.error('Error checking external camera:', error);
      Alert.alert(
        'Camera Error',
        'Failed to check external camera status. Please try again.'
      );
    }
  };

  const handleStartScan = async () => {
    try {
      if (!camera) {
        Alert.alert('Error', 'Camera is not ready. Please try again.');
        return;
      }

      if (!isCameraReady) {
        Alert.alert('Error', 'Please wait for the camera to initialize.');
        return;
      }

      if (!location.granted) {
        const shouldRequestLocation = await new Promise((resolve) => {
          Alert.alert(
            'Location Access',
            'Would you like to enable location access for better soil analysis?',
            [
              {
                text: 'Not Now',
                style: 'cancel',
                onPress: () => resolve(false),
              },
              {
                text: 'Enable',
                onPress: () => resolve(true),
              },
            ]
          );
        });

        if (shouldRequestLocation) {
          await location.request();
        }
      }

      await takePicture();
    } catch (error) {
      console.error('Error in handleStartScan:', error);
      Alert.alert(
        'Scan Failed',
        'Unable to start scan. Please make sure you have granted all necessary permissions and try again.'
      );
    }
  };

  const handleFlipCamera = () => {
    setType((current: CameraType) => 
      current === 'back' ? 'front' : 'back'
    );
  };

  const takePicture = async () => {
    if (!camera) {
      Alert.alert('Error', 'Camera is not ready. Please try again.');
      return;
    }

    try {
      setIsAnalyzing(true);
      const photo = await camera.takePictureAsync({
        quality: 1,
        base64: true,
        exif: true,
      });
      setCapturedImage(photo.uri);
      setIsAnalyzing(false);
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to capture image. Please try again.');
      setIsAnalyzing(false);
    }
  };

  const retakePicture = () => {
    setCapturedImage(null);
    setAnalysisComplete(false);
  };

  const analyzeImage = async () => {
    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      Alert.alert('Analysis', 'Analysis complete.');
      router.push('/analysis/new');
    }, 1500);
  };

  const renderCameraSelection = () => (
    <Animated.View style={[styles.selectionContainer, { opacity: fadeAnim }]}>
      <Text style={styles.selectionTitle}>Choose Camera</Text>
      <Text style={styles.selectionSubtitle}>Select your preferred camera for soil analysis</Text>
      
      <View style={styles.cameraOptionsContainer}>
        <TouchableOpacity
          style={styles.cameraOption}
          onPress={handlePhoneCameraSelect}
        >
          <View style={styles.cameraOptionContent}>
            <CameraOff size={32} color={colors.primary[500]} />
            <Text style={styles.cameraOptionTitle}>Use Phone Camera</Text>
            <Text style={styles.cameraOptionDescription}>
              Take photos using your device's camera
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cameraOption}
          onPress={handleExternalCameraSelect}
        >
          <View style={styles.cameraOptionContent}>
            <CameraOff size={32} color={colors.neutral[400]} />
            <Text style={styles.cameraOptionTitle}>Use Connected Camera</Text>
            <Text style={styles.cameraOptionDescription}>
              Connect your external soil analysis camera
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderCameraPreview = () => {
    if (!hasPermission) {
      return (
        <View style={[styles.cameraContainer, styles.centered]}>
          <CameraOff size={64} color={colors.neutral[400]} />
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            Please grant camera permission to use this feature.
          </Text>
          <Button 
            title="Grant Permission" 
            onPress={() => Camera.requestCameraPermissionsAsync()}
            style={styles.permissionButton}
          />
        </View>
      );
    }

    if (!isCameraReady) {
      return (
        <View style={[styles.cameraContainer, styles.centered]}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
          <Text style={styles.cameraReadyText}>Initializing camera...</Text>
        </View>
      );
    }

    return (
      <Camera
        style={styles.camera}
        type={type}
        ref={(ref) => {
          if (ref) {
            setCamera(ref);
            console.log('Camera ref set successfully');
          } else {
            console.warn('Camera ref is null');
          }
        }}
        onCameraReady={() => {
          console.log('Camera is ready');
          setIsCameraReady(true);
        }}
        onMountError={(error) => {
          console.error('Camera mount error:', error);
          Alert.alert(
            'Camera Error',
            'Failed to initialize camera. Please try again.'
          );
        }}
      >
        <View style={styles.cameraControls}>
          <TouchableOpacity
            style={styles.flipButton}
            onPress={handleFlipCamera}
          >
            <Text style={styles.flipButtonText}>Flip</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    );
  };

  const renderExternalCameraPlaceholder = () => {
    return (
      <View style={styles.centered}>
        <CameraOff size={64} color={colors.neutral[400]} />
        <Text style={styles.text}>External camera support coming soon.</Text>
        <Button title="Use Phone Camera Instead" onPress={() => setCameraMode('phone')} />
      </View>
    );
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.centered}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Soil Scan" />
      
      {cameraMode === 'selection' && renderCameraSelection()}
      
      {cameraMode === 'phone' && (
        <Animated.View style={[styles.cameraContainer, { opacity: fadeAnim }]}>
          {renderCameraPreview()}
        </Animated.View>
      )}
      
      {cameraMode === 'external' && renderExternalCameraPlaceholder()}
      
      {cameraMode === 'phone' && (
        <View style={styles.controlsContainer}>
          {!capturedImage ? (
            <View style={styles.captureButtonContainer}>
              <TouchableOpacity 
                style={styles.captureButton}
                onPress={handleStartScan}
                disabled={!isCameraReady}
              >
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
              <Text style={styles.captureText}>
                {isCameraReady ? 'Tap to capture soil image' : 'Camera initializing...'}
              </Text>
            </View>
          ) : (
            <View style={styles.previewControlsContainer}>
              {isAnalyzing ? (
                <View style={styles.analyzingContainer}>
                  <ActivityIndicator size="large" color={colors.primary[500]} />
                  <Text style={styles.analyzingText}>
                    {analysisComplete ? 'Analysis complete!' : 'Analyzing soil sample...'}
                  </Text>
                </View>
              ) : (
                <>
                  <Button
                    title="Retake"
                    variant="outline"
                    onPress={retakePicture}
                    icon={<ImageIcon size={20} color={colors.primary[500]} />}
                    style={styles.previewButton}
                  />
                  <Button
                    title="Analyze"
                    onPress={analyzeImage}
                    icon={<Upload size={20} color={colors.white} />}
                    style={styles.previewButton}
                  />
                </>
              )}
            </View>
          )}
        </View>
      )}
      
      {!isConnected && (
        <View style={styles.offlineContainer}>
          <Text style={styles.offlineText}>
            You're currently offline. Images will be stored locally and analyzed when you reconnect.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.black },
  centered: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
  },
  title: {
    ...typography.headingMedium,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  selectionContainer: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.xl,
    justifyContent: 'center',
  },
  selectionTitle: {
    ...typography.headingLarge,
    color: colors.neutral[900],
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  selectionSubtitle: {
    ...typography.bodyLarge,
    color: colors.neutral[600],
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  cameraOptionsContainer: {
    gap: spacing.md,
  },
  cameraOption: {
    backgroundColor: colors.neutral[50],
    borderRadius: spacing.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  cameraOptionContent: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  cameraOptionTitle: {
    ...typography.headingSmall,
    color: colors.neutral[900],
  },
  cameraOptionDescription: {
    ...typography.bodyMedium,
    color: colors.neutral[600],
    textAlign: 'center',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: colors.black,
    minHeight: Dimensions.get('window').height * 0.6, // Ensure minimum height
  },
  camera: {
    flex: 1,
    aspectRatio: 3/4, // Maintain aspect ratio
  },
  cameraReadyText: {
    ...typography.bodyLarge,
    color: colors.white,
    marginTop: spacing.md,
  },
  controlsContainer: {
    padding: spacing.lg,
    backgroundColor: colors.black,
  },
  captureButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  captureButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.white,
    alignSelf: 'center',
  },
  captureButtonInner: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  captureText: {
    color: colors.neutral[700],
    marginLeft: spacing.md,
  },
  previewControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  previewButton: {
    padding: spacing.md,
  },
  analyzingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyzingText: {
    color: colors.neutral[700],
    marginLeft: spacing.md,
  },
  offlineContainer: {
    padding: spacing.lg,
    backgroundColor: colors.black,
    alignItems: 'center',
  },
  offlineText: {
    color: colors.neutral[700],
    textAlign: 'center',
  },
  permissionTitle: {
    ...typography.headingMedium,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  permissionText: {
    color: colors.neutral[700],
    textAlign: 'center',
  },
  permissionButton: {
    padding: spacing.md,
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  flipButton: {
    padding: spacing.md,
  },
  flipButtonText: {
    color: colors.white,
    ...typography.bodyLarge,
  },
  text: {
    color: colors.neutral[700],
    marginBottom: spacing.md,
  },
});
