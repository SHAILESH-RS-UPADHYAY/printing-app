import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';
import { Button } from '../components/common/Button';
import { formatOrderId } from '../utils/format';

export function OrderConfirmationScreen({ navigation, route }: any) {
  const { orderId } = route.params || { orderId: '1' };
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.successIcon,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <LinearGradient
            colors={[Colors.success, '#059669']}
            style={styles.successCircle}
          >
            <Ionicons name="checkmark" size={48} color={Colors.white} />
          </LinearGradient>
        </Animated.View>

        <Animated.View style={{ opacity: opacityAnim, alignItems: 'center' }}>
          <Text style={styles.title}>Order Placed!</Text>
          <Text style={styles.subtitle}>Your order has been placed successfully.</Text>

          <View style={styles.orderInfoCard}>
            <Text style={styles.orderInfoLabel}>Order ID</Text>
            <Text style={styles.orderInfoValue}>{formatOrderId(orderId)}</Text>
            <View style={styles.divider} />
            <Text style={styles.orderInfoLabel}>Estimated Delivery</Text>
            <Text style={styles.orderInfoValue}>2-4 business days</Text>
            <View style={styles.divider} />
            <Text style={styles.orderInfoLabel}>Payment</Text>
            <Text style={styles.orderInfoValue}>UPI • Paid</Text>
          </View>

          <View style={styles.deliveryNote}>
            <Ionicons name="information-circle" size={18} color={Colors.info} />
            <Text style={styles.deliveryNoteText}>
              You'll receive SMS updates on your order status and tracking link once shipped.
            </Text>
          </View>
        </Animated.View>
      </View>

      <View style={styles.bottomBar}>
        <Button
          title="Track Order"
          onPress={() => {
            navigation.navigate('OrderTracking', { orderId });
          }}
          variant="outline"
          size="large"
          style={styles.trackButton}
        />
        <Button
          title="Continue Shopping"
          onPress={() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'MainTabs' }],
            });
          }}
          size="large"
          style={styles.continueButton}
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  successIcon: {
    marginBottom: 24,
  },
  successCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  orderInfoCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  orderInfoLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  orderInfoValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 10,
  },
  deliveryNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.infoLight,
    padding: 14,
    borderRadius: 12,
    gap: 10,
    width: '100%',
  },
  deliveryNoteText: {
    fontSize: 13,
    color: Colors.info,
    flex: 1,
    lineHeight: 18,
  },
  bottomBar: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 10,
  },
  trackButton: {
    width: '100%',
  },
  continueButton: {
    width: '100%',
  },
});
