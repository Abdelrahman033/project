import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export const HelpAndSupport: React.FC = () => {
  const [showLiveChat, setShowLiveChat] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <View style={styles.contactOptions}>
          <TouchableOpacity style={styles.contactOption}>
            <MaterialCommunityIcons
              name="email"
              size={24}
              color={colors.primary[500]}
            />
            <Text style={styles.contactText}>Email Support</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactOption}>
            <MaterialCommunityIcons
              name="phone"
              size={24}
              color={colors.primary[500]}
            />
            <Text style={styles.contactText}>Phone Support</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Live Chat</Text>
        <TouchableOpacity 
          style={styles.liveChatOption}
          onPress={() => setShowLiveChat(true)}
        >
          <MaterialCommunityIcons
            name="chat-processing"
            size={24}
            color={colors.primary[500]}
          />
          <Text style={styles.contactText}>Start Live Chat</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>FAQ</Text>
        <View style={styles.faqContainer}>
          <Text style={styles.faqText}>Frequently asked questions will appear here</Text>
        </View>
      </View>

      <Modal
        visible={showLiveChat}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowLiveChat(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Live Chat</Text>
              <TouchableOpacity 
                onPress={() => setShowLiveChat(false)}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={colors.neutral[800]}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.messageContainer}>
              <View style={styles.messageBubble}>
                <Text style={styles.messageText}>
                  👋 Hey there! We're working on something exciting!
                </Text>
              </View>
              <View style={styles.messageBubble}>
                <Text style={styles.messageText}>
                  Our live chat feature is coming soon. Stay tuned for real-time communication with our support team! 🚀
                </Text>
              </View>
              <View style={styles.messageBubble}>
                <Text style={styles.messageText}>
                  In the meantime, you can reach us through email or phone support. 📧
                </Text>
              </View>
            </View>

            <View style={styles.comingSoonContainer}>
              <MaterialCommunityIcons
                name="rocket-launch"
                size={48}
                color={colors.primary[500]}
              />
              <Text style={styles.comingSoonText}>Coming Soon</Text>
              <Text style={styles.comingSoonSubtext}>
                We're putting the finishing touches on this feature
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  section: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.neutral[800],
    marginBottom: spacing.md,
  },
  contactOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.md,
  },
  contactOption: {
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.primary[50],
    borderRadius: 12,
    width: '45%',
  },
  liveChatOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.primary[50],
    borderRadius: 12,
    marginTop: spacing.md,
  },
  contactText: {
    ...typography.bodyLarge,
    color: colors.neutral[800],
    marginLeft: spacing.sm,
  },
  faqContainer: {
    padding: spacing.md,
    backgroundColor: colors.neutral[50],
    borderRadius: 12,
  },
  faqText: {
    ...typography.bodyLarge,
    color: colors.neutral[600],
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.lg,
    height: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    ...typography.h2,
    color: colors.neutral[800],
  },
  closeButton: {
    padding: spacing.xs,
  },
  messageContainer: {
    marginBottom: spacing.xl,
  },
  messageBubble: {
    backgroundColor: colors.primary[50],
    padding: spacing.md,
    borderRadius: 16,
    marginBottom: spacing.sm,
    maxWidth: '80%',
    alignSelf: 'flex-start',
  },
  messageText: {
    ...typography.bodyLarge,
    color: colors.neutral[800],
  },
  comingSoonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  comingSoonText: {
    ...typography.h1,
    color: colors.primary[500],
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  comingSoonSubtext: {
    ...typography.bodyLarge,
    color: colors.neutral[600],
    textAlign: 'center',
  },
}); 