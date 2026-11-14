import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, DEFAULT_CLIENT, INITIAL_PRO_PROFILE, RoleMode } from '../data/mockData';
import { useOrder } from '../context/OrderContext';

export const LoginScreen: React.FC = () => {
  const { loginWithRole } = useOrder();
  const [selectedRole, setSelectedRole] = useState<RoleMode>('CLIENT');
  const [phone, setPhone] = useState<string>(DEFAULT_CLIENT.phone);
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
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
      <View style={styles.inner}>
        {/* Minimal Wordmark */}
        <View style={styles.header}>
          <Text style={styles.wordmark}>FixIt</Text>
          <Text style={styles.tagline}>Home repairs & verified specialists in Astana</Text>
        </View>

        {step === 'PHONE' ? (
          <View style={styles.formSection}>
            {/* Clean Two-Card Role Selector */}
            <Text style={styles.roleSelectionLabel}>Choose account type</Text>
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
                  size={20}
                  color={selectedRole === 'CLIENT' ? COLORS.white : COLORS.ink}
                />
                <Text
                  style={[
                    styles.roleTitle,
                    selectedRole === 'CLIENT' && styles.roleTitleActive,
                  ]}
                >
                  I need a repair
                </Text>
                <Text
                  style={[
                    styles.roleSub,
                    selectedRole === 'CLIENT' && styles.roleSubActive,
                  ]}
                >
                  Client account (Aidana)
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
                  size={20}
                  color={selectedRole === 'PRO' ? COLORS.white : COLORS.ink}
                />
                <Text
                  style={[
                    styles.roleTitle,
                    selectedRole === 'PRO' && styles.roleTitleActive,
                  ]}
                >
                  I'm a specialist
                </Text>
                <Text
                  style={[
                    styles.roleSub,
                    selectedRole === 'PRO' && styles.roleSubActive,
                  ]}
                >
                  Master plumber (Marat)
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.title}>
              {selectedRole === 'CLIENT'
                ? 'Sign in as Client'
                : 'Sign in as Specialist'}
            </Text>
            <Text style={styles.subtitle}>
              {selectedRole === 'CLIENT'
                ? "Enter your mobile number to book plumbing & repairs in Astana."
                : "Enter your mobile number to receive technician repair alerts in Yesil District."}
            </Text>

            <View style={styles.inputContainer}>
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
              style={styles.primaryButton}
              onPress={() => setStep('OTP')}
              activeOpacity={0.88}
            >
              <Text style={styles.primaryButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.formSection}>
            <TouchableOpacity
              style={styles.backRow}
              onPress={() => setStep('PHONE')}
              activeOpacity={0.7}
            >
              <Feather name="arrow-left" size={20} color={COLORS.ink} />
            </TouchableOpacity>

            <Text style={styles.title}>Enter 4-digit code</Text>
            <Text style={styles.subtitle}>
              Sent to {phone} ({selectedRole === 'CLIENT' ? 'Aidana' : 'Marat'})
            </Text>

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
              placeholder="Tap boxes above or enter 1234"
              placeholderTextColor={COLORS.mutedText}
            />

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => {
                if (otpCode.length < 4) {
                  handleOtpTap();
                } else {
                  loginWithRole(selectedRole, phone);
                }
              }}
              activeOpacity={0.88}
            >
              <Text style={styles.primaryButtonText}>
                {selectedRole === 'CLIENT' ? 'Enter as Client' : 'Enter as Specialist'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 44,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 28,
  },
  wordmark: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.ink,
    letterSpacing: -0.8,
  },
  tagline: {
    fontSize: 14.5,
    color: COLORS.secondaryText,
    marginTop: 4,
    fontWeight: '500',
  },
  formSection: {
    flex: 1,
  },
  roleSelectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.secondaryText,
    marginBottom: 10,
  },
  roleRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  roleCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    gap: 6,
  },
  roleCardActive: {
    backgroundColor: COLORS.primary,
  },
  roleTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.ink,
    marginTop: 4,
  },
  roleTitleActive: {
    color: COLORS.white,
  },
  roleSub: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.secondaryText,
  },
  roleSubActive: {
    color: 'rgba(255, 255, 255, 0.78)',
  },
  backRow: {
    marginBottom: 20,
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.ink,
    marginBottom: 6,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 14.5,
    color: COLORS.secondaryText,
    marginBottom: 22,
    lineHeight: 20,
  },
  inputContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 54,
    justifyContent: 'center',
    marginBottom: 20,
  },
  phoneInput: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.ink,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  otpRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  otpBox: {
    flex: 1,
    height: 60,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBoxFilled: {
    backgroundColor: COLORS.divider,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  otpDigit: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.ink,
  },
  hiddenOtpInput: {
    height: 44,
    fontSize: 14,
    color: COLORS.secondaryText,
    textAlign: 'center',
    marginBottom: 16,
  },
});
