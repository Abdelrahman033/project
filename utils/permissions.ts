/**
 * Permission utilities for the SoilSense AI app
 */

import * as Location from 'expo-location';
import { CameraPermissionResponse, useCameraPermissions } from 'expo-camera';
import { useEffect, useState } from 'react';

export type PermissionStatus = 'granted' | 'denied' | 'undetermined';

export const usePermissions = () => {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [locationStatus, setLocationStatus] = useState<PermissionStatus>('undetermined');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLocationPermission = async () => {
      const { status } = await Location.getForegroundPermissionsAsync();
      setLocationStatus(status as PermissionStatus);
      setIsLoading(false);
    };

    checkLocationPermission();
  }, []);

  const requestLocationPermission = async (): Promise<PermissionStatus> => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setLocationStatus(status as PermissionStatus);
    return status as PermissionStatus;
  };

  return {
    camera: {
      status: cameraPermission?.status || 'undetermined',
      granted: cameraPermission?.granted || false,
      request: requestCameraPermission,
    },
    location: {
      status: locationStatus,
      granted: locationStatus === 'granted',
      request: requestLocationPermission,
    },
    isLoading,
  };
};