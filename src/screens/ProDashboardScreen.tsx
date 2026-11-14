import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS, formatKzt } from '../data/mockData';
import { useOrder } from '../context/OrderContext';
import { RoleTogglePill } from '../components/RoleTogglePill';

export const ProDashboardScreen: React.FC = () => {
  const {
    proProfile,
    activeOrder,
    acceptIncomingJob,
    declineIncomingJob,
    completeOrderToPayment,
    switchRole,
  } = useOrder();

  const isDispatching = activeOrder?.status === 'DISPATCHING';
  const isInProgress =
    activeOrder?.status === 'EN_ROUTE' || activeOrder?.status === 'ARRIVED';

  return (
    <View style={styles.container}>
      {/* Minimal Status Header */}
      <View style={styles.header}>
        <View style={styles.statusLeft}>
          <View style={styles.onlineDot} />
          <Text style={styles.proName}>{proProfile.name} · Online</Text>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={13} color={COLORS.ink} />
            <Text style={styles.ratingText}>{proProfile.rating}</Text>
          </View>
        </View>

        <RoleTogglePill />
      </View>

      {/* Clean Open Canvas */}
      <View style={styles.centerArea}>
        <View style={styles.radarCircle}>
          <Feather name="navigation" size={26} color={COLORS.ink} />
        </View>
        <Text style={styles.centerTitle}>
          {isDispatching
            ? 'Incoming job nearby'
            : isInProgress
            ? 'Job in progress'
            : 'Looking for requests'}
        </Text>
        <Text style={styles.centerSub}>
          {proProfile.title} · {proProfile.verifiedJobs} completed jobs
        </Text>
      </View>

      {/* Uber-style Incoming Request Card at Bottom */}
      {isDispatching && activeOrder && (
        <View style={styles.requestSheet}>
          <Text style={styles.requestMeta}>New Request · 1.4 km away</Text>
          <Text style={styles.requestTitle}>
            {activeOrder.service.title} — {formatKzt(activeOrder.service.priceKzt)}
          </Text>
          <View style={styles.addressRow}>
            <Feather name="map-pin" size={14} color={COLORS.secondaryText} />
            <Text style={styles.requestAddress}>{activeOrder.address}</Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.declineBtn}
              onPress={declineIncomingJob}
              activeOpacity={0.8}
            >
              <Text style={styles.declineText}>Decline</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.acceptBtn}
              onPress={acceptIncomingJob}
              activeOpacity={0.88}
            >
              <Text style={styles.acceptText}>Accept Job</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Active In-Progress Job Sheet */}
      {isInProgress && activeOrder && (
        <View style={styles.requestSheet}>
          <Text style={styles.requestMeta}>
            Active Job · {activeOrder.distanceKm.toFixed(1)} km to client
          </Text>
          <Text style={styles.requestTitle}>
            {activeOrder.service.title} — {formatKzt(activeOrder.service.priceKzt)}
          </Text>
          <View style={styles.addressRow}>
            <Feather name="map-pin" size={14} color={COLORS.secondaryText} />
            <Text style={styles.requestAddress}>{activeOrder.address}</Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.declineBtn}
              onPress={() => switchRole('CLIENT')}
              activeOpacity={0.8}
            >
              <Text style={styles.declineText}>Client View</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.acceptBtn}
              onPress={completeOrderToPayment}
              activeOpacity={0.88}
            >
              <Text style={styles.acceptText}>Complete Job</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.emerald,
  },
  proName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.ink,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.ink,
  },
  centerArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  radarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  centerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.ink,
    marginBottom: 6,
  },
  centerSub: {
    fontSize: 14,
    color: COLORS.secondaryText,
  },
  requestSheet: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
  },
  requestMeta: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.emerald,
    marginBottom: 6,
  },
  requestTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.ink,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  requestAddress: {
    fontSize: 14,
    color: COLORS.secondaryText,
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  declineBtn: {
    flex: 1,
    backgroundColor: COLORS.divider,
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.ink,
  },
  acceptBtn: {
    flex: 1.5,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
  },
});
