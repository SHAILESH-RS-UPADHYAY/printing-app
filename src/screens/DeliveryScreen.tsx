import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Button } from '../components/common/Button';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { calculateDeliveryCharge, formatPrice } from '../services/pricing';

export function DeliveryScreen({ navigation }: any) {
  const { subtotal } = useCart();
  const { user } = useAuth();
  const [mode, setMode] = useState<'delivery' | 'pickup'>('delivery');
  const deliveryCharge = calculateDeliveryCharge(subtotal);
  const total = subtotal + deliveryCharge;

  const [form, setForm] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
  });

  const updateForm = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleContinue = () => {
    if (mode === 'delivery') {
      if (!form.fullName || !form.phone || !form.address || !form.city || !form.state || !form.pincode) {
        Alert.alert('Missing Fields', 'Please fill in all required fields');
        return;
      }
    }
    navigation.navigate('Payment', {
      deliveryAddress: mode === 'delivery' ? form : null,
      deliveryMode: mode,
    });
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
          <Text style={styles.headerTitle}>Delivery Details</Text>
          <View style={styles.backButton} />
        </View>

        {/* Mode Toggle */}
        <View style={styles.modeToggle}>
          <TouchableOpacity
            style={[styles.modeOption, mode === 'delivery' && styles.activeMode]}
            onPress={() => setMode('delivery')}
          >
            <Ionicons
              name="bicycle"
              size={20}
              color={mode === 'delivery' ? Colors.white : Colors.textSecondary}
            />
            <Text style={[styles.modeText, mode === 'delivery' && styles.activeModeText]}>
              Delivery
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeOption, mode === 'pickup' && styles.activeMode]}
            onPress={() => setMode('pickup')}
          >
            <Ionicons
              name="walk"
              size={20}
              color={mode === 'pickup' ? Colors.white : Colors.textSecondary}
            />
            <Text style={[styles.modeText, mode === 'pickup' && styles.activeModeText]}>
              Pickup
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {mode === 'delivery' ? (
            <>
              <View style={styles.deliveryInfo}>
                <Ionicons name="information-circle" size={18} color={Colors.info} />
                <Text style={styles.deliveryInfoText}>
                  Free delivery on orders above ₹199. Currently {formatPrice(deliveryCharge)} charge.
                </Text>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Full Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  value={form.fullName}
                  onChangeText={(v) => updateForm('fullName', v)}
                  placeholderTextColor={Colors.textTertiary}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Phone Number *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="10-digit mobile number"
                  value={form.phone}
                  onChangeText={(v) => updateForm('phone', v)}
                  keyboardType="phone-pad"
                  maxLength={10}
                  placeholderTextColor={Colors.textTertiary}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Address *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="House/Flat no., Street, Area"
                  value={form.address}
                  onChangeText={(v) => updateForm('address', v)}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  placeholderTextColor={Colors.textTertiary}
                />
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>City *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="City"
                    value={form.city}
                    onChangeText={(v) => updateForm('city', v)}
                    placeholderTextColor={Colors.textTertiary}
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>State *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="State"
                    value={form.state}
                    onChangeText={(v) => updateForm('state', v)}
                    placeholderTextColor={Colors.textTertiary}
                  />
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Pincode *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="6-digit pincode"
                    value={form.pincode}
                    onChangeText={(v) => updateForm('pincode', v)}
                    keyboardType="number-pad"
                    maxLength={6}
                    placeholderTextColor={Colors.textTertiary}
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Landmark</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Near..."
                    value={form.landmark}
                    onChangeText={(v) => updateForm('landmark', v)}
                    placeholderTextColor={Colors.textTertiary}
                  />
                </View>
              </View>
            </>
          ) : (
            <View style={styles.pickupInfo}>
              <View style={styles.pickupIcon}>
                <Ionicons name="storefront" size={48} color={Colors.primary} />
              </View>
              <Text style={styles.pickupTitle}>Pickup from our outlet</Text>
              <Text style={styles.pickupDesc}>
                Place your order and pick it up from our nearest outlet within 2-4 hours. No delivery charges!
              </Text>
              <View style={styles.pickupAddress}>
                <Ionicons name="location" size={18} color={Colors.primary} />
                <Text style={styles.pickupAddrText}>
                  Bypass Road, Sitapur, Haridwar, Uttarakhand 249407
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.bottomBar}>
          <View style={styles.bottomTotal}>
            <Text style={styles.bottomTotalLabel}>Total</Text>
            <Text style={styles.bottomTotalAmount}>{formatPrice(total)}</Text>
          </View>
          <Button
            title="Continue to Payment"
            onPress={handleContinue}
            size="large"
            style={styles.paymentButton}
          />
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
  modeToggle: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 12,
    padding: 4,
  },
  modeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  activeMode: {
    backgroundColor: Colors.primary,
  },
  modeText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  activeModeText: {
    color: Colors.white,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.infoLight,
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    gap: 8,
  },
  deliveryInfoText: {
    fontSize: 13,
    color: Colors.info,
    flex: 1,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.text,
  },
  textArea: {
    minHeight: 80,
    paddingTop: 14,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  pickupInfo: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  pickupIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary + '12',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  pickupTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  pickupDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  pickupAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 14,
    borderRadius: 12,
    gap: 8,
    width: '100%',
  },
  pickupAddrText: {
    fontSize: 13,
    color: Colors.text,
    flex: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 12,
  },
  bottomTotal: {
    alignItems: 'flex-end',
  },
  bottomTotalLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  bottomTotalAmount: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.text,
  },
  paymentButton: {
    flex: 1,
  },
});
