import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../data/mockData';
import { useOrder } from '../context/OrderContext';

export const RoleTogglePill: React.FC = () => {
  const { role, switchRole } = useOrder();

  return (
    <View style={styles.pill}>
      <TouchableOpacity
        style={[styles.option, role === 'CLIENT' && styles.optionActive]}
        onPress={() => switchRole('CLIENT')}
        activeOpacity={0.8}
      >
        <Text style={[styles.label, role === 'CLIENT' && styles.labelActive]}>Client</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.option, role === 'PRO' && styles.optionActive]}
        onPress={() => switchRole('PRO')}
        activeOpacity={0.8}
      >
        <Text style={[styles.label, role === 'PRO' && styles.labelActive]}>Pro</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 999,
    padding: 3,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  option: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  optionActive: {
    backgroundColor: COLORS.primary,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.secondaryText,
  },
  labelActive: {
    color: COLORS.white,
  },
});

