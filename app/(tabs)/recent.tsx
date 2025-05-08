import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors, spacing, typography } from '@/theme';
import { useRouter } from 'expo-router';
import { SoilAnalysisResult } from '@/types';
import { Calendar, MapPin, AlertTriangle, Download } from 'lucide-react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';

// Mock data for demonstration
const mockAnalyses: SoilAnalysisResult[] = [
  {
    id: '1',
    userId: 'user1',
    farmId: 'farm1',
    imageUrl: 'https://images.pexels.com/photos/6024558/pexels-photo-6024558.jpeg',
    timestamp: Date.now() - 86400000 * 2, // 2 days ago
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
  {
    id: '2',
    userId: 'user1',
    farmId: 'farm1',
    imageUrl: 'https://images.pexels.com/photos/7728332/pexels-photo-7728332.jpeg',
    timestamp: Date.now() - 86400000 * 5, // 5 days ago
    location: {
      latitude: 37.7755,
      longitude: -122.4198,
      accuracy: 8
    },
    disease: {
      type: 'nutrient_deficiency',
      confidence: 0.92,
      severity: 2.0
    },
    soilHealth: 'good',
    recommendations: [
      'Apply balanced NPK fertilizer',
      'Consider soil amendment with compost'
    ],
    nutrients: {
      nitrogen: 8,
      phosphorus: 5,
      potassium: 12,
      ph: 6.7,
      organicMatter: 4.1
    },
    isSynced: true
  },
  {
    id: '3',
    userId: 'user1',
    farmId: 'farm1',
    imageUrl: 'https://images.pexels.com/photos/5474600/pexels-photo-5474600.jpeg',
    timestamp: Date.now() - 86400000 * 1, // 1 day ago
    location: {
      latitude: 37.7760,
      longitude: -122.4190,
      accuracy: 15
    },
    disease: {
      type: 'pest_damage',
      confidence: 0.78,
      severity: 4.2
    },
    soilHealth: 'poor',
    recommendations: [
      'Apply targeted pesticide immediately',
      'Monitor for signs of spread to adjacent areas',
      'Consider beneficial insects for long-term management'
    ],
    nutrients: {
      nitrogen: 14,
      phosphorus: 11,
      potassium: 10,
      ph: 5.9,
      organicMatter: 2.8
    },
    isSynced: false
  }
];

export default function RecentScreen() {
  const router = useRouter();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getSeverityColor = (severity: number) => {
    if (severity >= 4) return colors.error[500];
    if (severity >= 2) return colors.warning[500];
    return colors.success[500];
  };

  const handleRecordPress = (analysisId: string) => {
    router.push(`/analysis/${analysisId}`);
  };

  const generateReportHTML = (analysis: SoilAnalysisResult) => {
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
            <p class="generated-date">Generated on ${new Date().toLocaleDateString()}</p>
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

  const handleDownloadReport = async (analysis: SoilAnalysisResult) => {
    try {
      setDownloadingId(analysis.id);
      
      // Generate PDF
      const html = generateReportHTML(analysis);
      const { uri } = await Print.printToFileAsync({ html });
      
      // Create a filename
      const filename = `soil_analysis_${analysis.id}_${new Date().getTime()}.pdf`;
      const fileUri = `${FileSystem.documentDirectory}${filename}`;
      
      // Move the file to the documents directory
      await FileSystem.moveAsync({
        from: uri,
        to: fileUri
      });
      
      // Share the PDF
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Soil Analysis Report',
        UTI: 'com.adobe.pdf'
      });
    } catch (error) {
      console.error('Error generating report:', error);
      // You might want to show an error message to the user here
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Records</Text>
        <Text style={styles.slogan}>Scan the soil, act on time</Text>
      </View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {mockAnalyses.map((analysis) => (
          <TouchableOpacity
            key={analysis.id}
            style={styles.recordCard}
            onPress={() => handleRecordPress(analysis.id)}
          >
            <View style={styles.recordHeader}>
              <View style={styles.recordInfo}>
                <View style={styles.dateContainer}>
                  <Calendar size={16} color={colors.neutral[500]} />
                  <Text style={styles.dateText}>{formatDate(analysis.timestamp)}</Text>
                </View>
                <View style={styles.locationContainer}>
                  <MapPin size={16} color={colors.neutral[500]} />
                  <Text style={styles.locationText}>
                    {analysis.location.latitude.toFixed(4)}, {analysis.location.longitude.toFixed(4)}
                  </Text>
                </View>
              </View>
              <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(analysis.disease.severity) }]}>
                <AlertTriangle size={16} color={colors.white} />
                <Text style={styles.severityText}>
                  {analysis.disease.severity.toFixed(1)}
                </Text>
              </View>
            </View>

            <View style={styles.recordDetails}>
              <Text style={styles.diseaseType}>
                {analysis.disease.type.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </Text>
              <Text style={styles.soilHealth}>
                Soil Health: <Text style={styles.soilHealthValue}>{analysis.soilHealth}</Text>
              </Text>
            </View>

            <View style={styles.nutrientsContainer}>
              <View style={styles.nutrient}>
                <Text style={styles.nutrientLabel}>N</Text>
                <Text style={styles.nutrientValue}>{analysis.nutrients.nitrogen}</Text>
              </View>
              <View style={styles.nutrient}>
                <Text style={styles.nutrientLabel}>P</Text>
                <Text style={styles.nutrientValue}>{analysis.nutrients.phosphorus}</Text>
              </View>
              <View style={styles.nutrient}>
                <Text style={styles.nutrientLabel}>K</Text>
                <Text style={styles.nutrientValue}>{analysis.nutrients.potassium}</Text>
              </View>
              <View style={styles.nutrient}>
                <Text style={styles.nutrientLabel}>pH</Text>
                <Text style={styles.nutrientValue}>{analysis.nutrients.ph}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.downloadButton}
              onPress={() => handleDownloadReport(analysis)}
              disabled={downloadingId === analysis.id}
            >
              {downloadingId === analysis.id ? (
                <ActivityIndicator color={colors.primary[500]} />
              ) : (
                <>
                  <Download size={16} color={colors.primary[500]} />
                  <Text style={styles.downloadText}>Download Report</Text>
                </>
              )}
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    padding: spacing.xl,
    paddingTop: spacing.xxl,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  title: {
    ...typography.displaySmall,
    color: colors.neutral[900],
    marginBottom: spacing.xs,
  },
  slogan: {
    ...typography.bodyMedium,
    color: colors.neutral[600],
    fontStyle: 'italic',
  },
  content: {
    flex: 1,
  },
  recordCard: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
    padding: spacing.md,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  recordInfo: {
    flex: 1,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  dateText: {
    ...typography.bodySmall,
    color: colors.neutral[600],
    marginLeft: spacing.xs,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    ...typography.bodySmall,
    color: colors.neutral[600],
    marginLeft: spacing.xs,
  },
  severityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.sm,
  },
  severityText: {
    ...typography.labelMedium,
    color: colors.white,
    marginLeft: spacing.xs,
  },
  recordDetails: {
    marginBottom: spacing.md,
  },
  diseaseType: {
    ...typography.labelLarge,
    color: colors.neutral[900],
    marginBottom: spacing.xs,
  },
  soilHealth: {
    ...typography.bodyMedium,
    color: colors.neutral[600],
  },
  soilHealthValue: {
    color: colors.primary[600],
    fontWeight: 'bold',
  },
  nutrientsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.neutral[50],
    padding: spacing.sm,
    borderRadius: spacing.sm,
  },
  nutrient: {
    alignItems: 'center',
  },
  nutrientLabel: {
    ...typography.labelSmall,
    color: colors.neutral[600],
  },
  nutrientValue: {
    ...typography.labelMedium,
    color: colors.neutral[900],
    marginTop: spacing.xxs,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary[50],
    padding: spacing.sm,
    borderRadius: spacing.sm,
    marginTop: spacing.md,
  },
  downloadText: {
    ...typography.labelMedium,
    color: colors.primary[500],
    marginLeft: spacing.xs,
  },
}); 