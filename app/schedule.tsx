import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '@/components/Card';
import { colors, spacing, typography } from '@/theme';
import { ArrowLeft, Calendar, Clock, MapPin, X } from 'lucide-react-native';

export default function SchedulePage() {
  const router = useRouter();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const handleSchedule = () => {
    // Implement schedule logic
    console.log('Schedule:', {
      date: selectedDate,
      time: selectedTime,
      location,
      notes
    });
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.neutral[800]} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Schedule Analysis</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Card style={styles.formCard}>
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Date & Time</Text>
            <View style={styles.dateTimeContainer}>
              <TouchableOpacity 
                style={styles.dateTimeButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Calendar size={20} color={colors.primary[500]} />
                <Text style={styles.dateTimeText}>
                  {selectedDate ? selectedDate.toLocaleDateString() : 'Select Date'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.dateTimeButton}
                onPress={() => setShowTimePicker(true)}
              >
                <Clock size={20} color={colors.primary[500]} />
                <Text style={styles.dateTimeText}>
                  {selectedTime || 'Select Time'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Location</Text>
            <TouchableOpacity 
              style={styles.locationButton}
              onPress={() => {
                // Implement location selection
                setLocation('Current Location');
              }}
            >
              <MapPin size={20} color={colors.primary[500]} />
              <Text style={styles.locationText}>
                {location || 'Select Location'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Add any additional notes..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              placeholderTextColor={colors.neutral[500]}
            />
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => router.back()}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.scheduleButton]}
              onPress={handleSchedule}
            >
              <Text style={styles.scheduleButtonText}>Schedule</Text>
            </TouchableOpacity>
          </View>
        </Card>
      </ScrollView>

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <Card style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Date</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowDatePicker(false)}
              >
                <X size={24} color={colors.neutral[800]} />
              </TouchableOpacity>
            </View>
            {/* Add DatePicker component here */}
          </Card>
        </View>
      </Modal>

      {/* Time Picker Modal */}
      <Modal
        visible={showTimePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTimePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <Card style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Time</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowTimePicker(false)}
              >
                <X size={24} color={colors.neutral[800]} />
              </TouchableOpacity>
            </View>
            {/* Add TimePicker component here */}
          </Card>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[100],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: spacing.xs,
    marginRight: spacing.sm,
  },
  headerTitle: {
    ...typography.headingMedium,
    color: colors.neutral[800],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },
  formCard: {
    padding: spacing.lg,
  },
  formSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.labelLarge,
    color: colors.neutral[800],
    marginBottom: spacing.sm,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  dateTimeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.md,
    backgroundColor: colors.neutral[100],
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  dateTimeText: {
    ...typography.bodyMedium,
    color: colors.neutral[800],
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.md,
    backgroundColor: colors.neutral[100],
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  locationText: {
    ...typography.bodyMedium,
    color: colors.neutral[800],
  },
  notesInput: {
    padding: spacing.md,
    backgroundColor: colors.neutral[100],
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    ...typography.bodyMedium,
    color: colors.neutral[800],
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  button: {
    flex: 1,
    padding: spacing.md,
    borderRadius: spacing.sm,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.neutral[100],
  },
  scheduleButton: {
    backgroundColor: colors.primary[500],
  },
  cancelButtonText: {
    ...typography.labelLarge,
    color: colors.neutral[800],
  },
  scheduleButtonText: {
    ...typography.labelLarge,
    color: colors.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    padding: spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    ...typography.headingMedium,
    color: colors.neutral[800],
  },
  closeButton: {
    padding: spacing.xs,
  },
}); 