/**
 * Network utilities for the SoilSense AI app
 * Handles connectivity tracking and offline sync
 */

import { useState, useEffect } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { getData, storeData, STORAGE_KEYS } from './storage';
import { SoilAnalysisResult } from '../types';

// Hook to track network connectivity
export const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isInternetReachable, setIsInternetReachable] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      setIsInternetReachable(state.isInternetReachable);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { isConnected, isInternetReachable };
};

// Save scan locally when offline
export const saveOfflineScan = async (scan: Omit<SoilAnalysisResult, 'id' | 'isSynced'>) => {
  try {
    const offlineScans = await getData(STORAGE_KEYS.OFFLINE_SCANS) || [];
    
    const newScan: SoilAnalysisResult = {
      ...scan,
      id: `offline-${Date.now()}`,
      isSynced: false,
    };
    
    await storeData(STORAGE_KEYS.OFFLINE_SCANS, [...offlineScans, newScan]);
    return newScan;
  } catch (error) {
    console.error('Error saving offline scan:', error);
    throw error;
  }
};

// Sync offline scans when back online
export const syncOfflineScans = async (syncFunction: (scan: SoilAnalysisResult) => Promise<void>): Promise<number> => {
  try {
    const offlineScans: SoilAnalysisResult[] = await getData(STORAGE_KEYS.OFFLINE_SCANS) || [];
    
    if (offlineScans.length === 0) {
      return 0;
    }
    
    let syncedCount = 0;
    const remainingScans = [];
    
    for (const scan of offlineScans) {
      try {
        await syncFunction(scan);
        syncedCount++;
      } catch (error) {
        console.error(`Failed to sync scan ${scan.id}:`, error);
        remainingScans.push(scan);
      }
    }
    
    await storeData(STORAGE_KEYS.OFFLINE_SCANS, remainingScans);
    return syncedCount;
  } catch (error) {
    console.error('Error syncing offline scans:', error);
    throw error;
  }
};