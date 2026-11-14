import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Path, Line, Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../data/mockData';

interface SimulatedAstanaMapProps {
  routeProgress: number; // 0 to 1
}

const WAYPOINTS = [
  { x: 64, y: 84 },
  { x: 190, y: 84 },
  { x: 190, y: 210 },
  { x: 292, y: 210 },
];

function interpolateRoutePoint(progress: number): { x: number; y: number } {
  const clamped = Math.max(0, Math.min(1, progress));
  const segLengths: number[] = [];
  let totalLength = 0;

  for (let i = 0; i < WAYPOINTS.length - 1; i++) {
    const dx = WAYPOINTS[i + 1].x - WAYPOINTS[i].x;
    const dy = WAYPOINTS[i + 1].y - WAYPOINTS[i].y;
    const len = Math.hypot(dx, dy);
    segLengths.push(len);
    totalLength += len;
  }

  let targetDist = clamped * totalLength;
  for (let i = 0; i < segLengths.length; i++) {
    const segLen = segLengths[i];
    if (targetDist <= segLen || i === segLengths.length - 1) {
      const ratio = segLen === 0 ? 0 : targetDist / segLen;
      return {
        x: WAYPOINTS[i].x + (WAYPOINTS[i + 1].x - WAYPOINTS[i].x) * ratio,
        y: WAYPOINTS[i].y + (WAYPOINTS[i + 1].y - WAYPOINTS[i].y) * ratio,
      };
    }
    targetDist -= segLen;
  }
  return WAYPOINTS[WAYPOINTS.length - 1];
}

export const SimulatedAstanaMap: React.FC<SimulatedAstanaMapProps> = ({
  routeProgress,
}) => {
  const techPos = interpolateRoutePoint(routeProgress);
  const homePos = WAYPOINTS[WAYPOINTS.length - 1];

  const techLeftPct = `${(techPos.x / 360) * 100}%` as const;
  const techTopPct = `${(techPos.y / 280) * 100}%` as const;
  const homeLeftPct = `${(homePos.x / 360) * 100}%` as const;
  const homeTopPct = `${(homePos.y / 280) * 100}%` as const;

  return (
    <View style={styles.mapWrapper}>
      <Svg width="100%" height="100%" viewBox="0 0 360 280" preserveAspectRatio="none">
        {/* Clean light-gray Uber-style map canvas */}
        <Rect x="0" y="0" width="360" height="280" fill="#F1F5F9" />

        {/* Subtle city blocks */}
        <Rect x="20" y="96" width="84" height="54" rx="6" fill="#E2E8F0" opacity={0.45} />
        <Rect x="116" y="96" width="60" height="54" rx="6" fill="#E2E8F0" opacity={0.45} />
        <Rect x="204" y="96" width="76" height="98" rx="6" fill="#E2E8F0" opacity={0.35} />
        <Rect x="294" y="96" width="52" height="98" rx="6" fill="#E2E8F0" opacity={0.45} />
        <Rect x="20" y="164" width="156" height="34" rx="6" fill="#E2E8F0" opacity={0.4} />
        <Rect x="20" y="224" width="156" height="40" rx="6" fill="#E2E8F0" opacity={0.35} />
        <Rect x="204" y="224" width="142" height="40" rx="6" fill="#E2E8F0" opacity={0.35} />

        {/* Secondary white grid roads */}
        <Line x1="110" y1="0" x2="110" y2="280" stroke="#FFFFFF" strokeWidth="7" />
        <Line x1="286" y1="0" x2="286" y2="280" stroke="#FFFFFF" strokeWidth="7" />
        <Line x1="0" y1="156" x2="360" y2="156" stroke="#FFFFFF" strokeWidth="7" />

        {/* Major Astana avenues */}
        <Line x1="0" y1="84" x2="360" y2="84" stroke="#FFFFFF" strokeWidth="14" />
        <Line x1="0" y1="210" x2="360" y2="210" stroke="#FFFFFF" strokeWidth="14" />
        <Line x1="190" y1="0" x2="190" y2="280" stroke="#FFFFFF" strokeWidth="12" />

        {/* Smooth route polyline */}
        <Path
          d="M 64 84 L 190 84 L 190 210 L 292 210"
          stroke={COLORS.primary}
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Destination dot (Aidana) */}
        <Circle cx={homePos.x} cy={homePos.y} r="14" fill="rgba(15, 23, 42, 0.12)" />
        <Circle
          cx={homePos.x}
          cy={homePos.y}
          r="6.5"
          fill={COLORS.primary}
          stroke="#FFFFFF"
          strokeWidth="2.5"
        />
      </Svg>

      {/* Clean street name labels */}
      <Text style={[styles.streetLabel, { top: '26%', left: 16 }]}>Kabanbay Batyr Ave</Text>
      <Text style={[styles.streetLabel, { top: '79%', left: 16 }]}>Mangilik El Ave</Text>

      {/* Aidana home label */}
      <View style={[styles.homeLabelBox, { left: homeLeftPct, top: homeTopPct }]}>
        <Text style={styles.homeLabelText}>Aidana</Text>
      </View>

      {/* Moving technician vehicle marker */}
      <View style={[styles.vehicleMarker, { left: techLeftPct, top: techTopPct }]}>
        <Ionicons name="car" size={16} color={COLORS.white} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mapWrapper: {
    flex: 1,
    width: '100%',
    backgroundColor: '#F1F5F9',
    position: 'relative',
  },
  streetLabel: {
    position: 'absolute',
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.secondaryText,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  homeLabelBox: {
    position: 'absolute',
    transform: [{ translateX: -24 }, { translateY: 14 }],
    backgroundColor: COLORS.white,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  homeLabelText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.ink,
  },
  vehicleMarker: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    transform: [{ translateX: -16 }, { translateY: -16 }],
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: COLORS.white,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
});
