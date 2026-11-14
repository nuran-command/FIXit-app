import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  ASTANA_ADDRESSES,
  COLORS,
  FIXED_SERVICES,
  ServiceCategory,
  ServiceItem,
  formatKzt,
} from '../data/mockData';
import { useOrder } from '../context/OrderContext';
import { RoleTogglePill } from '../components/RoleTogglePill';

const CATEGORIES: { key: ServiceCategory; icon: keyof typeof Feather.glyphMap }[] = [
  { key: 'All', icon: 'grid' },
  { key: 'Plumbing', icon: 'droplet' },
  { key: 'Electrical', icon: 'zap' },
  { key: 'Appliances', icon: 'tool' },
];

export const CatalogScreen: React.FC = () => {
  const {
    clientAddress,
    setClientAddress,
    selectServiceForBooking,
    activeOrder,
    navigateToStep,
  } = useOrder();

  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('All');
  const [addressModalVisible, setAddressModalVisible] = useState<boolean>(false);
  const [customAddressInput, setCustomAddressInput] = useState<string>('');

  const filteredServices = useMemo(() => {
    if (selectedCategory === 'All') return FIXED_SERVICES;
    return FIXED_SERVICES.filter((srv) => srv.category === selectedCategory);
  }, [selectedCategory]);

  const handleOpenAddressModal = () => {
    setCustomAddressInput(clientAddress);
    setAddressModalVisible(true);
  };

  const handleSaveCustomAddress = () => {
    const trimmed = customAddressInput.trim();
    if (trimmed.length > 0) {
      setClientAddress(trimmed);
    }
    setAddressModalVisible(false);
  };

  return (
    <View style={styles.flex}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Minimal Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.addressButton}
            onPress={handleOpenAddressModal}
            activeOpacity={0.75}
          >
            <Feather name="map-pin" size={14} color={COLORS.ink} style={styles.pinIcon} />
            <Text style={styles.addressText} numberOfLines={1}>
              {clientAddress}
            </Text>
            <Feather name="chevron-down" size={15} color={COLORS.secondaryText} />
          </TouchableOpacity>

          <RoleTogglePill />
        </View>

        {/* Active Order Strip if an order is currently in progress */}
        {activeOrder && (
          <TouchableOpacity
            style={styles.activeStrip}
            onPress={() =>
              navigateToStep(
                activeOrder.status === 'EN_ROUTE' || activeOrder.status === 'ARRIVED'
                  ? 'TRACKING'
                  : activeOrder.status === 'COMPLETED_UNPAID' || activeOrder.status === 'PAID'
                  ? 'PAYMENT'
                  : 'TRACKING'
              )
            }
            activeOpacity={0.85}
          >
            <View style={styles.activeStripLeft}>
              <View style={styles.liveDot} />
              <Text style={styles.activeStripText} numberOfLines={1}>
                {activeOrder.service.title} · In progress
              </Text>
            </View>
            <Feather name="chevron-right" size={18} color={COLORS.white} />
          </TouchableOpacity>
        )}

        {/* Greeting */}
        <Text style={styles.greeting}>What do you need fixed?</Text>

        {/* Horizontal Category Tabs (edge-to-edge padding so last pill never clips) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScrollView}
          contentContainerStyle={styles.categoryRow}
        >
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.key;
            return (
              <TouchableOpacity
                key={cat.key}
                style={[styles.categoryTab, active && styles.categoryTabActive]}
                onPress={() => setSelectedCategory(cat.key)}
                activeOpacity={0.8}
              >
                <Feather
                  name={cat.icon}
                  size={14}
                  color={active ? COLORS.white : COLORS.secondaryText}
                  style={styles.categoryIcon}
                />
                <Text style={[styles.categoryText, active && styles.categoryTextActive]}>
                  {cat.key}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Borderless Service List */}
        <View style={styles.serviceList}>
          {filteredServices.map((srv: ServiceItem) => (
            <TouchableOpacity
              key={srv.id}
              style={[styles.serviceRow, styles.serviceRowDivider]}
              onPress={() => selectServiceForBooking(srv)}
              activeOpacity={0.65}
            >
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceTitle}>{srv.title}</Text>
                <Text style={styles.serviceSubtitle} numberOfLines={2}>
                  {srv.subtitle}
                </Text>
              </View>

              <View style={styles.priceCol}>
                <Text style={styles.servicePrice}>{formatKzt(srv.priceKzt)}</Text>
                <Feather name="chevron-right" size={16} color={COLORS.mutedText} />
              </View>
            </TouchableOpacity>
          ))}

          {/* Custom Request Row */}
          <TouchableOpacity
            style={styles.customRow}
            onPress={() => navigateToStep('CUSTOM_REQUEST')}
            activeOpacity={0.7}
          >
            <View style={styles.customIconBox}>
              <Feather name="plus" size={18} color={COLORS.ink} />
            </View>
            <View style={styles.customTextCol}>
              <Text style={styles.customTitle}>Can't find your issue?</Text>
              <Text style={styles.customSub}>Create custom request with your own price</Text>
            </View>
            <Feather name="chevron-right" size={16} color={COLORS.mutedText} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Sheet Modal: Service Address */}
      <Modal
        visible={addressModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAddressModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalBackdrop}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <TouchableOpacity
            style={styles.backdropTouch}
            activeOpacity={1}
            onPress={() => setAddressModalVisible(false)}
          />
          <View style={styles.addressSheet}>
            <View style={styles.sheetHandle} />

            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Service Address</Text>
              <TouchableOpacity
                onPress={() => setAddressModalVisible(false)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Feather name="x" size={20} color={COLORS.secondaryText} />
              </TouchableOpacity>
            </View>

            <View style={styles.addressInputRow}>
              <TextInput
                style={styles.addressInput}
                value={customAddressInput}
                onChangeText={setCustomAddressInput}
                placeholder="Street, building, apartment in Astana"
                placeholderTextColor={COLORS.mutedText}
                returnKeyType="done"
                onSubmitEditing={handleSaveCustomAddress}
              />
              <TouchableOpacity
                style={styles.saveAddressBtn}
                onPress={handleSaveCustomAddress}
                activeOpacity={0.85}
              >
                <Text style={styles.saveAddressText}>Save</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.savedLabel}>Saved addresses</Text>
            {ASTANA_ADDRESSES.map((addr, idx) => {
              const isSelected = addr === clientAddress;
              const isLast = idx === ASTANA_ADDRESSES.length - 1;
              return (
                <TouchableOpacity
                  key={addr}
                  style={[styles.savedRow, !isLast && styles.savedRowDivider]}
                  onPress={() => {
                    setClientAddress(addr);
                    setAddressModalVisible(false);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.savedRowLeft}>
                    <Feather
                      name="map-pin"
                      size={15}
                      color={isSelected ? COLORS.ink : COLORS.secondaryText}
                    />
                    <Text
                      style={[
                        styles.savedRowText,
                        isSelected && styles.savedRowTextSelected,
                      ]}
                    >
                      {addr}
                    </Text>
                  </View>
                  {isSelected && <Feather name="check" size={16} color={COLORS.ink} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
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
    paddingBottom: 36,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  addressButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  pinIcon: {
    marginRight: 6,
  },
  addressText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.ink,
    marginRight: 4,
    flexShrink: 1,
  },
  activeStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 20,
  },
  activeStripLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.emerald,
    marginRight: 10,
  },
  activeStripText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.ink,
    letterSpacing: -0.6,
    marginBottom: 18,
  },
  categoryScrollView: {
    marginHorizontal: -20,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 18,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
  },
  categoryTabActive: {
    backgroundColor: COLORS.primary,
  },
  categoryIcon: {
    marginRight: 6,
  },
  categoryText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: COLORS.secondaryText,
  },
  categoryTextActive: {
    color: COLORS.white,
  },
  serviceList: {
    marginTop: 4,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
  },
  serviceRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  serviceInfo: {
    flex: 1,
    paddingRight: 14,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.ink,
    marginBottom: 4,
  },
  serviceSubtitle: {
    fontSize: 13,
    color: COLORS.secondaryText,
    lineHeight: 18,
  },
  priceCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.ink,
  },
  customRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    gap: 12,
  },
  customIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customTextCol: {
    flex: 1,
  },
  customTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.ink,
    marginBottom: 2,
  },
  customSub: {
    fontSize: 13,
    color: COLORS.secondaryText,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
  },
  backdropTouch: {
    flex: 1,
  },
  addressSheet: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 34,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.divider,
    alignSelf: 'center',
    marginBottom: 14,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.ink,
  },
  addressInputRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  addressInput: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 14.5,
    color: COLORS.ink,
  },
  saveAddressBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 18,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveAddressText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  savedLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.secondaryText,
    marginBottom: 6,
  },
  savedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  savedRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  savedRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  savedRowText: {
    fontSize: 15,
    color: COLORS.secondaryText,
    fontWeight: '500',
  },
  savedRowTextSelected: {
    color: COLORS.ink,
    fontWeight: '600',
  },
});
