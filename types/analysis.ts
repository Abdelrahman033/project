/**
 * Analysis types for the SoilSense AI app
 */

export type SoilHealth = 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
export type SoilDisease = 'root_rot' | 'nutrient_deficiency' | 'pest_damage' | 'fungal_infection' | 'bacterial_wilt' | 'healthy' | 'unknown';

export interface SoilAnalysisResult {
  id: string;
  userId: string;
  farmId: string;
  imageUrl: string;
  timestamp: number;
  location: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
  disease: {
    type: SoilDisease;
    confidence: number; // 0-1
    severity: number; // 0-5
  };
  soilHealth: SoilHealth;
  recommendations: string[];
  nutrients: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    ph: number;
    organicMatter: number;
  };
  isSynced: boolean;
}

export interface AnalysisFilters {
  dateRange?: {
    startDate: number;
    endDate: number;
  };
  soilHealth?: SoilHealth[];
  diseaseTypes?: SoilDisease[];
  farmIds?: string[];
}