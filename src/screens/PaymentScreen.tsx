import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Button } from '../components/common/Button';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { calculateDeliveryCharge, formatPrice } from '../services/pricing';
import { createOrder } from '../services/api/orders';
import { createPaymentOrder, verifyPayment } from '../services/api/payment';

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', icon: 'phone-portrait', description: 'GPay, PhonePe, Paytm' },
  { id: 'card', label: 'Card', icon: 'card', description: 'Credit / Debit' },
  { id: 'netbanking', label: 'Net Banking', icon: 'business', description: 'All banks' },
  { id: 'cod', label: 'Cash on Delivery', icon: 'cash', description: 'Pay when delivered' },
] as const;

let RazorpayCheckout: any = null;

try {
  RazorpayCheckout = require('react-native-razorpay').default;
} catch {}

export function PaymentScreen({ navigation, route }: any) {
  const { state, subtotal, clearCart } = useCart();
  const { isLoggedIn } = useAuth();
  const deliveryAddress = route.params?.deliveryAddress;
  const deliveryMode = route.params?.deliveryMode || 'delivery';

  const [selectedMethod, setSelectedMethod] = useState<string>('upi');
  const [processing, setProcessing] = useState(false);

  const deliveryCharge = calculateDeliveryCharge(subtotal);
  const total = subtotal + deliveryCharge - state.discount;

  const handlePlaceOrder = async () => {
    if (!isLoggedIn) {
      Alert.alert('Sign In Required', 'Please sign in to place an order');
      return;
    }

    if (!deliveryAddress && deliveryMode === 'delivery') {
      Alert.alert('Delivery Address', 'Please provide a delivery address');
      return;
    }

    setProcessing(true);
    try {
      const orderPayload = {
        items: state.items.map((item) => ({
          document: item.document.fileUri,
          fileName: item.document.fileName,
          pageCount: item.document.pageCount,
          copies: item.settings.copies,
          settings: item.settings,
          price: item.subtotal,
        })),
        deliveryAddress: deliveryAddress || {
          address: 'Store pickup',
          city: '',
          state: '',
          pincode: '',
        },
        deliveryMode,
        paymentMethod: selectedMethod,
        subtotal,
        deliveryCharge,
        discount: state.discount,
        total,
      };

      const orderResponse = await createOrder(orderPayload);
      const backendOrderId = orderResponse.order?._id || orderResponse.orderId;

      if (selectedMethod === 'cod') {
        clearCart();
        navigation.reset({
          index: 0,
          routes: [
            { name: 'MainTabs' },
            {
              name: 'OrderConfirmation',
              params: { orderId: backendOrderId },
            },
          ],
        });
        return;
      }

      if (RazorpayCheckout) {
        const paymentOrder = await createPaymentOrder(backendOrderId);
        const razorpayOrderId = paymentOrder.razorpayOrderId || paymentOrder.id;

        const options: any = {
          key: paymentOrder.key || 'rzp_test_xxxxxxxxxxxx',
          amount: paymentOrder.amount || total * 100,
          currency: 'INR',
          name: 'PrintClient',
          description: `Order ${backendOrderId}`,
          order_id: razorpayOrderId,
          prefill: {
            contact: '',
            email: '',
          },
          theme: { color: Colors.primary },
        };

        const razorpayResult = await RazorpayCheckout.open(options);

        await verifyPayment({
          razorpay_order_id: razorpayResult.razorpay_order_id,
          razorpay_payment_id: razorpayResult.razorpay_payment_id,
          razorpay_signature: razorpayResult.razorpay_signature,
          orderId: backendOrderId,
        });

        clearCart();
        navigation.reset({
          index: 0,
          routes: [
            { name: 'MainTabs' },
            {
              name: 'OrderConfirmation',
              params: { orderId: backendOrderId },
            },
          ],
        });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        clearCart();
        navigation.reset({
          index: 0,
          routes: [
            { name: 'MainTabs' },
            {
              name: 'OrderConfirmation',
              params: { orderId: backendOrderId },
            },
          ],
        });
      }
    } catch (e: any) {
      Alert.alert('Order Failed', e.message || 'Could not process order');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.content}>
        {/* Order Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          {state.items.map((item) => (
            <View key={item.id} style={styles.summaryRow}>
              <Text style={styles.summaryItemName} numberOfLines={1}>
                {item.document.fileName}
              </Text>
              <Text style={styles.summaryItemPrice}>{formatPrice(item.subtotal)}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Delivery{deliveryCharge === 0 ? ' (Free)' : ''}
            </Text>
            <Text style={[styles.summaryValue, deliveryCharge === 0 && { color: Colors.success }]}>
              {deliveryCharge === 0 ? 'FREE' : formatPrice(deliveryCharge)}
            </Text>
          </View>
          {state.discount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount</Text>
              <Text style={[styles.summaryValue, { color: Colors.success }]}>
                -{formatPrice(state.discount)}
              </Text>
            </View>
          )}
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>{formatPrice(total)}</Text>
          </View>
        </View>

        {/* Payment Methods */}
        <Text style={styles.sectionTitle}>Payment Method</Text>
        {PAYMENT_METHODS.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.paymentOption,
              selectedMethod === method.id && styles.selectedPayment,
            ]}
            onPress={() => setSelectedMethod(method.id)}
          >
            <View style={styles.paymentLeft}>
              <View style={[
                styles.paymentIcon,
                selectedMethod === method.id && styles.selectedPaymentIcon,
              ]}>
                <Ionicons
                  name={method.icon as any}
                  size={22}
                  color={selectedMethod === method.id ? Colors.white : Colors.textSecondary}
                />
              </View>
              <View>
                <Text style={styles.paymentLabel}>{method.label}</Text>
                <Text style={styles.paymentDesc}>{method.description}</Text>
              </View>
            </View>
            <View style={[
              styles.radio,
              selectedMethod === method.id && styles.selectedRadio,
            ]}>
              {selectedMethod === method.id && (
                <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.bottomBar}>
        <View style={styles.bottomTotal}>
          <Text style={styles.bottomLabel}>Total</Text>
          <Text style={styles.bottomAmount}>{formatPrice(total)}</Text>
        </View>
        <Button
          title={processing ? 'Processing...' : 'Place Order'}
          onPress={handlePlaceOrder}
          size="large"
          loading={processing}
          style={styles.placeOrderButton}
        />
      </View>
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
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  summaryItemName: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
    marginRight: 12,
  },
  summaryItemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    marginTop: 6,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.text,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  paymentOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  selectedPayment: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '08',
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedPaymentIcon: {
    backgroundColor: Colors.primary,
  },
  paymentLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  paymentDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  radio: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRadio: {},
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
  bottomLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  bottomAmount: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.text,
  },
  placeOrderButton: {
    flex: 1,
  },
});
