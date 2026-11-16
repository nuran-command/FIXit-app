import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS, FIXED_SERVICES, formatKzt } from '../data/mockData';
import { useOrder } from '../context/OrderContext';
import { SimulatedAstanaMap } from '../components/SimulatedAstanaMap';
import { ClientProfileModal } from '../components/ClientProfileModal';

export const TrackingScreen: React.FC = () => {
  const {
    clientProfile,
    activeOrder,
    proProfile,
    completeOrderToPayment,
    navigateToStep,
    showToast,
  } = useOrder();

  const [profileModalVisible, setProfileModalVisible] = useState<boolean>(false);

  const service = activeOrder?.service || FIXED_SERVICES[0];
  const etaMinutes = activeOrder ? activeOrder.etaMinutes : 5;
  const routeProgress = activeOrder ? activeOrder.routeProgress : 0.2;
  const isArrived =
    activeOrder?.status === 'ARRIVED' || etaMinutes === 0 || routeProgress >= 1;

  return (
    <View style={styles.container}>
      {/* Top 60% Full-Bleed Clean Map Canvas */}
      <View style={styles.mapSection}>
        <SimulatedAstanaMap routeProgress={routeProgress} />

        {/* Minimal Floating Controls over Map */}
        <View style={styles.mapOverlayTop}>
          <TouchableOpacity
            style={styles.circleIconBtn}
            onPress={() => navigateToStep('HOME')}
            activeOpacity={0.8}
          >
            <Feather name="arrow-left" size={18} color={COLORS.ink} />
          </TouchableOpacity>

          {/* Profile Avatar Button */}
          <TouchableOpacity
            style={styles.profileAvatarBtn}
            onPress={() => setProfileModalVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.profileAvatarLetter}>{clientProfile.name.charAt(0)}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Clean Bottom Sheet */}
      <View style={styles.bottomSheet}>
        <View style={styles.handleBar} />

        <View style={styles.headlineRow}>
          <View style={styles.headlineCol}>
            <Text style={styles.headline}>
              {isArrived ? `${proProfile.name} has arrived` : `${proProfile.name} is on the way`}
            </Text>
            <Text style={styles.etaSub}>
              {isArrived
                ? `${service.title} · ${formatKzt(service.priceKzt)}`
                : `Arriving in ${etaMinutes} min · ${service.title}`}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Compact Technician Row */}
        <View style={styles.techRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{proProfile.name.charAt(0)}</Text>
          </View>

          <View style={styles.techInfo}>
            <View style={styles.nameRatingRow}>
              <Text style={styles.techName}>
                {proProfile.name} · {proProfile.title}
              </Text>
            </View>
            <View style={styles.subMetaRow}>
              <Ionicons name="star" size={12} color={COLORS.ink} />
              <Text style={styles.techMeta}>
                {' '}
                {proProfile.rating} · {proProfile.vehicleInfo}
              </Text>
            </View>
          </View>

          {/* Circular Call & Message Buttons */}
          <View style={styles.actionIcons}>
            <TouchableOpacity
              style={styles.actionCircle}
              onPress={() => showToast(`Calling ${proProfile.name} (${proProfile.phone})...`)}
              activeOpacity={0.75}
            >
              <Feather name="phone" size={17} color={COLORS.ink} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCircle}
              onPress={() => showToast(`Message sent to ${proProfile.name}`)}
              activeOpacity={0.75}
            >
              <Feather name="message-circle" size={17} color={COLORS.ink} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Subtle Complete Order Action Button */}
        <TouchableOpacity
          style={[styles.completeButton, !isArrived && styles.completeButtonSubtle]}
          onPress={completeOrderToPayment}
          activeOpacity={0.85}
        >
          <Text
            style={[
              styles.completeButtonText,
              !isArrived && styles.completeButtonTextSubtle,
            ]}
          >
            Complete Order
          </Text>
        </TouchableOpacity>
      </View>

      {/* Client Profile Modal */}
      <ClientProfileModal
        visible={profileModalVisible}
        onClose={() => setProfileModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  mapSection: {
    flex: 0.6,
    position: 'relative',
  },
  mapOverlayTop: {
    position: 'absolute',
    top: 12,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  circleIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  profileAvatarBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  profileAvatarLetter: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.ink,
  },
  bottomSheet: {
    flex: 0.4,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -18,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 6,
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.divider,
    alignSelf: 'center',
    marginBottom: 8,
  },
  headlineRow: {
    marginBottom: 4,
  },
  headlineCol: {
    gap: 4,
  },
  headline: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.ink,
    letterSpacing: -0.4,
  },
  etaSub: {
    fontSize: 14,
    color: COLORS.secondaryText,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
  },
  techRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  techInfo: {
    flex: 1,
    paddingRight: 8,
  },
  nameRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  techName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.ink,
    marginBottom: 3,
  },
  subMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  techMeta: {
    fontSize: 13,
    color: COLORS.secondaryText,
    fontWeight: '500',
  },
  actionIcons: {
    flexDirection: 'row',
    gap: 10,
  },
  actionCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeButton: {
    backgroundColor: COLORS.blackPill,
    borderRadius: 999,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeButtonSubtle: {
    backgroundColor: COLORS.surface,
  },
  completeButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
  completeButtonTextSubtle: {
    color: COLORS.secondaryText,
  },
});
