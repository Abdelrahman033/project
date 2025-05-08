import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { colors, spacing, typography } from '@/theme';
import { useRouter } from 'expo-router';
import {
  Database,
  Cloud,
  Shield,
  Bell,
  Globe,
  Image as ImageIcon,
  Map,
  Download,
} from 'lucide-react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import { SoilAnalysisResult } from '@/types';

// Mock data for demonstration
const mockAnalyses: SoilAnalysisResult[] = [
  {
    id: '1',
    userId: 'user1',
    farmId: 'farm1',
    imageUrl: 'https://images.pexels.com/photos/6024558/pexels-photo-6024558.jpeg',
    timestamp: Date.now() - 86400000 * 2,
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      accuracy: 10
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
    },
    isSynced: true
  },
  // Add more mock analyses as needed
];

export default function AdvancedSettingsScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    highQualityImages: true,
    autoSync: true,
    locationTracking: true,
    pushNotifications: true,
    emailNotifications: true,
    dataBackup: true,
    offlineMode: false,
    darkMode: false,
  });
  const [isExporting, setIsExporting] = useState(false);

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear all cached data? This will remove offline scans and images.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            // Implement cache clearing logic
            Alert.alert('Success', 'Cache cleared successfully');
          },
        },
      ]
    );
  };

  const generateReportHTML = (analysis: SoilAnalysisResult) => {
    const formatDate = (timestamp: number) => {
      const date = new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    };

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body {
              font-family: 'Helvetica';
              padding: 20px;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #2563eb;
              padding-bottom: 20px;
            }
            .header h1 {
              color: #2563eb;
              margin-bottom: 8px;
              font-size: 24px;
            }
            .slogan {
              color: #4b5563;
              font-style: italic;
              margin-bottom: 12px;
              font-size: 16px;
            }
            .generated-date {
              color: #6b7280;
              font-size: 14px;
            }
            .section {
              margin-bottom: 25px;
              background-color: #fff;
              border-radius: 8px;
              padding: 15px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            }
            .section-title {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 15px;
              color: #2563eb;
              border-bottom: 1px solid #e5e7eb;
              padding-bottom: 8px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 12px;
              padding: 4px 0;
            }
            .label {
              font-weight: bold;
              color: #4b5563;
            }
            .value {
              color: #1f2937;
            }
            .recommendations {
              background-color: #f8fafc;
              padding: 15px;
              border-radius: 8px;
              border: 1px solid #e5e7eb;
            }
            .recommendation-item {
              margin-bottom: 10px;
              padding-left: 20px;
              position: relative;
            }
            .recommendation-item:before {
              content: "•";
              position: absolute;
              left: 0;
              color: #2563eb;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              color: #6b7280;
              font-size: 12px;
              border-top: 1px solid #e5e7eb;
              padding-top: 20px;
            }
            .severity-indicator {
              display: inline-block;
              padding: 4px 8px;
              border-radius: 4px;
              font-weight: bold;
              margin-left: 8px;
            }
            .severity-high {
              background-color: #fee2e2;
              color: #dc2626;
            }
            .severity-medium {
              background-color: #fef3c7;
              color: #d97706;
            }
            .severity-low {
              background-color: #dcfce7;
              color: #16a34a;
            }
            .nutrient-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 12px;
              margin-top: 10px;
            }
            .nutrient-item {
              background-color: #f8fafc;
              padding: 10px;
              border-radius: 6px;
              text-align: center;
            }
            .nutrient-value {
              font-size: 20px;
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 4px;
            }
            .nutrient-label {
              font-size: 12px;
              color: #6b7280;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Soil Pulse</h1>
            <div class="slogan">Scan the soil, act on time</div>
            <p class="generated-date">Generated on ${formatDate(analysis.timestamp)}</p>
          </div>

          <div class="section">
            <div class="section-title">Analysis Details</div>
            <div class="info-row">
              <span class="label">Date:</span>
              <span class="value">${formatDate(analysis.timestamp)}</span>
            </div>
            <div class="info-row">
              <span class="label">Location:</span>
              <span class="value">${analysis.location.latitude.toFixed(4)}, ${analysis.location.longitude.toFixed(4)}</span>
            </div>
            <div class="info-row">
              <span class="label">Soil Health:</span>
              <span class="value">${analysis.soilHealth.charAt(0).toUpperCase() + analysis.soilHealth.slice(1)}</span>
            </div>
            <div class="info-row">
              <span class="label">Sync Status:</span>
              <span class="value">${analysis.isSynced ? 'Synced' : 'Offline'}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Disease Analysis</div>
            <div class="info-row">
              <span class="label">Type:</span>
              <span class="value">${analysis.disease.type.split('_').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}</span>
            </div>
            <div class="info-row">
              <span class="label">Severity:</span>
              <span class="value">
                ${analysis.disease.severity.toFixed(1)}
                <span class="severity-indicator ${
                  analysis.disease.severity >= 4 ? 'severity-high' :
                  analysis.disease.severity >= 2 ? 'severity-medium' :
                  'severity-low'
                }">
                  ${analysis.disease.severity >= 4 ? 'High' :
                    analysis.disease.severity >= 2 ? 'Medium' :
                    'Low'}
                </span>
              </span>
            </div>
            <div class="info-row">
              <span class="label">Confidence:</span>
              <span class="value">${(analysis.disease.confidence * 100).toFixed(1)}%</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Nutrient Analysis</div>
            <div class="nutrient-grid">
              <div class="nutrient-item">
                <div class="nutrient-value">${analysis.nutrients.nitrogen}</div>
                <div class="nutrient-label">Nitrogen (N)</div>
              </div>
              <div class="nutrient-item">
                <div class="nutrient-value">${analysis.nutrients.phosphorus}</div>
                <div class="nutrient-label">Phosphorus (P)</div>
              </div>
              <div class="nutrient-item">
                <div class="nutrient-value">${analysis.nutrients.potassium}</div>
                <div class="nutrient-label">Potassium (K)</div>
              </div>
              <div class="nutrient-item">
                <div class="nutrient-value">${analysis.nutrients.ph}</div>
                <div class="nutrient-label">pH Level</div>
              </div>
              <div class="nutrient-item">
                <div class="nutrient-value">${analysis.nutrients.organicMatter}%</div>
                <div class="nutrient-label">Organic Matter</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Recommendations</div>
            <div class="recommendations">
              ${analysis.recommendations.map(rec => 
                `<div class="recommendation-item">${rec}</div>`
              ).join('')}
            </div>
          </div>

          <div class="footer">
            <p>Generated by Soil Pulse</p>
            <p>This is an automated report. Please consult with an agronomist for detailed analysis.</p>
            <p>Report ID: ${analysis.id}</p>
          </div>
        </body>
      </html>
    `;
  };

  const handleExportData = async () => {
    try {
      setIsExporting(true);
      
      // Generate PDF report for the first analysis
      const analysis = mockAnalyses[0]; // For now, just export the first analysis
      const html = generateReportHTML(analysis);
      const { uri } = await Print.printToFileAsync({ html });
      
      // Share the PDF file
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Export Soil Analysis',
        UTI: 'com.adobe.pdf'
      });
      
      // Clean up the temporary PDF file
      await FileSystem.deleteAsync(uri);
      
      Alert.alert('Success', 'Data exported successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert('Error', 'Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const renderSettingItem = (
    icon: React.ReactNode,
    title: string,
    description: string,
    key: keyof typeof settings
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLabelContainer}>
        {icon}
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingLabel}>{title}</Text>
          <Text style={styles.settingDescription}>{description}</Text>
        </View>
      </View>
      <Switch
        value={settings[key]}
        onValueChange={() => toggleSetting(key)}
        trackColor={{ false: colors.neutral[300], true: colors.primary[300] }}
        thumbColor={settings[key] ? colors.primary[500] : colors.neutral[100]}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Header 
        title="Advanced Settings" 
        showBackButton
      />
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Storage</Text>
          {renderSettingItem(
            <ImageIcon size={20} color={colors.neutral[600]} />,
            'High Quality Images',
            'Store images in high resolution for better analysis',
            'highQualityImages'
          )}
          {renderSettingItem(
            <Cloud size={20} color={colors.neutral[600]} />,
            'Auto Sync',
            'Automatically sync data when online',
            'autoSync'
          )}
          {renderSettingItem(
            <Database size={20} color={colors.neutral[600]} />,
            'Data Backup',
            'Backup your data to cloud storage',
            'dataBackup'
          )}
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Location & Privacy</Text>
          {renderSettingItem(
            <Map size={20} color={colors.neutral[600]} />,
            'Location Tracking',
            'Track location for accurate soil analysis',
            'locationTracking'
          )}
          {renderSettingItem(
            <Shield size={20} color={colors.neutral[600]} />,
            'Offline Mode',
            'Work without internet connection',
            'offlineMode'
          )}
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          {renderSettingItem(
            <Bell size={20} color={colors.neutral[600]} />,
            'Push Notifications',
            'Receive alerts and updates',
            'pushNotifications'
          )}
          {renderSettingItem(
            <Globe size={20} color={colors.neutral[600]} />,
            'Email Notifications',
            'Get analysis reports via email',
            'emailNotifications'
          )}
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleClearCache}
          >
            <Database size={20} color={colors.error[500]} />
            <Text style={[styles.actionButtonText, { color: colors.error[500] }]}>
              Clear Cache
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleExportData}
            disabled={isExporting}
          >
            {isExporting ? (
              <ActivityIndicator color={colors.primary[500]} />
            ) : (
              <>
                <Download size={20} color={colors.primary[500]} />
                <Text style={[styles.actionButtonText, { color: colors.primary[500] }]}>
                  Export Data
                </Text>
              </>
            )}
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[100],
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.labelLarge,
    color: colors.neutral[800],
    marginBottom: spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTextContainer: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  settingLabel: {
    ...typography.labelMedium,
    color: colors.neutral[800],
    marginBottom: spacing.xxs,
  },
  settingDescription: {
    ...typography.bodySmall,
    color: colors.neutral[600],
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  actionButtonText: {
    ...typography.labelMedium,
    marginLeft: spacing.sm,
  },
}); 