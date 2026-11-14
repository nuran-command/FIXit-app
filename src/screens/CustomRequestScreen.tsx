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
import { COLORS, CustomCategory, formatKzt } from '../data/mockData';
import { useOrder } from '../context/OrderContext';
import { SampleLeakPhotoCard } from '../components/SampleLeakPhotoCard';

const CUSTOM_CATEGORIES: CustomCategory[] = ['Plumbing', 'Electrical', 'Appliances', 'Other'];
const QUICK_PRICES = [8000, 10000, 15000];

export const CustomRequestScreen: React.FC = () => {
  const { clientAddress, createAndDispatchOrder, navigateToStep } = useOrder();

  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<CustomCategory>('Plumbing');
  const [priceText, setPriceText] = useState<string>('12000');
  const [description, setDescription] = useState<string>('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [hasPhoto, setHasPhoto] = useState<boolean>(false);

  const numericPrice = Math.max(1000, parseInt(priceText.replace(/[^0-9]/g, ''), 10) || 12000);

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

  const handlePostRequest = () => {
    const cleanTitle = title.trim() || 'Water heater leaking';
    createAndDispatchOrder({
      description: description.trim() || cleanTitle,
      photoUri,
      usedSamplePhoto: hasPhoto && !photoUri,
      customService: {
        id: `custom-${Date.now()}`,
        title: cleanTitle,
        category,
        priceKzt: numericPrice,
        etaMinutes: 15,
        subtitle: `Custom ${category.toLowerCase()} request`,
      },
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigateToStep('HOME')}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={22} color={COLORS.ink} />
        </TouchableOpacity>

        <Text style={styles.screenTitle}>Describe Your Problem</Text>
        <View style={styles.addressRow}>
          <Feather name="map-pin" size={14} color={COLORS.secondaryText} />
          <Text style={styles.addressText}>{clientAddress}</Text>
        </View>

        <View style={styles.divider} />

        {/* Problem Title */}
        <View style={styles.section}>
          <Text style={styles.label}>Problem Title</Text>
          <TextInput
            style={styles.textInput}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g., Bathroom pipe dripping behind wall"
            placeholderTextColor={COLORS.mutedText}
          />
        </View>

        {/* Category Selector */}
        <View style={styles.section}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.chipsRow}>
            {CUSTOM_CATEGORIES.map((cat) => {
              const active = category === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => setCategory(cat)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Your Offered Price (₸) */}
        <View style={styles.section}>
          <Text style={styles.label}>Your Offered Price (₸)</Text>
          <View style={styles.priceInputWrap}>
            <TextInput
              style={styles.priceInput}
              value={priceText}
              onChangeText={(val) => setPriceText(val.replace(/[^0-9]/g, ''))}
              keyboardType="number-pad"
              placeholder="12000"
              placeholderTextColor={COLORS.mutedText}
            />
            <Text style={styles.currencySuffix}>₸</Text>
          </View>

          <View style={styles.chipsRow}>
            {QUICK_PRICES.map((amount) => {
              const isMatch = numericPrice === amount;
              return (
                <TouchableOpacity
                  key={amount}
                  style={[styles.chip, isMatch && styles.chipActive]}
                  onPress={() => setPriceText(String(amount))}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.chipText, isMatch && styles.chipTextActive]}>
                    {formatKzt(amount)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Issue Details */}
        <View style={styles.section}>
          <Text style={styles.label}>Issue Details</Text>
          <TextInput
            style={styles.noteInput}
            value={description}
            onChangeText={setDescription}
            multiline
            placeholder="Add any helpful details for the specialist..."
            placeholderTextColor={COLORS.mutedText}
          />
        </View>

        {/* Optional Photo */}
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

      <View style={styles.stickyFooter}>
        <TouchableOpacity
          style={styles.postButton}
          onPress={handlePostRequest}
          activeOpacity={0.88}
        >
          <Text style={styles.postButtonText}>
            Post Request · {formatKzt(numericPrice)}
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
    marginBottom: 12,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.ink,
    letterSpacing: -0.4,
    marginBottom: 8,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 18,
  },
  addressText: {
    fontSize: 14,
    color: COLORS.secondaryText,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.ink,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    fontSize: 15,
    color: COLORS.ink,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
  },
  chipText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: COLORS.secondaryText,
  },
  chipTextActive: {
    color: COLORS.white,
  },
  priceInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
    marginBottom: 10,
  },
  priceInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.ink,
  },
  currencySuffix: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.secondaryText,
    marginLeft: 8,
  },
  noteInput: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    minHeight: 88,
    fontSize: 15,
    color: COLORS.ink,
    textAlignVertical: 'top',
  },
  dashedUploadBox: {
    height: 104,
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
  postButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

