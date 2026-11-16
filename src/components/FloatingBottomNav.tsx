import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../data/mockData';

export type BottomNavTab = 'Home' | 'Explore' | 'Custom' | 'Orders' | 'Profile';

interface FloatingBottomNavProps {
  activeTab: BottomNavTab;
  onTabPress: (tab: BottomNavTab) => void;
  hasActiveOrder?: boolean;
}

export const FloatingBottomNav: React.FC<FloatingBottomNavProps> = ({
  activeTab,
  onTabPress,
  hasActiveOrder = false,
}) => {
  return (
    <View style={styles.dockWrapper} pointerEvents="box-none">
      <View style={styles.dockContainer}>
        {/* Home Tab */}
        {activeTab === 'Home' ? (
          <View style={styles.activePill}>
            <Ionicons name="home" size={17} color={COLORS.white} />
            <Text style={styles.activeLabel}>Home</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.iconTouch}
            onPress={() => onTabPress('Home')}
            activeOpacity={0.7}
          >
            <Ionicons name="home-outline" size={20} color={COLORS.navInactive} />
          </TouchableOpacity>
        )}

        {/* Explore Tab */}
        {activeTab === 'Explore' ? (
          <View style={styles.activePill}>
            <Ionicons name="compass" size={17} color={COLORS.white} />
            <Text style={styles.activeLabel}>Explore</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.iconTouch}
            onPress={() => onTabPress('Explore')}
            activeOpacity={0.7}
          >
            <Ionicons name="compass-outline" size={21} color={COLORS.navInactive} />
          </TouchableOpacity>
        )}

        {/* Custom Problem Tab */}
        {activeTab === 'Custom' ? (
          <View style={styles.activePill}>
            <Feather name="plus-circle" size={17} color={COLORS.white} />
            <Text style={styles.activeLabel}>Custom</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.iconTouch}
            onPress={() => onTabPress('Custom')}
            activeOpacity={0.7}
          >
            <Feather name="plus-circle" size={20} color={COLORS.navInactive} />
          </TouchableOpacity>
        )}

        {/* Active Orders / Tracking Tab */}
        {activeTab === 'Orders' ? (
          <View style={styles.activePill}>
            <Feather name="navigation" size={16} color={COLORS.white} />
            <Text style={styles.activeLabel}>Orders</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.iconTouch}
            onPress={() => onTabPress('Orders')}
            activeOpacity={0.7}
          >
            <View style={styles.orderIconWrap}>
              <Feather name="navigation" size={19} color={COLORS.navInactive} />
              {hasActiveOrder && <View style={styles.activeBadgeDot} />}
            </View>
          </TouchableOpacity>
        )}

        {/* Profile Tab */}
        {activeTab === 'Profile' ? (
          <View style={styles.activePill}>
            <Feather name="user" size={17} color={COLORS.white} />
            <Text style={styles.activeLabel}>Profile</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.iconTouch}
            onPress={() => onTabPress('Profile')}
            activeOpacity={0.7}
          >
            <Feather name="user" size={20} color={COLORS.navInactive} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dockWrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 99,
  },
  dockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 8,
    gap: 4,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.blackPill,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    gap: 6,
  },
  activeLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.white,
  },
  iconTouch: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderIconWrap: {
    position: 'relative',
  },
  activeBadgeDot: {
    position: 'absolute',
    top: -2,
    right: -3,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.primary,
  },
});
