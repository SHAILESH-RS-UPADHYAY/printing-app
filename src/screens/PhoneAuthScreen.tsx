import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { useAuth } from '../context/AuthContext';

export function PhoneAuthScreen({ navigation }: any) {
  const { login, verifyOtp } = useAuth();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const otpRef = useRef<TextInput>(null);

  const handleSendOtp = async () => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      setError('Enter a valid 10-digit phone number');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(cleaned);
      setStep('otp');
      setTimeout(() => otpRef.current?.focus(), 300);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 4) {
      setError('Enter the OTP');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const success = await verifyOtp(otp);
      if (success) {
        navigation.goBack();
      } else {
        setError('Verification failed');
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {step === 'phone' ? 'Sign In' : 'Verify OTP'}
          </Text>
          <View style={styles.backButton} />
        </View>

        <View style={styles.content}>
          {step === 'phone' ? (
            <>
              <View style={styles.illustration}>
                <Ionicons name="phone-portrait-outline" size={64} color={Colors.primary} />
              </View>
              <Text style={styles.title}>Enter your phone number</Text>
              <Text style={styles.subtitle}>
                We'll send you a one-time password to verify
              </Text>

              <View style={styles.phoneInput}>
                <Text style={styles.countryCode}>+91</Text>
                <TextInput
                  style={styles.phoneField}
                  placeholder="9999999999"
                  value={phone}
                  onChangeText={(v) => {
                    setPhone(v.replace(/\D/g, '').slice(0, 10));
                    setError('');
                  }}
                  keyboardType="phone-pad"
                  maxLength={10}
                  placeholderTextColor={Colors.textTertiary}
                  editable={!loading}
                />
              </View>
            </>
          ) : (
            <>
              <View style={styles.illustration}>
                <Ionicons name="lock-closed-outline" size={64} color={Colors.primary} />
              </View>
              <Text style={styles.title}>Enter OTP</Text>
              <Text style={styles.subtitle}>
                Sent to +91 {phone}
              </Text>

              <TextInput
                ref={otpRef}
                style={styles.otpInput}
                placeholder="Enter OTP"
                value={otp}
                onChangeText={(v) => {
                  setOtp(v.replace(/\D/g, ''));
                  setError('');
                }}
                keyboardType="number-pad"
                maxLength={6}
                placeholderTextColor={Colors.textTertiary}
                editable={!loading}
              />
            </>
          )}

          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={16} color={Colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={step === 'phone' ? handleSendOtp : handleVerifyOtp}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.primaryButtonText}>
                {step === 'phone' ? 'Send OTP' : 'Verify & Sign In'}
              </Text>
            )}
          </TouchableOpacity>

          {step === 'otp' && (
            <TouchableOpacity
              style={styles.resendButton}
              onPress={() => {
                setOtp('');
                setStep('phone');
                setError('');
              }}
            >
              <Text style={styles.resendText}>Change phone number</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  illustration: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  phoneInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  phoneField: {
    flex: 1,
    fontSize: 18,
    color: Colors.text,
    paddingVertical: 16,
    paddingLeft: 12,
  },
  otpInput: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 20,
    color: Colors.text,
    textAlign: 'center',
    letterSpacing: 8,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.errorLight,
    padding: 12,
    borderRadius: 10,
    marginTop: 16,
    gap: 8,
  },
  errorText: {
    fontSize: 13,
    color: Colors.error,
    flex: 1,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 16,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.white,
  },
  resendButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  resendText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
});
