import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, typography } from '@/theme';
import { Card } from './Card';
import { Save } from 'lucide-react-native';

interface Note {
  id: string;
  content: string;
  timestamp: number;
}

export const AddNoteSection = () => {
  const [note, setNote] = useState('');
  const [recentNotes, setRecentNotes] = useState<Note[]>([]);

  useEffect(() => {
    loadRecentNotes();
  }, []);

  const loadRecentNotes = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem('fieldNotes');
      if (storedNotes) {
        const notes = JSON.parse(storedNotes);
        setRecentNotes(notes.slice(0, 3)); // Get only the 3 most recent notes
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const saveNote = async () => {
    if (!note.trim()) {
      Alert.alert('Error', 'Please enter a note before saving.');
      return;
    }

    try {
      const newNote: Note = {
        id: Date.now().toString(),
        content: note.trim(),
        timestamp: Date.now(),
      };

      const storedNotes = await AsyncStorage.getItem('fieldNotes');
      const notes = storedNotes ? JSON.parse(storedNotes) : [];
      const updatedNotes = [newNote, ...notes];

      await AsyncStorage.setItem('fieldNotes', JSON.stringify(updatedNotes));
      setNote('');
      loadRecentNotes();
      Alert.alert('Success', 'Note saved successfully');
    } catch (error) {
      console.error('Error saving note:', error);
      Alert.alert('Error', 'Failed to save note. Please try again.');
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderNoteCard = ({ item }: { item: Note }) => (
    <Card style={styles.noteCard}>
      <Text style={styles.noteContent} numberOfLines={2}>
        {item.content}
      </Text>
      <Text style={styles.noteTimestamp}>
        {formatTimestamp(item.timestamp)}
      </Text>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Card style={styles.inputCard}>
        <TextInput
          style={styles.input}
          placeholder="Add a field note or observation..."
          value={note}
          onChangeText={setNote}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
        <TouchableOpacity
          style={styles.saveButton}
          onPress={saveNote}
          accessibilityRole="button"
          accessibilityLabel="Save note"
        >
          <Save size={20} color={colors.white} />
          <Text style={styles.saveButtonText}>Save Note</Text>
        </TouchableOpacity>
      </Card>

      {recentNotes.length > 0 && (
        <View style={styles.recentNotesContainer}>
          <Text style={styles.recentNotesTitle}>Recent Notes</Text>
          <FlatList
            data={recentNotes}
            renderItem={renderNoteCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  inputCard: {
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    ...typography.bodyMedium,
    color: colors.neutral[800],
    padding: spacing.sm,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary[500],
    padding: spacing.sm,
    borderRadius: spacing.sm,
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  saveButtonText: {
    ...typography.labelMedium,
    color: colors.white,
  },
  recentNotesContainer: {
    marginTop: spacing.md,
  },
  recentNotesTitle: {
    ...typography.subtitle1,
    color: colors.neutral[800],
    marginBottom: spacing.sm,
  },
  noteCard: {
    marginBottom: spacing.sm,
    padding: spacing.sm,
    elevation: 1,
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  noteContent: {
    ...typography.bodyMedium,
    color: colors.neutral[800],
    marginBottom: spacing.xs,
  },
  noteTimestamp: {
    ...typography.bodySmall,
    color: colors.neutral[600],
  },
}); 