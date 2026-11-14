import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../data/mockData';
import { useOrder } from '../context/OrderContext';

interface ClientProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onOpenAddressSelector?: () => void;
}

export const ClientProfileModal: React.FC<ClientProfileModalProps> = ({
  visible,
  onClose,
  onOpenAddressSelector,
}) => {
  const { clientProfile, clientPhone, clientAddress, activeOrder, logout } = useOrder();

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
            <Text style={styles.title}>Account</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Feather name="x" size={20} color={COLORS.secondaryText} />
            </TouchableOpacity>
          </View>

          {/* User Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{clientProfile.name.charAt(0)}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{clientProfile.fullName}</Text>
              <Text style={styles.userPhone}>{clientPhone}</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleBadgeText}>Client Account · Verified</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Options List */}
          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => {
              onClose();
              if (onOpenAddressSelector) {
                onOpenAddressSelector();
              }
            }}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <Feather name="map-pin" size={17} color={COLORS.ink} />
              <View>
                <Text style={styles.menuLabel}>Delivery Address</Text>
                <Text style={styles.menuSub} numberOfLines={1}>
                  {clientAddress}
                </Text>
              </View>
            </View>
            <Feather name="chevron-right" size={16} color={COLORS.mutedText} />
          </TouchableOpacity>

          <View style={styles.menuRow}>
            <View style={styles.menuLeft}>
              <Feather name="activity" size={17} color={COLORS.ink} />
              <View>
                <Text style={styles.menuLabel}>Active Orders</Text>
                <Text style={styles.menuSub}>
                  {activeOrder ? `${activeOrder.service.title} (#FX-2048)` : 'No active repairs'}
                </Text>
              </View>
            </View>
            <Feather name="chevron-right" size={16} color={COLORS.mutedText} />
          </View>

          <View style={styles.menuRow}>
            <View style={styles.menuLeft}>
              <Feather name="credit-card" size={17} color={COLORS.ink} />
              <View>
                <Text style={styles.menuLabel}>Payment Method</Text>
                <Text style={styles.menuSub}>Kaspi.kz QR (Default)</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={16} color={COLORS.mutedText} />
          </View>

          <View style={styles.divider} />

          {/* Clean Log Out Button */}
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogout}
            activeOpacity={0.85}
          >
            <Feather name="log-out" size={17} color={COLORS.ink} style={{ marginRight: 8 }} />
            <Text style={styles.logoutText}>Log Out</Text>
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
  userName: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.ink,
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 13.5,
    color: COLORS.secondaryText,
    marginBottom: 6,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.white,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.emerald,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: 18,
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
    paddingRight: 10,
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
