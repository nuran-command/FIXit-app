import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';
import { COLORS, FIXED_SERVICES, formatKzt } from '../data/mockData';
import { useOrder } from '../context/OrderContext';

const QR_MATRIX: number[][] = [
  [1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1],
  [0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0],
  [1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1],
  [0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0],
  [1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1],
  [1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1],
];

export const KaspiCheckoutScreen: React.FC = () => {
  const {
    activeOrder,
    proProfile,
    confirmKaspiPayment,
    navigateToStep,
  } = useOrder();

  const service = activeOrder?.service || FIXED_SERVICES[0];
  const orderId = activeOrder?.orderId || '#FX-2048';
  const isPaid = activeOrder?.status === 'PAID' || activeOrder?.status === 'REVIEWED';

  const scaleAnim = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    if (isPaid) {
      scaleAnim.setValue(0.7);
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 100,
        useNativeDriver: true,
      }).start();
    }
  }, [isPaid, scaleAnim]);

  if (!isPaid) {
    return (
      <View style={styles.container}>
        <View style={styles.paymentWrapper}>
          {/* Clean Kaspi-inspired Payment Card */}
          <View style={styles.kaspiCard}>
            <View style={styles.kaspiHeader}>
              <Text style={styles.kaspiHeaderTitle}>Kaspi QR</Text>
              <Text style={styles.kaspiHeaderOrder}>{orderId}</Text>
            </View>

            <View style={styles.qrSection}>
              <View style={styles.qrBox}>
                <Svg width="180" height="180" viewBox="0 0 150 150">
                  <Rect x="0" y="0" width="150" height="150" fill="#FFFFFF" />
                  {QR_MATRIX.map((row, rIdx) =>
                    row.map((cell, cIdx) =>
                      cell === 1 ? (
                        <Rect
                          key={`${rIdx}-${cIdx}`}
                          x={cIdx * 10}
                          y={rIdx * 10}
                          width="9"
                          height="9"
                          rx="1.5"
                          fill={COLORS.ink}
                        />
                      ) : null
                    )
                  )}
                </Svg>
              </View>

              <Text style={styles.serviceLabel}>{service.title}</Text>
              <Text style={styles.amountText}>{formatKzt(service.priceKzt)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.kaspiConfirmBtn}
            onPress={confirmKaspiPayment}
            activeOpacity={0.88}
          >
            <Text style={styles.kaspiConfirmBtnText}>Confirm Payment</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.receiptContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Clean Green Checkmark Confirmation */}
        <View style={styles.paidHeader}>
          <Animated.View
            style={[styles.checkCircle, { transform: [{ scale: scaleAnim }] }]}
          >
            <Feather name="check" size={30} color={COLORS.white} />
          </Animated.View>
          <Text style={styles.paidTitle}>Paid · {formatKzt(service.priceKzt)}</Text>
          <Text style={styles.paidSubtitle}>Paid via Kaspi QR</Text>
        </View>

        {/* Clean Receipt Breakdown */}
        <View style={styles.receiptBlock}>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptKey}>Order</Text>
            <Text style={styles.receiptValue}>{orderId}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.receiptRow}>
            <Text style={styles.receiptKey}>Service</Text>
            <Text style={styles.receiptValue}>{service.title}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.receiptRow}>
            <Text style={styles.receiptKey}>Technician</Text>
            <Text style={styles.receiptValue}>{proProfile.name}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.receiptRow}>
            <Text style={styles.receiptKey}>Total</Text>
            <Text style={styles.receiptTotal}>{formatKzt(service.priceKzt)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.rateButton}
          onPress={() => navigateToStep('REVIEW')}
          activeOpacity={0.88}
        >
          <Text style={styles.rateButtonText}>Rate Technician</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'space-between',
  },
  paymentWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  kaspiCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.divider,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  kaspiHeader: {
    backgroundColor: COLORS.kaspiRed,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  kaspiHeaderTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
  },
  kaspiHeaderOrder: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 14,
    fontWeight: '600',
  },
  qrSection: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  qrBox: {
    padding: 14,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.divider,
    marginBottom: 24,
  },
  serviceLabel: {
    fontSize: 15,
    color: COLORS.secondaryText,
    fontWeight: '500',
    marginBottom: 6,
  },
  amountText: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.ink,
    letterSpacing: -0.6,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: COLORS.background,
  },
  kaspiConfirmBtn: {
    backgroundColor: COLORS.kaspiRed,
    borderRadius: 12,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kaspiConfirmBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  receiptContent: {
    paddingHorizontal: 20,
    paddingTop: 44,
    paddingBottom: 24,
  },
  paidHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  checkCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.emerald,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  paidTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.ink,
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  paidSubtitle: {
    fontSize: 14,
    color: COLORS.secondaryText,
    fontWeight: '500',
  },
  receiptBlock: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 6,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  receiptKey: {
    fontSize: 14,
    color: COLORS.secondaryText,
    fontWeight: '500',
  },
  receiptValue: {
    fontSize: 14,
    color: COLORS.ink,
    fontWeight: '600',
  },
  receiptTotal: {
    fontSize: 16,
    color: COLORS.ink,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
  },
  rateButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rateButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
