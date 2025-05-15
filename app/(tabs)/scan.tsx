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
  Animated
} from 'react-native';
import { Camera } from 'expo-camera';
import type { CameraCapturedPicture } from 'expo-camera';
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
  const [camera, setCamera] = useState<typeof Camera | null>(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [cameraMode, setCameraMode] = useState<CameraMode>('selection');
  const { location, isLoading } = usePermissions();
  const { isConnected } = useNetworkStatus();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleCameraReady = (status: CameraStatus) => {
    setCameraStatus(status);
    setIsInitializing(false);
  };

  const handlePhoneCameraSelect = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setCameraMode('phone');
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleExternalCameraSelect = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setCameraMode('external');
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleStartScan = async () => {
    try {
      if (!camera) {
        Alert.alert('Error', 'Camera is not ready. Please try again.');
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
    setType((current) => 
      current === Camera.Constants.Type.back 
        ? Camera.Constants.Type.front 
        : Camera.Constants.Type.back
    );
  };

  const takePicture = async () => {
    if (camera) {
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
    }
  };

  const retakePicture = () => {
    setCapturedImage(null);
    setAnalysisComplete(false);
  };

  const analyzeImage = async () => {
    if (!capturedImage) return;
    
    try {
      setIsAnalyzing(true);
      let userLocation = null;
      
      if (location.granted) {
        const locationResult = await Location.getCurrentPositionAsync({});
        userLocation = {
          latitude: locationResult.coords.latitude,
          longitude: locationResult.coords.longitude,
          accuracy: locationResult.coords.accuracy || undefined
        };
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAnalysisData: Omit<SoilAnalysisResult, 'id' | 'isSynced'> = {
        userId: 'user1',
        farmId: 'farm1',
        imageUrl: capturedImage,
        timestamp: Date.now(),
        location: userLocation || {
          latitude: 37.7749,
          longitude: -122.4194
        },
        disease: {
          type: 'fungal_infection' as SoilDisease,
          confidence: 0.87,
          severity: 3.5
        },
        soilHealth: 'fair',
        recommendations: [
          'Apply fungicide treatment within 48 hours',
          'Improve drainage in affected areas',
          'Consider crop rotation next season'
        ],
        nutrients: {
          nitrogen: 12,
          phosphorus: 9,
          potassium: 18,
          ph: 6.2,
          organicMatter: 3.4
        }
      };
      
      if (!isConnected) {
        await saveOfflineScan(mockAnalysisData);
        Alert.alert(
          'Offline Mode',
          'Your scan has been saved offline. It will sync when you reconnect to the internet.'
        );
      } else {
        console.log('Analysis data:', mockAnalysisData);
      }
      
      setAnalysisComplete(true);
      
      setTimeout(() => {
        router.push('/analysis/new');
      }, 1000);
    } catch (error) {
      console.error('Error analyzing image:', error);
      Alert.alert('Error', 'Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Header title="Scan" />
        <View style={[styles.container, styles.centered]}>
          <CameraOff size={64} color={colors.neutral[400]} />
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            We need camera permission to scan your soil samples.
          </Text>
          <Button 
            title="Grant Permission" 
            onPress={() => Camera.requestCameraPermissionsAsync()}
            style={styles.permissionButton}
          />
        </View>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Header title="Scan" />
        <View style={[styles.container, styles.centered]}>
          <CameraOff size={64} color={colors.neutral[400]} />
          <Text style={styles.permissionTitle}>Camera Access Denied</Text>
          <Text style={styles.permissionText}>
            Please enable camera access in your device settings to use this feature.
          </Text>
        </View>
      </View>
    );
  }

  if (isInitializing) {
    return <CameraInitializer onCameraReady={handleCameraReady} />;
  }

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

  const renderExternalCameraPlaceholder = () => (
    <Animated.View style={[styles.externalCameraContainer, { opacity: fadeAnim }]}>
      <Card style={styles.externalCameraCard}>
        <CameraOff size={48} color={colors.neutral[400]} />
        <Text style={styles.externalCameraTitle}>External Camera Not Connected</Text>
        <Text style={styles.externalCameraText}>
          Support for external camera devices will be available soon.
        </Text>
        <Button
          title="Try Again"
          variant="outline"
          onPress={() => setCameraMode('selection')}
          icon={<Repeat size={20} color={colors.primary[500]} />}
          style={styles.retryButton}
        />
      </Card>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <Header title="Soil Scan" />
      
      {cameraMode === 'selection' && renderCameraSelection()}
      
      {cameraMode === 'phone' && (
        <Animated.View style={[styles.cameraContainer, { opacity: fadeAnim }]}>
          <Camera
            style={styles.camera}
            type={type}
            ref={(ref) => setCamera(ref)}
          >
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.flipButton}
                onPress={handleFlipCamera}
              >
                <Text style={styles.flipButtonText}>Flip</Text>
              </TouchableOpacity>
            </View>
          </Camera>
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
              >
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
              <Text style={styles.captureText}>Tap to capture soil image</Text>
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
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  selectionContainer: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.xl,
  },
  selectionTitle: {
    ...typography.headingLarge,
    color: colors.neutral[900],
    marginBottom: spacing.xs,
  },
  selectionSubtitle: {
    ...typography.bodyLarge,
    color: colors.neutral[600],
    marginBottom: spacing.xl,
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
  externalCameraContainer: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.xl,
    justifyContent: 'center',
  },
  externalCameraCard: {
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  externalCameraTitle: {
    ...typography.headingMedium,
    color: colors.neutral[900],
    textAlign: 'center',
  },
  externalCameraText: {
    ...typography.bodyLarge,
    color: colors.neutral[600],
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  retryButton: {
    marginTop: spacing.sm,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flipButton: {
    padding: spacing.sm,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  flipButtonText: {
    color: colors.white,
    ...typography.labelMedium,
  },
  controlsContainer: {
    backgroundColor: colors.black,
    padding: spacing.xl,
    alignItems: 'center',
  },
  captureButtonContainer: {
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.white,
  },
  captureText: {
    ...typography.labelMedium,
    color: colors.white,
    marginTop: spacing.md,
  },
  previewControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  previewButton: {
    flex: 1,
    marginHorizontal: spacing.sm,
  },
  analyzingContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  analyzingText: {
    ...typography.bodyLarge,
    color: colors.white,
    marginTop: spacing.md,
  },
  permissionTitle: {
    ...typography.headingMedium,
    color: colors.neutral[800],
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  permissionText: {
    ...typography.bodyMedium,
    color: colors.neutral[600],
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  permissionButton: {
    marginTop: spacing.md,
  },
  offlineContainer: {
    backgroundColor: colors.warning[100],
    padding: spacing.md,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  offlineText: {
    ...typography.bodySmall,
    color: colors.warning[800],
    textAlign: 'center',
  },
});