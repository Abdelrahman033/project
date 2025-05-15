/**
 * Storage utilities for the SoilSense AI app
 * Handles secure storage for auth and offline data
 */

import * as SecureStore from 'expo-secure-store';
import { storage } from '@/config/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export const storeData = async (key: string, value: any): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await SecureStore.setItemAsync(key, jsonValue);
  } catch (error) {
    console.error('Error storing data:', error);
    throw error;
  }
};

export const getData = async (key: string): Promise<any> => {
  try {
    const jsonValue = await SecureStore.getItemAsync(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error retrieving data:', error);
    throw error;
  }
};

export const removeData = async (key: string): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error('Error removing data:', error);
    throw error;
  }
};

// Keys used in the app
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user',
  OFFLINE_SCANS: 'offline_scans',
  APP_SETTINGS: 'app_settings',
};

export const uploadFile = async (uri: string, path: string): Promise<string> => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export const uploadProfileImage = async (userId: string, uri: string): Promise<string> => {
  const path = `profile-images/${userId}`;
  return uploadFile(uri, path);
};

export const uploadFarmImage = async (farmId: string, uri: string): Promise<string> => {
  const path = `farm-images/${farmId}`;
  return uploadFile(uri, path);
};

export const deleteFile = async (path: string): Promise<void> => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};