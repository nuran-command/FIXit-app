import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Svg, { Rect, Path, Circle } from 'react-native-svg';
import { COLORS } from '../data/mockData';

interface SampleLeakPhotoCardProps {
  photoUri: string | null;
  height?: number;
}

export const SampleLeakPhotoCard: React.FC<SampleLeakPhotoCardProps> = ({
  photoUri,
  height = 140,
}) => {
  if (photoUri) {
    return (
      <View style={[styles.container, { height }]}>
        <Image source={{ uri: photoUri }} style={styles.realImage} resizeMode="cover" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { height }]}>
      <Svg width="100%" height="100%" viewBox="0 0 320 140" preserveAspectRatio="xMidYMid slice">
        <Rect x="0" y="0" width="320" height="140" fill="#1E293B" />
        <Rect x="16" y="12" width="288" height="116" rx="8" fill="#0F172A" />
        <Rect x="44" y="52" width="210" height="18" rx="4" fill="#64748B" />
        <Rect x="135" y="12" width="22" height="85" rx="4" fill="#94A3B8" />
        <Rect x="130" y="46" width="32" height="16" rx="3" fill="#CBD5E1" />
        <Circle
          cx="146"
          cy="66"
          r="20"
          stroke="#94A3B8"
          strokeWidth="1.5"
          strokeDasharray="4,3"
          fill="rgba(148, 163, 184, 0.1)"
        />
        <Path d="M 146 72 C 142 80, 142 85, 146 87 C 150 85, 150 80, 146 72 Z" fill="#38BDF8" />
        <Path d="M 156 84 C 153 90, 153 94, 156 96 C 159 94, 159 90, 156 84 Z" fill="#0EA5E9" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
  },
  realImage: {
    width: '100%',
    height: '100%',
  },
});
