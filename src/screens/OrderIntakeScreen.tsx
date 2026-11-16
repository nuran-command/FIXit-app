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
import { Feather, Ionicons } from '@expo/vector-icons';
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
        {/* Minimal Header */}
        <View style={styles.topNavRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigateToStep('HOME')}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={20} color={COLORS.ink} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Review & Book</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Selected Service Hero Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{selectedService.category}</Text>
            </View>
            <View style={styles.guaranteePill}>
              <Feather name="shield" size={12} color={COLORS.emerald} />
              <Text style={styles.guaranteeText}>Fixed Rate</Text>
            </View>
          </View>

          <View style={styles.summaryBody}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.serviceTitle}>{selectedService.title}</Text>
              <Text style={styles.serviceSubtitle}>{selectedService.subtitle}</Text>
            </View>
            <Text style={styles.servicePrice}>{formatKzt(selectedService.priceKzt)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.metaRow}>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>SERVICE ADDRESS</Text>
              <View style={styles.addressLine}>
                <Feather name="map-pin" size={13} color={COLORS.primary} style={{ marginRight: 4 }} />
                <Text style={styles.metaValText} numberOfLines={1}>
                  {clientAddress}
                </Text>
              </View>
            </View>

            <View style={styles.metaColRight}>
              <Text style={styles.metaLabel}>DISPATCH TIME</Text>
              <Text style={styles.metaEtaText}>~{selectedService.etaMinutes} min arrival</Text>
            </View>
          </View>
        </View>

        {/* Matched Specialist Info Banner */}
        <View style={styles.specialistBanner}>
          <View style={styles.specialistAvatar}>
            <Text style={styles.specialistAvatarText}>M</Text>
          </View>
          <View style={styles.specialistTextCol}>
            <Text style={styles.specialistName}>Marat Zhakupov</Text>
            <Text style={styles.specialistSub}>
              Master Specialist · 4.9 ★ (127 jobs) · On duty in Yesil
            </Text>
          </View>
          <View style={styles.onlineBadge}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Nearby</Text>
          </View>
        </View>

        {/* Issue Details Input */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Describe the problem (optional)</Text>
          <TextInput
            style={styles.noteInput}
            value={description}
            onChangeText={setDescription}
            multiline
            placeholder="e.g. Water is dripping from the mixer under the sink..."
            placeholderTextColor={COLORS.mutedText}
          />
        </View>

        {/* Dashed Photo Upload Box */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Attach photo for master</Text>

          {!hasPhoto ? (
            <TouchableOpacity
              style={styles.dashedUploadBox}
              onPress={handleAddPhoto}
              activeOpacity={0.75}
            >
              <View style={styles.cameraCircle}>
                <Feather name="camera" size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.uploadTitle}>Tap to add photo</Text>
              <Text style={styles.uploadSub}>Helps technician bring exact replacement parts</Text>
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
                <Feather name="x" size={15} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Payment info note */}
        <View style={styles.paymentInfoBox}>
          <Ionicons name="card-outline" size={18} color={COLORS.secondaryText} style={{ marginRight: 8 }} />
          <Text style={styles.paymentInfoText}>
            Zero upfront fee. Pay fixed <Text style={{ fontWeight: '700', color: COLORS.ink }}>{formatKzt(selectedService.priceKzt)}</Text> via Kaspi QR only after the repair is completed.
          </Text>
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Pill Button */}
      <View style={styles.stickyFooter}>
        <TouchableOpacity
          style={styles.bookPillButton}
          onPress={handleBookRepair}
          activeOpacity={0.88}
        >
          <Text style={styles.bookPillButtonText}>
            Confirm & Dispatch Master · {formatKzt(selectedService.priceKzt)}
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
    paddingTop: Platform.OS === 'ios' ? 12 : 20,
    paddingBottom: 24,
  },
  topNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.ink,
  },
  summaryCard: {
    backgroundColor: '#F0F7FF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    marginBottom: 14,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: COLORS.primary,
    textTransform: 'uppercase',
  },
  guaranteePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  guaranteeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.emeraldDark,
  },
  summaryBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  serviceTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.ink,
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  serviceSubtitle: {
    fontSize: 13,
    color: COLORS.secondaryText,
    lineHeight: 18,
  },
  servicePrice: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.ink,
  },
  divider: {
    height: 1,
    backgroundColor: '#DBEAFE',
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaCol: {
    flex: 1,
    paddingRight: 8,
  },
  metaColRight: {
    alignItems: 'flex-end',
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.secondaryText,
    marginBottom: 3,
  },
  addressLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaValText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: COLORS.ink,
  },
  metaEtaText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.primary,
  },
  specialistBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 18,
  },
  specialistAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  specialistAvatarText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  specialistTextCol: {
    flex: 1,
  },
  specialistName: {
    fontSize: 14.5,
    fontWeight: '700',
    color: COLORS.ink,
    marginBottom: 2,
  },
  specialistSub: {
    fontSize: 11.5,
    color: COLORS.secondaryText,
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.emerald,
  },
  onlineText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.emeraldDark,
  },
  section: {
    marginBottom: 18,
  },
  sectionLabel: {
    fontSize: 13.5,
    fontWeight: '700',
    color: COLORS.ink,
    marginBottom: 8,
  },
  noteInput: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    minHeight: 88,
    fontSize: 14.5,
    color: COLORS.ink,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dashedUploadBox: {
    borderRadius: 18,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#BFDBFE',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  cameraCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.ink,
    marginBottom: 2,
  },
  uploadSub: {
    fontSize: 12,
    color: COLORS.secondaryText,
    textAlign: 'center',
  },
  photoPreviewWrap: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
  },
  removePhotoBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  paymentInfoText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.secondaryText,
    lineHeight: 17,
  },
  stickyFooter: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    backgroundColor: COLORS.background,
  },
  bookPillButton: {
    backgroundColor: COLORS.blackPill,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 4,
  },
  bookPillButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
