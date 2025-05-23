import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { colors, spacing, typography } from '@/theme';
import { ChevronDown, MapPin } from 'lucide-react-native';

interface Farm {
  id: string;
  name: string;
}

interface FarmPickerProps {
  selectedFarm: string;
  onFarmChange: (farmId: string) => void;
  farms: Farm[];
}

export function FarmPicker({ selectedFarm, onFarmChange, farms }: FarmPickerProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const selectedFarmName = selectedFarm === 'unassigned' 
    ? 'Unassigned' 
    : farms.find(farm => farm.id === selectedFarm)?.name || 'Unassigned';

  const handleSelectFarm = (farmId: string) => {
    onFarmChange(farmId);
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Farm</Text>
      <TouchableOpacity
        style={styles.pickerContainer}
        onPress={() => setIsModalVisible(true)}
        activeOpacity={0.7}
      >
        <View style={styles.selectedFarmContainer}>
          <MapPin size={18} color={colors.primary[500]} />
          <Text style={styles.selectedFarmText}>{selectedFarmName}</Text>
        </View>
        <ChevronDown size={20} color={colors.neutral[600]} />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Farm</Text>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Done</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={[{ id: 'unassigned', name: 'Unassigned' }, ...farms]}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.farmOption,
                    selectedFarm === item.id && styles.selectedFarmOption
                  ]}
                  onPress={() => handleSelectFarm(item.id)}
                >
                  <Text style={[
                    styles.farmOptionText,
                    selectedFarm === item.id && styles.selectedFarmOptionText
                  ]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.labelMedium,
    color: colors.neutral[700],
    marginBottom: spacing.xs,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    padding: spacing.sm,
  },
  selectedFarmContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  selectedFarmText: {
    ...typography.bodyMedium,
    color: colors.neutral[800],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: spacing.lg,
    borderTopRightRadius: spacing.lg,
    paddingTop: spacing.md,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  modalTitle: {
    ...typography.headingSmall,
    color: colors.neutral[800],
  },
  closeButton: {
    padding: spacing.xs,
  },
  closeButtonText: {
    ...typography.labelMedium,
    color: colors.primary[500],
  },
  farmOption: {
    padding: spacing.md,
  },
  selectedFarmOption: {
    backgroundColor: colors.primary[50],
  },
  farmOptionText: {
    ...typography.bodyMedium,
    color: colors.neutral[800],
  },
  selectedFarmOptionText: {
    color: colors.primary[700],
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: colors.neutral[200],
  },
}); 