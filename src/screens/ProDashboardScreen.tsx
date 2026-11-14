import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { Feather, Ionicons } from '@expo/vector-icons';
import {
  COLORS,
  PRO_RECENT_JOBS,
  formatKzt,
} from '../data/mockData';
import { useOrder } from '../context/OrderContext';
import { ProProfileModal } from '../components/ProProfileModal';
import { SampleLeakPhotoCard } from '../components/SampleLeakPhotoCard';

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

export const ProDashboardScreen: React.FC = () => {
  const {
    proProfile,
    isProOnline,
    setIsProOnline,
    activeOrder,
    acceptIncomingJob,
    declineIncomingJob,
    proArrivedAtClient,
    completeOrderToPayment,
    confirmKaspiPayment,
    simulateIncomingOrder,
    showToast,
  } = useOrder();

  const [profileModalVisible, setProfileModalVisible] = useState<boolean>(false);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);

  const isDispatching = activeOrder?.status === 'DISPATCHING';
  const isEnRoute = activeOrder?.status === 'EN_ROUTE';
  const isArrived = activeOrder?.status === 'ARRIVED';
  const isCompletedUnpaid = activeOrder?.status === 'COMPLETED_UNPAID';
  const isPaid = activeOrder?.status === 'PAID';

  return (
    <View style={styles.container}>
      {/* Specialist Header */}
      <View style={styles.header}>
        <View style={styles.statusLeft}>
          <View style={[styles.onlineDot, !isProOnline && styles.onlineDotOffline]} />
          <View>
            <Text style={styles.proName}>
              {proProfile.name} · {isProOnline ? 'Online' : 'Offline'}
            </Text>
            <Text style={styles.proSub}>{proProfile.title}</Text>
          </View>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={12} color={COLORS.ink} />
            <Text style={styles.ratingText}>{proProfile.rating}</Text>
          </View>
        </View>

        {/* Profile Avatar Button */}
        <TouchableOpacity
          style={styles.profileAvatarBtn}
          onPress={() => setProfileModalVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.profileAvatarLetter}>{proProfile.name.charAt(0)}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Duty Status Bar */}
        <View style={styles.dutyCard}>
          <View style={styles.dutyLeft}>
            <Feather
              name={isProOnline ? 'check-circle' : 'slash'}
              size={18}
              color={isProOnline ? COLORS.emerald : COLORS.secondaryText}
            />
            <View style={styles.dutyTextCol}>
              <Text style={styles.dutyTitle}>
                {isProOnline ? 'Receiving requests in Yesil' : 'Duty paused'}
              </Text>
              <Text style={styles.dutySub}>
                {isProOnline
                  ? 'High demand area · Mangilik El & Kabanbay'
                  : 'Go online to receive nearby repair orders'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.dutyToggleBtn, !isProOnline && styles.dutyToggleBtnActive]}
            onPress={() => setIsProOnline(!isProOnline)}
            activeOpacity={0.8}
          >
            <Text style={[styles.dutyToggleText, !isProOnline && styles.dutyToggleTextActive]}>
              {isProOnline ? 'Pause' : 'Go Online'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Performance KPI Metrics */}
        <View style={styles.kpiRow}>
          <View style={styles.kpiBox}>
            <Text style={styles.kpiValue}>{formatKzt(proProfile.earningsToday)}</Text>
            <Text style={styles.kpiLabel}>Today's Payout</Text>
          </View>

          <View style={styles.kpiBox}>
            <Text style={styles.kpiValue}>{proProfile.completedToday} orders</Text>
            <Text style={styles.kpiLabel}>Completed</Text>
          </View>

          <View style={styles.kpiBox}>
            <Text style={styles.kpiValue}>98%</Text>
            <Text style={styles.kpiLabel}>Acceptance</Text>
          </View>
        </View>

        {/* STATE 1: Incoming Job Alert */}
        {isDispatching && activeOrder && (
          <View style={styles.incomingJobCard}>
            <View style={styles.incomingHeader}>
              <View style={styles.incomingLiveDot} />
              <Text style={styles.incomingTag}>NEW JOB REQUEST · 1.4 km away (~5 min)</Text>
            </View>

            <View style={styles.incomingTitleRow}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={styles.incomingTitle}>{activeOrder.service.title}</Text>
                <Text style={styles.incomingCategory}>
                  {activeOrder.service.category} · Fixed Price Guaranteed
                </Text>
              </View>
              <Text style={styles.incomingPrice}>
                {formatKzt(activeOrder.service.priceKzt)}
              </Text>
            </View>

            <View style={styles.clientDetailBox}>
              <View style={styles.detailLine}>
                <Feather name="user" size={14} color={COLORS.secondaryText} />
                <Text style={styles.detailClientName}>Client: {activeOrder.clientName}</Text>
              </View>
              <View style={styles.detailLine}>
                <Feather name="map-pin" size={14} color={COLORS.secondaryText} />
                <Text style={styles.detailAddress}>{activeOrder.address}</Text>
              </View>
              {activeOrder.issueDescription ? (
                <Text style={styles.issueQuote}>"{activeOrder.issueDescription}"</Text>
              ) : null}
            </View>

            {/* Photo preview if available */}
            {(activeOrder.photoUri || activeOrder.usedSamplePhoto) && (
              <View style={styles.photoWrap}>
                <SampleLeakPhotoCard photoUri={activeOrder.photoUri} height={100} />
              </View>
            )}

            <View style={styles.alertActionRow}>
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
                <Text style={styles.acceptText}>
                  Accept Job · {formatKzt(activeOrder.service.priceKzt)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* STATE 2: Active Job En Route or Arrived */}
        {(isEnRoute || isArrived) && activeOrder && (
          <View style={styles.activeJobCard}>
            <View style={styles.activeHeaderRow}>
              <View style={styles.statusPill}>
                <Text style={styles.statusPillText}>
                  {isArrived ? 'At Client Location' : 'En Route to Client'}
                </Text>
              </View>
              <Text style={styles.orderIdText}>{activeOrder.orderId}</Text>
            </View>

            <Text style={styles.activeJobTitle}>{activeOrder.service.title}</Text>
            <Text style={styles.activeJobPayout}>
              Payout upon completion: {formatKzt(activeOrder.service.priceKzt)}
            </Text>

            {/* Client Contact & Address Card */}
            <View style={styles.clientContactCard}>
              <View style={styles.clientContactLeft}>
                <Text style={styles.clientNameText}>{activeOrder.clientName}</Text>
                <Text style={styles.clientAddressText}>{activeOrder.address}</Text>
                <Text style={styles.routeDetailText}>
                  {isArrived
                    ? 'Arrived at Mangilik El 55'
                    : `${activeOrder.distanceKm.toFixed(1)} km · ETA ${activeOrder.etaMinutes} min`}
                </Text>
              </View>

              <View style={styles.contactIconsCol}>
                <TouchableOpacity
                  style={styles.contactCircle}
                  onPress={() => showToast(`Calling ${activeOrder.clientName}...`)}
                >
                  <Feather name="phone" size={17} color={COLORS.ink} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.contactCircle}
                  onPress={() => showToast(`Message sent to ${activeOrder.clientName}`)}
                >
                  <Feather name="message-circle" size={17} color={COLORS.ink} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Stage Action Button */}
            {isEnRoute ? (
              <TouchableOpacity
                style={styles.arrivedActionBtn}
                onPress={proArrivedAtClient}
                activeOpacity={0.88}
              >
                <Text style={styles.arrivedActionText}>✓ I Have Arrived at Client</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.completeActionBtn}
                onPress={completeOrderToPayment}
                activeOpacity={0.88}
              >
                <Text style={styles.completeActionText}>
                  Complete Repair & Request Payment
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* STATE 3: Repair Completed, Awaiting Payment */}
        {isCompletedUnpaid && activeOrder && (
          <View style={styles.paymentCard}>
            <View style={styles.paymentHeaderRow}>
              <Feather name="check-circle" size={20} color={COLORS.emerald} />
              <Text style={styles.paymentStatusText}>Repair Completed</Text>
            </View>

            <Text style={styles.paymentAmountTitle}>
              {formatKzt(activeOrder.service.priceKzt)}
            </Text>
            <Text style={styles.paymentSub}>
              Awaiting client cashless payment via Kaspi.kz QR
            </Text>

            <View style={styles.paymentButtonsRow}>
              <TouchableOpacity
                style={styles.showQrBtn}
                onPress={() => setShowQrModal(true)}
                activeOpacity={0.85}
              >
                <Feather name="maximize" size={16} color={COLORS.kaspiRed} />
                <Text style={styles.showQrText}>Show Kaspi QR</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmReceivedBtn}
                onPress={confirmKaspiPayment}
                activeOpacity={0.88}
              >
                <Text style={styles.confirmReceivedText}>Confirm Paid</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* STATE 4: Paid */}
        {isPaid && activeOrder && (
          <View style={styles.paidSuccessCard}>
            <Feather name="check" size={24} color={COLORS.emerald} />
            <Text style={styles.paidSuccessTitle}>
              {formatKzt(activeOrder.service.priceKzt)} Received
            </Text>
            <Text style={styles.paidSuccessSub}>
              Payment confirmed via Kaspi QR · Added to today's earnings
            </Text>
          </View>
        )}

        {/* STATE 5: Idle Screen & Recent Jobs */}
        {!activeOrder && (
          <View style={styles.idleBlock}>
            <View style={styles.radarCard}>
              <View style={styles.radarIconBox}>
                <Feather name="radio" size={24} color={COLORS.ink} />
              </View>
              <Text style={styles.radarTitle}>
                {isProOnline ? 'Online in Yesil District' : 'Offline'}
              </Text>
              <Text style={styles.radarSub}>
                {isProOnline
                  ? 'Waiting for new household repair requests nearby'
                  : 'Turn on duty status to start receiving orders'}
              </Text>

              {isProOnline && (
                <TouchableOpacity
                  style={styles.simulateAlertBtn}
                  onPress={simulateIncomingOrder}
                  activeOpacity={0.8}
                >
                  <Text style={styles.simulateAlertText}>Simulate New Job Alert</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Recent Completed Jobs List */}
            <Text style={styles.sectionHeader}>Recent Completed Repairs</Text>
            <View style={styles.recentList}>
              {PRO_RECENT_JOBS.map((job, idx) => {
                const isLast = idx === PRO_RECENT_JOBS.length - 1;
                return (
                  <View
                    key={job.id}
                    style={[styles.recentItem, !isLast && styles.recentItemDivider]}
                  >
                    <View style={styles.recentLeft}>
                      <Text style={styles.recentTitle}>{job.title}</Text>
                      <Text style={styles.recentMeta}>
                        {job.client} · {job.address} · {job.time}
                      </Text>
                    </View>

                    <View style={styles.recentRight}>
                      <Text style={styles.recentPayout}>{formatKzt(job.payoutKzt)}</Text>
                      <Text style={styles.recentBadge}>{job.paymentType}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Specialist Profile Modal */}
      <ProProfileModal
        visible={profileModalVisible}
        onClose={() => setProfileModalVisible(false)}
      />

      {/* Kaspi QR Modal for Specialist to present to client in person */}
      <Modal
        visible={showQrModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowQrModal(false)}
      >
        <View style={styles.qrModalBackdrop}>
          <View style={styles.qrModalCard}>
            <View style={styles.qrModalHeader}>
              <Text style={styles.qrModalTitle}>Kaspi QR Payment</Text>
              <TouchableOpacity onPress={() => setShowQrModal(false)}>
                <Feather name="x" size={20} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            <View style={styles.qrModalBody}>
              <Text style={styles.qrInstruction}>Client scans with Kaspi.kz app</Text>
              <View style={styles.qrFrame}>
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

              <Text style={styles.qrAmount}>
                {formatKzt(activeOrder?.service.priceKzt || 8500)}
              </Text>
              <Text style={styles.qrSub}>Order {activeOrder?.orderId || '#FX-2048'}</Text>

              <TouchableOpacity
                style={styles.qrDoneBtn}
                onPress={() => {
                  setShowQrModal(false);
                  confirmKaspiPayment();
                }}
              >
                <Text style={styles.qrDoneText}>Confirm Received ({formatKzt(activeOrder?.service.priceKzt || 8500)})</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    gap: 10,
    flex: 1,
  },
  onlineDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: COLORS.emerald,
  },
  onlineDotOffline: {
    backgroundColor: COLORS.mutedText,
  },
  proName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.ink,
  },
  proSub: {
    fontSize: 12,
    color: COLORS.secondaryText,
    marginTop: 1,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 999,
  },
  ratingText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.ink,
  },
  profileAvatarBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarLetter: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.ink,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 36,
  },
  dutyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  dutyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 8,
  },
  dutyTextCol: {
    flex: 1,
  },
  dutyTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: COLORS.ink,
    marginBottom: 2,
  },
  dutySub: {
    fontSize: 12,
    color: COLORS.secondaryText,
  },
  dutyToggleBtn: {
    backgroundColor: COLORS.divider,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  dutyToggleBtnActive: {
    backgroundColor: COLORS.primary,
  },
  dutyToggleText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: COLORS.ink,
  },
  dutyToggleTextActive: {
    color: COLORS.white,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  kpiBox: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  kpiValue: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.ink,
    marginBottom: 2,
  },
  kpiLabel: {
    fontSize: 11,
    color: COLORS.secondaryText,
    fontWeight: '500',
  },
  incomingJobCard: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1.5,
    borderColor: COLORS.ink,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  incomingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  incomingLiveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.emerald,
  },
  incomingTag: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.emerald,
    letterSpacing: 0.3,
  },
  incomingTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  incomingTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.ink,
    letterSpacing: -0.3,
    marginBottom: 3,
  },
  incomingCategory: {
    fontSize: 13,
    color: COLORS.secondaryText,
  },
  incomingPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.ink,
  },
  clientDetailBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
    gap: 6,
    marginBottom: 14,
  },
  detailLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailClientName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.ink,
  },
  detailAddress: {
    fontSize: 13.5,
    color: COLORS.secondaryText,
    fontWeight: '500',
  },
  issueQuote: {
    fontSize: 13,
    color: COLORS.secondaryText,
    fontStyle: 'italic',
    marginTop: 4,
  },
  photoWrap: {
    marginBottom: 14,
  },
  alertActionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  declineBtn: {
    flex: 1,
    backgroundColor: COLORS.divider,
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.ink,
  },
  acceptBtn: {
    flex: 1.8,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
  },
  activeJobCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusPill: {
    backgroundColor: COLORS.emeraldSurface,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.emerald,
  },
  orderIdText: {
    fontSize: 13,
    color: COLORS.secondaryText,
    fontWeight: '600',
  },
  activeJobTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: COLORS.ink,
    marginBottom: 4,
  },
  activeJobPayout: {
    fontSize: 14,
    color: COLORS.secondaryText,
    fontWeight: '500',
    marginBottom: 16,
  },
  clientContactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  clientContactLeft: {
    flex: 1,
    paddingRight: 10,
  },
  clientNameText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.ink,
    marginBottom: 2,
  },
  clientAddressText: {
    fontSize: 13,
    color: COLORS.secondaryText,
    marginBottom: 4,
  },
  routeDetailText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.emerald,
  },
  contactIconsCol: {
    flexDirection: 'row',
    gap: 8,
  },
  contactCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrivedActionBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrivedActionText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '600',
  },
  completeActionBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeActionText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '600',
  },
  paymentCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  paymentHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  paymentStatusText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.emerald,
  },
  paymentAmountTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.ink,
    marginBottom: 4,
  },
  paymentSub: {
    fontSize: 13.5,
    color: COLORS.secondaryText,
    textAlign: 'center',
    marginBottom: 18,
  },
  paymentButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  showQrBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: 12,
    height: 48,
    gap: 6,
  },
  showQrText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.kaspiRed,
  },
  confirmReceivedBtn: {
    flex: 1.2,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmReceivedText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
  paidSuccessCard: {
    backgroundColor: COLORS.emeraldSurface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    gap: 4,
  },
  paidSuccessTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.ink,
    marginTop: 4,
  },
  paidSuccessSub: {
    fontSize: 13,
    color: COLORS.secondaryText,
    textAlign: 'center',
  },
  idleBlock: {
    gap: 20,
  },
  radarCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  radarIconBox: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  radarTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.ink,
    marginBottom: 4,
  },
  radarSub: {
    fontSize: 13.5,
    color: COLORS.secondaryText,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 16,
  },
  simulateAlertBtn: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  simulateAlertText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: COLORS.ink,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.ink,
  },
  recentList: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  recentItemDivider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  recentLeft: {
    flex: 1,
    paddingRight: 10,
  },
  recentTitle: {
    fontSize: 14.5,
    fontWeight: '600',
    color: COLORS.ink,
    marginBottom: 3,
  },
  recentMeta: {
    fontSize: 12.5,
    color: COLORS.secondaryText,
  },
  recentRight: {
    alignItems: 'flex-end',
  },
  recentPayout: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.ink,
    marginBottom: 2,
  },
  recentBadge: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.kaspiRed,
  },
  qrModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  qrModalCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    overflow: 'hidden',
  },
  qrModalHeader: {
    backgroundColor: COLORS.kaspiRed,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  qrModalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
  qrModalBody: {
    padding: 24,
    alignItems: 'center',
  },
  qrInstruction: {
    fontSize: 14,
    color: COLORS.secondaryText,
    marginBottom: 16,
  },
  qrFrame: {
    padding: 12,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.divider,
    marginBottom: 16,
  },
  qrAmount: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.ink,
    marginBottom: 2,
  },
  qrSub: {
    fontSize: 13,
    color: COLORS.secondaryText,
    marginBottom: 20,
  },
  qrDoneBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
  },
  qrDoneText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '600',
  },
});
