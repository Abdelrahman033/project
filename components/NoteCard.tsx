import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Share } from 'react-native';
import { colors, spacing, typography } from '@/theme';
import { Share2 } from 'lucide-react-native';

interface Note {
  id: string;
  text: string;
  timestamp: number;
  farmName: string;
}

interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  const handleShare = async () => {
    try {
      const shareText = `🧾 Field Note — ${note.farmName}\n\n${note.text}\n\n⏱ Saved on ${new Date(note.timestamp).toLocaleString()}`;
      await Share.share({
        message: shareText,
      });
    } catch (error) {
      console.error('Error sharing note:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.farmBadge}>
            <Text style={styles.farmName}>{note.farmName}</Text>
          </View>
        </View>
        
        <Text style={styles.noteText} numberOfLines={3}>
          {note.text}
        </Text>
        
        <View style={styles.footer}>
          <Text style={styles.timestamp}>
            {new Date(note.timestamp).toLocaleString()}
          </Text>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShare}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
          >
            <Share2 size={18} color={colors.neutral[600]} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: spacing.md,
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  farmBadge: {
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary[100],
  },
  farmName: {
    ...typography.labelSmall,
    color: colors.primary[700],
  },
  noteText: {
    ...typography.bodyMedium,
    color: colors.neutral[800],
    marginBottom: spacing.sm,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  timestamp: {
    ...typography.labelSmall,
    color: colors.neutral[600],
  },
  shareButton: {
    padding: spacing.xs,
    backgroundColor: colors.neutral[50],
    borderRadius: spacing.sm,
  },
}); 