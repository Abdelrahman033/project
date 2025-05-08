/**
 * Auth types for the SoilSense AI app
 */

export type UserRole = 'agronomist' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  farms?: Farm[];
  profileImageUrl?: string;
}

export interface Farm {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
  size: number; // in acres/hectares
  crops: string[];
  soilHealth: 'good' | 'fair' | 'poor';
  lastAnalysis: number; // timestamp
  totalAnalyses: number;
  alerts: number;
  averageNutrients: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    ph: number;
    organicMatter: number;
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}