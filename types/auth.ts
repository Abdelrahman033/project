/**
 * Auth types for the SoilSense AI app
 */

export type UserRole = 'agronomist' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  farmName?: string;
  role: 'farmer' | 'admin';
  farms: Farm[];
  createdAt: string;
  updatedAt?: string;
  dataSyncEnabled?: boolean;
  autoBackupEnabled?: boolean;
  measurementUnit?: 'Metric' | 'Imperial';
  scanFrequency?: 'Daily' | 'Weekly' | 'Monthly';
  notificationsEnabled?: boolean;
  darkMode?: boolean;
  language?: string;
}

export interface Farm {
  id: string;
  name: string;
  size: number; // in square meters
  crops: string[];
  location?: {
    latitude: number;
    longitude: number;
  };
  soilHealth?: 'good' | 'fair' | 'poor';
  lastAnalysis?: number; // timestamp
  totalAnalyses?: number;
  alerts?: number;
  averageNutrients?: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    ph: number;
    organicMatter: number;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
}