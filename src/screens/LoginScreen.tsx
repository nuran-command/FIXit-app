import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS, DEFAULT_CLIENT, INITIAL_PRO_PROFILE, RoleMode } from '../data/mockData';
import { useOrder } from '../context/OrderContext';

export const LoginScreen: React.FC = () => {
  const { loginWithRole } = useOrder();
  const [selectedRole, setSelectedRole] = useState<RoleMode>('CLIENT');
  const [phone, setPhone] = useState<string>(DEFAULT_CLIENT.phone);
  const [step, setStep] = useState<'WELCOME' | 'PHONE' | 'OTP'>('WELCOME');
  const [otpCode, setOtpCode] = useState<string>('');

  const handleRoleSelect = (role: RoleMode) => {
    setSelectedRole(role);
    if (role === 'CLIENT') {
      setPhone(DEFAULT_CLIENT.phone);
    } else {
      setPhone(INITIAL_PRO_PROFILE.phone);
    }
  };

  const handleOtpTap = () => {
    setOtpCode('1234');
    setTimeout(() => {
      loginWithRole(selectedRole, phone);
    }, 260);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {step === 'WELCOME' ? (
          <View style={styles.welcomeContainer}>
            {/* Top Atmospheric Floating Cards Section (Inspired by Reference Design) */}
            <View style={styles.heroArtArea}>
              <View style={styles.blueGlowBlob} />

              {/* Floating Card 1: Plumbing (Tilted Left) */}
              <View style={[styles.floatingCard, styles.floatingCardLeft]}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardCategory}>Plumbing</Text>
                  <View style={styles.heartMiniBadge}>
                    <Ionicons name="heart" size={13} color={COLORS.primary} />
                  </View>
                </View>
                <Text style={styles.cardTitle}>Kitchen Faucet Leak</Text>

                {/* Card Graphic */}
                <View style={styles.cardArtBox}>
                  <Feather name="droplet" size={32} color={COLORS.primary} />
                  <View style={styles.wrenchCircle}>
                    <Feather name="tool" size={14} color={COLORS.white} />
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <View>
                    <Text style={styles.priceLabel}>Price</Text>
                    <Text style={styles.priceValue}>8,500 ₸</Text>
                  </View>
                  <View style={styles.miniPillBtn}>
                    <Text style={styles.miniPillText}>~15m arrival</Text>
                  </View>
                </View>
              </View>

              {/* Floating Card 2: Electrical (Tilted Right) */}
              <View style={[styles.floatingCard, styles.floatingCardRight]}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardCategoryDark}>Electrical</Text>
                  <View style={styles.starMiniBadge}>
                    <Ionicons name="star" size={12} color={COLORS.amber} />
                    <Text style={styles.starMiniText}>4.9</Text>
                  </View>
                </View>
                <Text style={styles.cardTitleDark}>Short Circuit & Breaker</Text>

                <View style={styles.cardArtBoxAmber}>
                  <Feather name="zap" size={28} color={COLORS.amber} />
                </View>

                <View style={styles.cardFooter}>
                  <View>
                    <Text style={styles.priceLabel}>Price</Text>
                    <Text style={styles.priceValueDark}>11,000 ₸</Text>
                  </View>
                  <View style={styles.miniPillBtnDark}>
                    <Text style={styles.miniPillText}>24/7 Rapid</Text>
                  </View>
                </View>
              </View>

              {/* Floating Verified Badge */}
              <View style={styles.verifiedFloatingPill}>
                <Feather name="shield" size={13} color={COLORS.emerald} />
                <Text style={styles.verifiedFloatingText}>Astana Verified Pros</Text>
              </View>
            </View>

            {/* Typography Section */}
            <View style={styles.textSection}>
              <Text style={styles.heroTitle}>Your Trusted Masters, Anytime</Text>
              <Text style={styles.heroSubtitle}>
                On-demand verified plumbers & electricians in Astana. Guaranteed fixed KZT rates, zero bargaining.
              </Text>
            </View>

            {/* Role Selection Pre-picker */}
            <View style={styles.roleSelectionBox}>
              <Text style={styles.roleLabel}>Select your account type</Text>
              <View style={styles.roleRow}>
                <TouchableOpacity
                  style={[
                    styles.roleCard,
                    selectedRole === 'CLIENT' && styles.roleCardActive,
                  ]}
                  onPress={() => handleRoleSelect('CLIENT')}
                  activeOpacity={0.85}
                >
                  <Feather
                    name="home"
                    size={18}
                    color={selectedRole === 'CLIENT' ? COLORS.white : COLORS.ink}
                  />
                  <Text
                    style={[
                      styles.roleCardTitle,
                      selectedRole === 'CLIENT' && styles.roleCardTitleActive,
                    ]}
                  >
                    I need a repair
                  </Text>
                  <Text
                    style={[
                      styles.roleCardSub,
                      selectedRole === 'CLIENT' && styles.roleCardSubActive,
                    ]}
                  >
                    Client (Aidana)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.roleCard,
                    selectedRole === 'PRO' && styles.roleCardActive,
                  ]}
                  onPress={() => handleRoleSelect('PRO')}
                  activeOpacity={0.85}
                >
                  <Feather
                    name="tool"
                    size={18}
                    color={selectedRole === 'PRO' ? COLORS.white : COLORS.ink}
                  />
                  <Text
                    style={[
                      styles.roleCardTitle,
                      selectedRole === 'PRO' && styles.roleCardTitleActive,
                    ]}
                  >
                    I'm a specialist
                  </Text>
                  <Text
                    style={[
                      styles.roleCardSub,
                      selectedRole === 'PRO' && styles.roleCardSubActive,
                    ]}
                  >
                    Master (Marat)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Primary Action Button (Matches Reference 'Get Start' pill) */}
            <TouchableOpacity
              style={styles.blackPillButton}
              onPress={() => setStep('PHONE')}
              activeOpacity={0.88}
            >
              <Text style={styles.blackPillButtonText}>Get Started →</Text>
            </TouchableOpacity>
          </View>
        ) : step === 'PHONE' ? (
          <View style={styles.innerForm}>
            <TouchableOpacity
              style={styles.backRow}
              onPress={() => setStep('WELCOME')}
              activeOpacity={0.7}
            >
              <Feather name="arrow-left" size={20} color={COLORS.ink} />
            </TouchableOpacity>

            <View style={styles.stepHeader}>
              <Text style={styles.formTitle}>
                {selectedRole === 'CLIENT' ? 'Client Sign In' : 'Specialist Sign In'}
              </Text>
              <Text style={styles.formSubtitle}>
                {selectedRole === 'CLIENT'
                  ? 'Enter your phone number to book plumbing & electrical repairs in Astana.'
                  : 'Enter your phone number to receive repair orders across Yesil District.'}
              </Text>
            </View>

            {/* Role indicator pill */}
            <View style={styles.activeRolePill}>
              <Feather
                name={selectedRole === 'CLIENT' ? 'home' : 'tool'}
                size={14}
                color={COLORS.primary}
              />
              <Text style={styles.activeRoleText}>
                {selectedRole === 'CLIENT' ? 'Client: Aidana Kassymova' : 'Specialist: Marat Zhakupov'}
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputPrefix}>🇰🇿</Text>
              <TextInput
                style={styles.phoneInput}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholder="+7 701 555 0192"
                placeholderTextColor={COLORS.mutedText}
              />
            </View>

            <TouchableOpacity
              style={styles.blackPillButton}
              onPress={() => setStep('OTP')}
              activeOpacity={0.88}
            >
              <Text style={styles.blackPillButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.innerForm}>
            <TouchableOpacity
              style={styles.backRow}
              onPress={() => setStep('PHONE')}
              activeOpacity={0.7}
            >
              <Feather name="arrow-left" size={20} color={COLORS.ink} />
            </TouchableOpacity>

            <View style={styles.stepHeader}>
              <Text style={styles.formTitle}>Enter 4-digit code</Text>
              <Text style={styles.formSubtitle}>
                Verification SMS sent to <Text style={{ fontWeight: '700', color: COLORS.ink }}>{phone}</Text>
              </Text>
            </View>

            {/* 4 Clean OTP Boxes */}
            <TouchableOpacity
              style={styles.otpRow}
              onPress={handleOtpTap}
              activeOpacity={0.85}
            >
              {[0, 1, 2, 3].map((idx) => {
                const digit = otpCode[idx] || '';
                return (
                  <View
                    key={idx}
                    style={[styles.otpBox, digit !== '' && styles.otpBoxFilled]}
                  >
                    <Text style={styles.otpDigit}>{digit}</Text>
                  </View>
                );
              })}
            </TouchableOpacity>

            <TextInput
              style={styles.hiddenOtpInput}
              value={otpCode}
              onChangeText={(val) => {
                const cleaned = val.replace(/[^0-9]/g, '').slice(0, 4);
                setOtpCode(cleaned);
                if (cleaned.length === 4) {
                  setTimeout(() => loginWithRole(selectedRole, phone), 200);
                }
              }}
              keyboardType="number-pad"
              maxLength={4}
              placeholder="Tap boxes to auto-fill 1234"
              placeholderTextColor={COLORS.mutedText}
            />

            <TouchableOpacity
              style={styles.blackPillButton}
              onPress={() => {
                if (otpCode.length < 4) {
                  handleOtpTap();
                } else {
                  loginWithRole(selectedRole, phone);
                }
              }}
              activeOpacity={0.88}
            >
              <Text style={styles.blackPillButtonText}>
                {selectedRole === 'CLIENT' ? 'Enter as Client →' : 'Enter as Specialist →'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: Platform.OS === 'ios' ? 20 : 28,
    paddingBottom: 36,
    justifyContent: 'space-between',
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  heroArtArea: {
    height: 300,
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  blueGlowBlob: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#EFF6FF',
    top: 20,
    opacity: 0.9,
  },
  floatingCard: {
    position: 'absolute',
    width: 210,
    backgroundColor: COLORS.white,
    borderRadius: 22,
    padding: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  floatingCardLeft: {
    top: 10,
    left: 12,
    transform: [{ rotate: '-6deg' }],
    backgroundColor: '#F0F7FF',
    borderColor: '#BFDBFE',
    zIndex: 2,
  },
  floatingCardRight: {
    top: 76,
    right: 12,
    transform: [{ rotate: '5deg' }],
    backgroundColor: COLORS.white,
    borderColor: '#E2E8F0',
    zIndex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardCategory: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardCategoryDark: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.amber,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heartMiniBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  starMiniBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
  },
  starMiniText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: COLORS.ink,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.ink,
    marginBottom: 8,
  },
  cardTitleDark: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.ink,
    marginBottom: 8,
  },
  cardArtBox: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 10,
  },
  cardArtBoxAmber: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  wrenchCircle: {
    position: 'absolute',
    bottom: -4,
    right: 14,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 10,
    color: COLORS.secondaryText,
    fontWeight: '600',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
  },
  priceValueDark: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.ink,
  },
  miniPillBtn: {
    backgroundColor: COLORS.blackPill,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  miniPillBtnDark: {
    backgroundColor: COLORS.blackPill,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  miniPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.white,
  },
  verifiedFloatingPill: {
    position: 'absolute',
    bottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  verifiedFloatingText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.ink,
  },
  textSection: {
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.ink,
    letterSpacing: -0.8,
    lineHeight: 38,
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 15,
    color: COLORS.secondaryText,
    lineHeight: 22,
    fontWeight: '500',
  },
  roleSelectionBox: {
    marginBottom: 24,
  },
  roleLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.secondaryText,
    marginBottom: 10,
  },
  roleRow: {
    flexDirection: 'row',
    gap: 12,
  },
  roleCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    gap: 4,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  roleCardActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  roleCardTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: COLORS.ink,
    marginTop: 4,
  },
  roleCardTitleActive: {
    color: COLORS.white,
  },
  roleCardSub: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.secondaryText,
  },
  roleCardSubActive: {
    color: 'rgba(255, 255, 255, 0.82)',
  },
  blackPillButton: {
    backgroundColor: COLORS.blackPill,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
  },
  blackPillButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  innerForm: {
    flex: 1,
    paddingTop: 8,
  },
  backRow: {
    marginBottom: 24,
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  stepHeader: {
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.ink,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  formSubtitle: {
    fontSize: 15,
    color: COLORS.secondaryText,
    lineHeight: 22,
  },
  activeRolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  activeRoleText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginBottom: 24,
  },
  inputPrefix: {
    fontSize: 20,
    marginRight: 10,
  },
  phoneInput: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.ink,
  },
  otpRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  otpBox: {
    flex: 1,
    height: 64,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  otpBoxFilled: {
    backgroundColor: '#EFF6FF',
    borderColor: COLORS.primary,
  },
  otpDigit: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.ink,
  },
  hiddenOtpInput: {
    height: 44,
    fontSize: 14,
    color: COLORS.secondaryText,
    textAlign: 'center',
    marginBottom: 20,
  },
});
