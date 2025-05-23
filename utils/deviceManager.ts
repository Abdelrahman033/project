import * as Device from 'expo-device';
import { doc, collection, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';
import Constants from 'expo-constants';

export interface DeviceInfo {
  deviceId: string;
  modelName: string;
  brand: string;
  osName: string;
  osVersion: string;
  lastSeen: any; // Firestore timestamp
}

export const getDeviceInfo = async (): Promise<DeviceInfo> => {
  try {
    const deviceId = Constants.installationId || 'unknown';
    const modelName = Device.modelName || 'Unknown Device';
    const brand = Device.brand || 'Unknown Brand';
    const osName = Device.osName || 'Unknown OS';
    const osVersion = Device.osVersion || 'Unknown Version';

    return {
      deviceId,
      modelName,
      brand,
      osName,
      osVersion,
      lastSeen: serverTimestamp(),
    };
  } catch (error) {
    console.error('Error getting device info:', error);
    return {
      deviceId: 'unknown',
      modelName: 'Unknown Device',
      brand: 'Unknown Brand',
      osName: 'Unknown OS',
      osVersion: 'Unknown Version',
      lastSeen: serverTimestamp(),
    };
  }
};

export const saveDeviceInfo = async (userId: string, deviceInfo: DeviceInfo) => {
  try {
    const deviceRef = doc(db, 'users', userId, 'devices', deviceInfo.deviceId);
    const deviceDoc = await getDoc(deviceRef);

    // Update device info
    await setDoc(deviceRef, deviceInfo, { merge: true });

    // Update user metadata
    const userMetadataRef = doc(db, 'users', userId, 'metadata', 'login');
    await setDoc(userMetadataRef, {
      lastLogin: serverTimestamp(),
      lastDevice: `${deviceInfo.modelName} (${deviceInfo.osName} ${deviceInfo.osVersion})`,
    }, { merge: true });

    return !deviceDoc.exists(); // Return true if this is a new device
  } catch (error) {
    console.error('Error saving device info:', error);
    return false;
  }
};

export const getLastLoginInfo = async (userId: string) => {
  try {
    const metadataRef = doc(db, 'users', userId, 'metadata', 'login');
    const metadataDoc = await getDoc(metadataRef);
    
    if (metadataDoc.exists()) {
      return metadataDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting last login info:', error);
    return null;
  }
}; 