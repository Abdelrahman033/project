import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, typography } from '@/theme';
import { ArrowLeft, Save, FileText } from 'lucide-react-native';
import { FarmPicker } from '@/components/FarmPicker';
import { NoteCard } from '@/components/NoteCard';
import { useUser } from '@/contexts/UserContext';

interface Farm {
  id: string;
  name: string;
}

interface Note {
  id: string;
  text: string;
  timestamp: number;
  farmName: string;
}

const NOTE_PAPER_COLOR = '#FFFCEB';
const LINE_COLOR = 'rgba(0, 0, 0, 0.08)';
const MARGIN_COLOR = 'rgba(255, 0, 0, 0.2)';

function NotebookLines() {
  return (
    <View style={styles.linesContainer}>
      <View style={styles.marginLine} />
      {[...Array(8)].map((_, index) => (
        <View key={index} style={styles.line} />
      ))}
    </View>
  );
}

export default function AddNoteScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedFarm, setSelectedFarm] = useState('unassigned');
  const [isSaving, setIsSaving] = useState(false);

  const userFarms = user?.farms || [];

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem('fieldNotes');
      if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes);
        setNotes(parsedNotes.sort((a: Note, b: Note) => b.timestamp - a.timestamp).slice(0, 3));
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const saveNote = async () => {
    if (!noteText.trim()) {
      Alert.alert('Error', 'Please enter a note before saving.');
      return;
    }

    setIsSaving(true);
    try {
      const farmName = selectedFarm === 'unassigned' 
        ? 'Unassigned' 
        : userFarms.find((farm: Farm) => farm.id === selectedFarm)?.name || 'Unassigned';

      const newNote: Note = {
        id: Date.now().toString(),
        text: noteText.trim(),
        timestamp: Date.now(),
        farmName,
      };

      const savedNotes = await AsyncStorage.getItem('fieldNotes');
      const existingNotes = savedNotes ? JSON.parse(savedNotes) : [];
      const updatedNotes = [newNote, ...existingNotes];

      await AsyncStorage.setItem('fieldNotes', JSON.stringify(updatedNotes));
      setNoteText('');
      loadNotes();
      
      Alert.alert('Success', 'Note saved successfully!');
    } catch (error) {
      console.error('Error saving note:', error);
      Alert.alert('Error', 'Failed to save note. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={colors.neutral[800]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Field Note</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <FarmPicker
          selectedFarm={selectedFarm}
          onFarmChange={setSelectedFarm}
          farms={userFarms}
        />

        <View style={styles.inputContainer}>
          <View style={styles.notePaper}>
            <TextInput
              style={styles.input}
              multiline
              placeholder="Write your field observation here..."
              value={noteText}
              onChangeText={setNoteText}
              textAlignVertical="top"
              placeholderTextColor={colors.neutral[400]}
            />
          </View>
          
          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={saveNote}
            disabled={isSaving}
            activeOpacity={0.8}
          >
            {isSaving ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <>
                <Save size={20} color={colors.white} />
                <Text style={styles.saveButtonText}>Save Note</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.notesSection}>
          <Text style={styles.sectionTitle}>Recent Notes</Text>
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
          {notes.length === 0 && (
            <View style={styles.emptyState}>
              <FileText size={48} color={colors.neutral[400]} />
              <Text style={styles.emptyText}>
                No notes yet. Add your first field observation!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    padding: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
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
  inputContainer: {
    marginBottom: spacing.lg,
  },
  notePaper: {
    backgroundColor: colors.white,
    borderRadius: spacing.md,
    padding: spacing.md,
    minHeight: 200,
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: spacing.md,
  },
  input: {
    ...typography.bodyLarge,
    color: colors.neutral[800],
    lineHeight: 28,
    padding: spacing.xs,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary[500],
    padding: spacing.md,
    borderRadius: spacing.md,
    gap: spacing.xs,
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    ...typography.labelMedium,
    color: colors.white,
  },
  notesSection: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    ...typography.headingSmall,
    color: colors.neutral[800],
    marginBottom: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.white,
    borderRadius: spacing.md,
    marginTop: spacing.md,
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  emptyText: {
    ...typography.bodyMedium,
    color: colors.neutral[600],
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: spacing.md,
  },
  linesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingLeft: spacing.xl,
  },
  marginLine: {
    position: 'absolute',
    left: spacing.md,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: MARGIN_COLOR,
  },
  line: {
    height: 1,
    backgroundColor: LINE_COLOR,
    marginVertical: 24,
  },
}); 