import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { COLORS, formatKzt } from '../data/mockData';
import { useOrder } from '../context/OrderContext';
import { SampleLeakPhotoCard } from '../components/SampleLeakPhotoCard';

export const OrderIntakeScreen: React.FC = () => {
  const {
    selectedService,
    clientAddress,
    createAndDispatchOrder,
    navigateToStep,
  } = useOrder();

  const [description, setDescription] = useState<string>('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [hasPhoto, setHasPhoto] = useState<boolean>(false);

  const handleAddPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri);
        setHasPhoto(true);
      } else {
        // Subtle fallback to sample photo if simulator gallery is empty or dismissed
        setPhotoUri(null);
        setHasPhoto(true);
      }
    } catch {
      setPhotoUri(null);
      setHasPhoto(true);
    }
  };

  const handleBookRepair = () => {
    createAndDispatchOrder({
      description,
      photoUri,
      usedSamplePhoto: hasPhoto && !photoUri,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Minimal Back Header */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigateToStep('HOME')}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={22} color={COLORS.ink} />
        </TouchableOpacity>

        {/* Clean Selected Service Summary */}
        <View style={styles.summarySection}>
          <View style={styles.titleRow}>
            <Text style={styles.serviceTitle}>{selectedService.title}</Text>
            <Text style={styles.servicePrice}>{formatKzt(selectedService.priceKzt)}</Text>
          </View>
          <Text style={styles.serviceSubtitle}>{selectedService.subtitle}</Text>

          <View style={styles.addressRow}>
            <Feather name="map-pin" size={14} color={COLORS.secondaryText} />
            <Text style={styles.addressText}>{clientAddress}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Simple Note Input */}
        <View style={styles.section}>
          <Text style={styles.label}>Issue details</Text>
          <TextInput
            style={styles.noteInput}
            value={description}
            onChangeText={setDescription}
            multiline
            placeholder="Describe the issue..."
            placeholderTextColor={COLORS.mutedText}
          />
        </View>

        {/* Dashed Photo Upload Box */}
        <View style={styles.section}>
          <Text style={styles.label}>Photo (optional)</Text>

          {!hasPhoto ? (
            <TouchableOpacity
              style={styles.dashedUploadBox}
              onPress={handleAddPhoto}
              activeOpacity={0.75}
            >
              <Feather name="camera" size={20} color={COLORS.secondaryText} />
              <Text style={styles.uploadBoxText}>+ Add photo</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.photoPreviewWrap}>
              <SampleLeakPhotoCard photoUri={photoUri} height={150} />
              <TouchableOpacity
                style={styles.removePhotoBtn}
                onPress={() => {
                  setPhotoUri(null);
                  setHasPhoto(false);
                }}
              >
                <Feather name="x" size={16} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Sticky Bottom Button */}
      <View style={styles.stickyFooter}>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={handleBookRepair}
          activeOpacity={0.88}
        >
          <Text style={styles.bookButtonText}>
            Book Repair · {formatKzt(selectedService.priceKzt)}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingRight: 12,
    marginBottom: 16,
  },
  summarySection: {
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 6,
  },
  serviceTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.ink,
    letterSpacing: -0.4,
  },
  servicePrice: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.ink,
  },
  serviceSubtitle: {
    fontSize: 14,
    color: COLORS.secondaryText,
    marginBottom: 14,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addressText: {
    fontSize: 14,
    color: COLORS.secondaryText,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginBottom: 22,
  },
  section: {
    marginBottom: 22,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.ink,
    marginBottom: 10,
  },
  noteInput: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    minHeight: 96,
    fontSize: 15,
    color: COLORS.ink,
    textAlignVertical: 'top',
  },
  dashedUploadBox: {
    height: 110,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  uploadBoxText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.secondaryText,
  },
  photoPreviewWrap: {
    position: 'relative',
  },
  removePhotoBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stickyFooter: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    backgroundColor: COLORS.background,
  },
  bookButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
