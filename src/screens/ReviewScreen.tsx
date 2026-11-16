import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, REVIEW_QUICK_TAGS } from '../data/mockData';
import { useOrder } from '../context/OrderContext';

export const ReviewScreen: React.FC = () => {
  const { proProfile, submitReview } = useOrder();

  const [rating, setRating] = useState<number>(5);
  const [selectedTags, setSelectedTags] = useState<string[]>(['On time', 'Fixed price']);
  const [comment, setComment] = useState<string>('');

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.backdrop}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.modalCard}>
        <Text style={styles.title}>
          How was your repair with {proProfile.name}?
        </Text>

        {/* 5 Clean Stars */}
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => {
            const active = star <= rating;
            return (
              <TouchableOpacity
                key={star}
                style={styles.starTouch}
                onPress={() => setRating(star)}
                activeOpacity={0.75}
              >
                <Ionicons
                  name={active ? 'star' : 'star-outline'}
                  size={34}
                  color={active ? COLORS.amber : COLORS.border}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 3 Simple Selectable Pills */}
        <View style={styles.tagsRow}>
          {REVIEW_QUICK_TAGS.map((tag) => {
            const selected = selectedTags.includes(tag);
            return (
              <TouchableOpacity
                key={tag}
                style={[styles.tagPill, selected && styles.tagPillSelected]}
                onPress={() => toggleTag(tag)}
                activeOpacity={0.8}
              >
                <Text style={[styles.tagText, selected && styles.tagTextSelected]}>
                  {tag}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Optional Short Comment Box */}
        <TextInput
          style={styles.commentInput}
          value={comment}
          onChangeText={setComment}
          multiline
          placeholder="Add a comment (optional)"
          placeholderTextColor={COLORS.mutedText}
        />

        {/* Done Button */}
        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => submitReview(rating, selectedTags, comment)}
          activeOpacity={0.88}
        >
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.divider,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.ink,
    textAlign: 'center',
    marginBottom: 22,
    letterSpacing: -0.3,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 24,
  },
  starTouch: {
    padding: 4,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  tagPill: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
  },
  tagPillSelected: {
    backgroundColor: COLORS.primary,
  },
  tagText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: COLORS.secondaryText,
  },
  tagTextSelected: {
    color: COLORS.white,
  },
  commentInput: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    minHeight: 80,
    fontSize: 14.5,
    color: COLORS.ink,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  doneButton: {
    backgroundColor: COLORS.blackPill,
    borderRadius: 999,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
