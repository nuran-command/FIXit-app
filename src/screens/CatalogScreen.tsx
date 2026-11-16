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
import { Feather, Ionicons } from '@expo/vector-icons';
import {
  ASTANA_ADDRESSES,
  COLORS,
  FIXED_SERVICES,
  ServiceCategory,
  ServiceItem,
  formatKzt,
} from '../data/mockData';
import { useOrder } from '../context/OrderContext';
import { ClientProfileModal } from '../components/ClientProfileModal';
import { FloatingBottomNav, BottomNavTab } from '../components/FloatingBottomNav';

const CATEGORIES: { key: ServiceCategory; icon: keyof typeof Feather.glyphMap; label: string }[] = [
  { key: 'All', icon: 'grid', label: 'All' },
  { key: 'Plumbing', icon: 'droplet', label: 'Plumbing' },
  { key: 'Electrical', icon: 'zap', label: 'Electrical' },
  { key: 'Appliances', icon: 'tool', label: 'Appliances' },
];

export const CatalogScreen: React.FC = () => {
  const {
    clientProfile,
    clientAddress,
    setClientAddress,
    selectServiceForBooking,
    activeOrder,
    navigateToStep,
    showToast,
  } = useOrder();

  const [activeTab, setActiveTab] = useState<BottomNavTab>('Home');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [addressModalVisible, setAddressModalVisible] = useState<boolean>(false);
  const [profileModalVisible, setProfileModalVisible] = useState<boolean>(false);
  const [customAddressInput, setCustomAddressInput] = useState<string>('');
  const [isLikedFeatured, setIsLikedFeatured] = useState<boolean>(false);

  const featuredService = FIXED_SERVICES[0]; // Kitchen Faucet Leak

  const filteredServices = useMemo(() => {
    return FIXED_SERVICES.filter((srv) => {
      const matchesCategory =
        selectedCategory === 'All' || srv.category === selectedCategory;
      const matchesSearch =
        srv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        srv.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

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

  const handleBottomTabPress = (tab: BottomNavTab) => {
    setActiveTab(tab);
    if (tab === 'Home') {
      // scroll to top or stay
    } else if (tab === 'Explore') {
      setSelectedCategory('All');
    } else if (tab === 'Custom') {
      navigateToStep('CUSTOM_REQUEST');
    } else if (tab === 'Orders') {
      if (activeOrder) {
        navigateToStep(
          activeOrder.status === 'COMPLETED_UNPAID' || activeOrder.status === 'PAID'
            ? 'PAYMENT'
            : 'TRACKING'
        );
      } else {
        showToast('No active orders right now');
      }
    } else if (tab === 'Profile') {
      setProfileModalVisible(true);
    }
  };

  return (
    <View style={styles.flex}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header Row (Matches Reference Center Screen) */}
        <View style={styles.topHeader}>
          <View style={styles.headerUserCol}>
            <Text style={styles.greetingTitle}>Hi, {clientProfile.name}</Text>
            <TouchableOpacity
              style={styles.addressDropdownTrigger}
              onPress={handleOpenAddressModal}
              activeOpacity={0.75}
            >
              <Feather name="map-pin" size={13} color={COLORS.primary} style={{ marginRight: 4 }} />
              <Text style={styles.addressSubtitle} numberOfLines={1}>
                {clientAddress}
              </Text>
              <Feather name="chevron-down" size={14} color={COLORS.secondaryText} style={{ marginLeft: 2 }} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.profileAvatarButton}
            onPress={() => setProfileModalVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.avatarLetter}>{clientProfile.name.charAt(0)}</Text>
          </TouchableOpacity>
        </View>

        {/* Modern Rounded Search Bar */}
        <View style={styles.searchBar}>
          <Feather name="search" size={18} color={COLORS.secondaryText} style={{ marginRight: 10 }} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search plumbing, wiring, leaks..."
            placeholderTextColor={COLORS.mutedText}
          />
          {searchQuery.length > 0 ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x" size={16} color={COLORS.secondaryText} />
            </TouchableOpacity>
          ) : (
            <View style={styles.searchFilterBadge}>
              <Feather name="sliders" size={14} color={COLORS.ink} />
            </View>
          )}
        </View>

        {/* Active In-Progress Strip if order exists */}
        {activeOrder && (
          <TouchableOpacity
            style={styles.activeStrip}
            onPress={() =>
              navigateToStep(
                activeOrder.status === 'COMPLETED_UNPAID' || activeOrder.status === 'PAID'
                  ? 'PAYMENT'
                  : 'TRACKING'
              )
            }
            activeOpacity={0.88}
          >
            <View style={styles.activeStripLeft}>
              <View style={styles.livePulseDot} />
              <View>
                <Text style={styles.activeStripTitle}>
                  {activeOrder.service.title} · {activeOrder.status === 'EN_ROUTE' ? 'En Route' : 'In Progress'}
                </Text>
                <Text style={styles.activeStripSub}>
                  Technician Marat (4.9★) · ETA {activeOrder.etaMinutes} min
                </Text>
              </View>
            </View>
            <View style={styles.trackPill}>
              <Text style={styles.trackPillText}>Track →</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Horizontal Category Pills (Reference Center Screen style) */}
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
                style={[styles.categoryPill, active && styles.categoryPillActive]}
                onPress={() => setSelectedCategory(cat.key)}
                activeOpacity={0.8}
              >
                <Feather
                  name={cat.icon}
                  size={14}
                  color={active ? COLORS.white : COLORS.secondaryText}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.categoryPillText, active && styles.categoryPillTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* SECTION 1: Featured Hero Card (Matches Reference Center Card) */}
        {selectedCategory === 'All' && searchQuery.trim() === '' && (
          <View style={styles.featuredSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeading}>Featured Service</Text>
              <TouchableOpacity onPress={() => setSelectedCategory('Plumbing')}>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>

            {/* Large Elevated Card in Royal Blue Theme */}
            <View style={styles.heroCard}>
              {/* Card Top: Title & Like Button */}
              <View style={styles.heroCardTop}>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <View style={styles.heroTagBadge}>
                    <Text style={styles.heroTagText}>MOST BOOKED IN YESIL</Text>
                  </View>
                  <Text style={styles.heroCardTitle}>{featuredService.title}</Text>
                  <Text style={styles.heroCardSub}>{featuredService.subtitle}</Text>
                </View>

                <TouchableOpacity
                  style={styles.heartButton}
                  onPress={() => setIsLikedFeatured(!isLikedFeatured)}
                  activeOpacity={0.75}
                >
                  <Ionicons
                    name={isLikedFeatured ? 'heart' : 'heart-outline'}
                    size={20}
                    color={isLikedFeatured ? COLORS.kaspiRed : COLORS.ink}
                  />
                </TouchableOpacity>
              </View>

              {/* Graphic Visual Box (Central Artwork) */}
              <View style={styles.heroArtBox}>
                <View style={styles.artCircleGlow}>
                  <Feather name="droplet" size={44} color={COLORS.primary} />
                </View>
                <View style={styles.artBadgeWrench}>
                  <Feather name="tool" size={18} color={COLORS.white} />
                </View>
                <View style={styles.artWarrantyChip}>
                  <Feather name="shield" size={12} color={COLORS.emerald} />
                  <Text style={styles.artWarrantyText}>90-day FixIt Guarantee</Text>
                </View>
              </View>

              {/* Card Bottom: Price & Black Pill Action Button */}
              <View style={styles.heroCardBottom}>
                <View>
                  <Text style={styles.heroPriceLabel}>Fixed Rate</Text>
                  <Text style={styles.heroPriceText}>{formatKzt(featuredService.priceKzt)}</Text>
                </View>

                <TouchableOpacity
                  style={styles.heroBookPill}
                  onPress={() => selectServiceForBooking(featuredService)}
                  activeOpacity={0.88}
                >
                  <Text style={styles.heroBookPillText}>Book in &lt;15m</Text>
                  <Feather name="arrow-right" size={15} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* SECTION 2: Popular Services Carousel / Grid */}
        <View style={styles.popularSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeading}>
              {selectedCategory === 'All' ? 'Popular Services' : `${selectedCategory} Services`}
            </Text>
            <Text style={styles.countBadge}>{filteredServices.length} fixed rates</Text>
          </View>

          {/* Service Cards (Styled like Screen 3 in Reference) */}
          <View style={styles.cardsGrid}>
            {filteredServices.map((srv: ServiceItem) => {
              const isUrgent = srv.category === 'Plumbing' && srv.priceKzt > 12000;
              return (
                <View key={srv.id} style={styles.collectionCard}>
                  <View style={styles.collectionCardTop}>
                    <View style={styles.collectionCategoryBadge}>
                      <Text style={styles.collectionCategoryText}>{srv.category}</Text>
                    </View>
                    {isUrgent && (
                      <View style={styles.urgentBadge}>
                        <Text style={styles.urgentBadgeText}>24/7 Rapid</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.collectionBodyRow}>
                    <View style={styles.collectionTextCol}>
                      <Text style={styles.collectionTitle}>{srv.title}</Text>
                      <Text style={styles.collectionSubtitle} numberOfLines={2}>
                        {srv.subtitle}
                      </Text>
                    </View>

                    <View style={styles.serviceIconBubble}>
                      <Feather
                        name={
                          srv.category === 'Plumbing'
                            ? 'droplet'
                            : srv.category === 'Electrical'
                            ? 'zap'
                            : 'tool'
                        }
                        size={22}
                        color={COLORS.primary}
                      />
                    </View>
                  </View>

                  <View style={styles.collectionFooter}>
                    <View>
                      <Text style={styles.collectionPriceLabel}>Guaranteed Price</Text>
                      <Text style={styles.collectionPrice}>{formatKzt(srv.priceKzt)}</Text>
                    </View>

                    <TouchableOpacity
                      style={styles.bookMiniPill}
                      onPress={() => selectServiceForBooking(srv)}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.bookMiniPillText}>Book</Text>
                      <Feather name="plus" size={15} color={COLORS.white} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* SECTION 3: Custom Problem Banner ("Can't find your issue? Name your price") */}
        <TouchableOpacity
          style={styles.customBanner}
          onPress={() => navigateToStep('CUSTOM_REQUEST')}
          activeOpacity={0.88}
        >
          <View style={styles.customBannerLeft}>
            <View style={styles.customPlusCircle}>
              <Feather name="plus" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.customTextCol}>
              <Text style={styles.customBannerTitle}>Can't find your exact issue?</Text>
              <Text style={styles.customBannerSub}>
                Describe your problem & set your own budget in KZT
              </Text>
            </View>
          </View>
          <View style={styles.customArrowPill}>
            <Feather name="arrow-right" size={16} color={COLORS.white} />
          </View>
        </TouchableOpacity>

        {/* Bottom space so floating nav doesn't cover content */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Bottom Navigation Bar (Pixel-perfect recreation of Reference design) */}
      <FloatingBottomNav
        activeTab={activeTab}
        onTabPress={handleBottomTabPress}
        hasActiveOrder={Boolean(activeOrder)}
      />

      {/* Client Profile Modal */}
      <ClientProfileModal
        visible={profileModalVisible}
        onClose={() => setProfileModalVisible(false)}
        onOpenAddressSelector={() => setAddressModalVisible(true)}
      />

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
              <Text style={styles.sheetTitle}>Select Address in Astana</Text>
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

            <Text style={styles.savedLabel}>Saved locations</Text>
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
                      color={isSelected ? COLORS.primary : COLORS.secondaryText}
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
                  {isSelected && <Feather name="check" size={16} color={COLORS.primary} />}
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
    paddingTop: Platform.OS === 'ios' ? 12 : 20,
    paddingBottom: 20,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerUserCol: {
    flex: 1,
  },
  greetingTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.ink,
    letterSpacing: -0.5,
  },
  addressDropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  addressSubtitle: {
    fontSize: 13,
    color: COLORS.secondaryText,
    fontWeight: '500',
    maxWidth: 220,
  },
  profileAvatarButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.primary,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14.5,
    color: COLORS.ink,
    fontWeight: '500',
  },
  searchFilterBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EFF6FF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  activeStripLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  livePulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  activeStripTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.ink,
  },
  activeStripSub: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 1,
  },
  trackPill: {
    backgroundColor: COLORS.blackPill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  trackPillText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  categoryScrollView: {
    marginHorizontal: -20,
    marginBottom: 20,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryPillActive: {
    backgroundColor: COLORS.blackPill,
    borderColor: COLORS.blackPill,
  },
  categoryPillText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: COLORS.secondaryText,
  },
  categoryPillTextActive: {
    color: COLORS.white,
  },
  featuredSection: {
    marginBottom: 26,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.ink,
    letterSpacing: -0.3,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  countBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.secondaryText,
  },
  heroCard: {
    backgroundColor: '#F0F7FF',
    borderRadius: 26,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 4,
  },
  heroCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  heroTagBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  heroTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.4,
  },
  heroCardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.ink,
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  heroCardSub: {
    fontSize: 13,
    color: COLORS.secondaryText,
    lineHeight: 18,
  },
  heartButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  heroArtBox: {
    height: 110,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  artCircleGlow: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  artBadgeWrench: {
    position: 'absolute',
    top: 14,
    right: 28,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  artWarrantyChip: {
    position: 'absolute',
    bottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  artWarrantyText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.emeraldDark,
  },
  heroCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  heroPriceLabel: {
    fontSize: 11,
    color: COLORS.secondaryText,
    fontWeight: '600',
  },
  heroPriceText: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.ink,
  },
  heroBookPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.blackPill,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 3,
  },
  heroBookPillText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  popularSection: {
    marginBottom: 20,
  },
  cardsGrid: {
    gap: 12,
  },
  collectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  collectionCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  collectionCategoryBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  collectionCategoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
  },
  urgentBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  urgentBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#DC2626',
  },
  collectionBodyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  collectionTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  collectionTitle: {
    fontSize: 16.5,
    fontWeight: '700',
    color: COLORS.ink,
    marginBottom: 4,
  },
  collectionSubtitle: {
    fontSize: 13,
    color: COLORS.secondaryText,
    lineHeight: 18,
  },
  serviceIconBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  collectionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  collectionPriceLabel: {
    fontSize: 10.5,
    color: COLORS.secondaryText,
    fontWeight: '500',
  },
  collectionPrice: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.ink,
  },
  bookMiniPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.blackPill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    gap: 4,
  },
  bookMiniPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.white,
  },
  customBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    marginTop: 6,
  },
  customBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 8,
  },
  customPlusCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  customTextCol: {
    flex: 1,
  },
  customBannerTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: COLORS.ink,
    marginBottom: 2,
  },
  customBannerSub: {
    fontSize: 12.5,
    color: COLORS.secondaryText,
  },
  customArrowPill: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  backdropTouch: {
    flex: 1,
  },
  addressSheet: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
  },
  sheetHandle: {
    width: 38,
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
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
    fontSize: 14.5,
    color: COLORS.ink,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  saveAddressBtn: {
    backgroundColor: COLORS.blackPill,
    borderRadius: 14,
    paddingHorizontal: 18,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveAddressText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  savedLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.secondaryText,
    marginBottom: 8,
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
    fontWeight: '700',
  },
});
