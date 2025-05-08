import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import { CameraView, CameraType } from 'expo-camera';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { colors, spacing, typography } from '@/theme';
import { useRouter } from 'expo-router';
import { usePermissions } from '@/utils/permissions';
import { getCurrentLocation } from '@/utils/location';
import { useNetworkStatus } from '@/utils/network';
import { saveOfflineScan } from '@/utils/network';
import { CameraOff, Repeat, Image as ImageIcon, Upload, MapPin } from 'lucide-react-native';

export default function ScanScreen() {
  const router = useRouter();
  const cameraRef = useRef<any>(null);
  const [type, setType] = useState<CameraType>('back');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const { camera, location, isLoading } = usePermissions();
  const { isConnected } = useNetworkStatus();

  const toggleCameraType = () => {
    setType(current => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setCapturedImage(photo.uri);
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to capture image. Please try again.');
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
      
      // Get current location for the scan
      const userLocation = await getCurrentLocation();
      
      // Simulate image upload and AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, create a mock analysis result
      const mockAnalysisData = {
        userId: 'user1',
        farmId: 'farm1',
        imageUrl: capturedImage,
        timestamp: Date.now(),
        location: userLocation ? {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          accuracy: userLocation.accuracy
        } : {
          latitude: 37.7749,
          longitude: -122.4194
        },
        disease: {
          type: 'fungal_infection',
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
      
      // If offline, save the scan locally
      if (!isConnected) {
        await saveOfflineScan(mockAnalysisData);
        Alert.alert(
          'Offline Mode',
          'Your scan has been saved offline. It will sync when you reconnect to the internet.'
        );
      } else {
        // In a real app, this would send the image to your API
        console.log('Analysis data:', mockAnalysisData);
      }
      
      setAnalysisComplete(true);
      
      // Navigate to the analysis result
      // In a real app, you'd pass the actual analysis ID
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

  // Request permissions if needed
  const requestCameraPermission = async () => {
    await camera.request();
  };

  const requestLocationPermission = async () => {
    await location.request();
  };

  // Show loading state while checking permissions
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
        <Text style={styles.permissionText}>Checking permissions...</Text>
      </View>
    );
  }

  // Show permission request screen if permissions are not granted
  if (!camera.granted) {
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
            onPress={requestCameraPermission}
            style={styles.permissionButton}
          />
        </View>
      </View>
    );
  }

  // If location permission is not granted, request it
  if (!location.granted) {
    return (
      <View style={styles.container}>
        <Header title="Scan" />
        <View style={[styles.container, styles.centered]}>
          <MapPin size={64} color={colors.neutral[400]} />
          <Text style={styles.permissionTitle}>Location Access Required</Text>
          <Text style={styles.permissionText}>
            We need location permission to tag your soil scans with GPS coordinates.
          </Text>
          <Button 
            title="Grant Permission" 
            onPress={requestLocationPermission}
            style={styles.permissionButton}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Soil Scan" />
      
      <View style={styles.cameraContainer}>
        {!capturedImage ? (
          // Camera view
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={type}
            enableZoomGesture
          >
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.flipButton} 
                onPress={toggleCameraType}
              >
                <Repeat size={24} color={colors.white} />
              </TouchableOpacity>
            </View>
          </CameraView>
        ) : (
          // Captured image preview
          <Image 
            source={{ uri: capturedImage }} 
            style={styles.capturedImage} 
          />
        )}
      </View>
      
      <View style={styles.controlsContainer}>
        {!capturedImage ? (
          // Camera controls
          <View style={styles.captureButtonContainer}>
            <TouchableOpacity 
              style={styles.captureButton}
              onPress={takePicture}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
            <Text style={styles.captureText}>Tap to capture soil image</Text>
          </View>
        ) : (
          // Image preview controls
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
  capturedImage: {
    flex: 1,
    resizeMode: 'cover',
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
    minWidth: 200,
  },
  offlineContainer: {
    backgroundColor: colors.warning[500],
    padding: spacing.md,
  },
  offlineText: {
    ...typography.bodyMedium,
    color: colors.white,
    textAlign: 'center',
  },
});