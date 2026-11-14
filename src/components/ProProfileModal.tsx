import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS, formatKzt } from '../data/mockData';
import { useOrder } from '../context/OrderContext';

interface ProProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ProProfileModal: React.FC<ProProfileModalProps> = ({
  visible,
  onClose,
}) => {
  const { proProfile, isProOnline, setIsProOnline, logout } = useOrder();

  const handleLogout = () => {
    onClose();
    logout();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <TouchableOpacity style={styles.backdropTouch} activeOpacity={1} onPress={onClose} />

        <View style={styles.sheet}>
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Specialist Account</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Feather name="x" size={20} color={COLORS.secondaryText} />
            </TouchableOpacity>
          </View>

          {/* Pro Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{proProfile.name.charAt(0)}</Text>
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.userName}>{proProfile.fullName}</Text>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={13} color={COLORS.ink} />
                  <Text style={styles.ratingText}>{proProfile.rating}</Text>
                </View>
              </View>
              <Text style={styles.userTitle}>{proProfile.title}</Text>
              <Text style={styles.userPhone}>{proProfile.phone}</Text>
              <View style={styles.badgeRow}>
                <Text style={styles.verifiedText}>✓ Verified Pro · 14 yrs exp</Text>
              </View>
            </View>
          </View>

          {/* Stats Bar */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{formatKzt(proProfile.earningsToday)}</Text>
              <Text style={styles.statLabel}>Today's Payout</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{proProfile.completedToday} jobs</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{proProfile.verifiedJobs}</Text>
              <Text style={styles.statLabel}>Total Reviews</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Vehicle & Duty Status */}
          <View style={styles.menuRow}>
            <View style={styles.menuLeft}>
              <Feather name="truck" size={17} color={COLORS.ink} />
              <View>
                <Text style={styles.menuLabel}>Registered Vehicle</Text>
                <Text style={styles.menuSub}>{proProfile.vehicleInfo}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => setIsProOnline(!isProOnline)}
            activeOpacity={0.75}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.statusDot, !isProOnline && styles.statusDotOffline]} />
              <View>
                <Text style={styles.menuLabel}>Duty Status</Text>
                <Text style={styles.menuSub}>
                  {isProOnline ? 'Online (Accepting orders in Yesil)' : 'Offline (Paused)'}
                </Text>
              </View>
            </View>
            <Text style={styles.toggleActionText}>{isProOnline ? 'Go Offline' : 'Go Online'}</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Log Out Button */}
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogout}
            activeOpacity={0.85}
          >
            <Feather name="log-out" size={17} color={COLORS.ink} style={{ marginRight: 8 }} />
            <Text style={styles.logoutText}>Log Out from Specialist Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
  },
  backdropTouch: {
    flex: 1,
  },
  sheet: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 36,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.divider,
    alignSelf: 'center',
    marginBottom: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.ink,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 16,
    gap: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  userName: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.ink,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: COLORS.white,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
  },
  ratingText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.ink,
  },
  userTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.secondaryText,
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 13,
    color: COLORS.mutedText,
    marginBottom: 6,
  },
  badgeRow: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.white,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.emerald,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.surface,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.ink,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.secondaryText,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: 16,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.emerald,
  },
  statusDotOffline: {
    backgroundColor: COLORS.mutedText,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.ink,
    marginBottom: 2,
  },
  menuSub: {
    fontSize: 13,
    color: COLORS.secondaryText,
  },
  toggleActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  logoutBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.ink,
  },
});
