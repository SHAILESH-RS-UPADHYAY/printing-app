import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { useOrders, Order } from '../context/OrderContext';
import { formatOrderId } from '../utils/format';
import { formatPrice } from '../services/pricing';

const STATUS_STEPS = ['placed', 'processing', 'printed', 'shipped', 'delivered'] as const;

const STATUS_CONFIG: Record<string, { icon: string; label: string; description: string }> = {
  placed: { icon: 'receipt', label: 'Order Placed', description: 'Your order has been placed' },
  processing: { icon: 'sync', label: 'Processing', description: 'We are preparing your prints' },
  printed: { icon: 'print', label: 'Printing', description: 'Your documents are being printed' },
  shipped: { icon: 'bicycle', label: 'Shipped', description: 'Out for delivery' },
  delivered: { icon: 'checkmark-done', label: 'Delivered', description: 'Order delivered successfully' },
};

export function OrderTrackingScreen({ navigation, route }: any) {
  const { orderId } = route.params || { orderId: '1' };
  const { getOrderById, fetchOrderById } = useOrders();
  const [order, setOrder] = useState<Order | undefined>(() => getOrderById(orderId));
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order) {
      fetchOrderById(orderId).then((result) => {
        if (result) setOrder(result);
        setLoading(false);
      });
    } else {
      fetchOrderById(orderId).then((result) => {
        if (result) setOrder(result);
      });
    }
  }, [orderId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Details</Text>
          <View style={styles.backButton} />
        </View>
        <View style={styles.errorContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Details</Text>
          <View style={styles.backButton} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={Colors.textTertiary} />
          <Text style={styles.errorText}>Order not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentStepIndex = STATUS_STEPS.indexOf(order.status as typeof STATUS_STEPS[number]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{formatOrderId(order.orderId)}</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Order Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusTitle}>
              {STATUS_CONFIG[order.status]?.label || order.status}
            </Text>
            <View style={[styles.statusBadge, {
              backgroundColor: order.status === 'delivered' ? Colors.successLight : Colors.infoLight
            }]}>
              <Text style={[styles.statusBadgeText, {
                color: order.status === 'delivered' ? Colors.success : Colors.info
              }]}>
                {order.status.toUpperCase()}
              </Text>
            </View>
          </View>
          <Text style={styles.statusDescription}>
            {STATUS_CONFIG[order.status]?.description}
          </Text>
        </View>

        {/* Timeline */}
        <View style={styles.timelineContainer}>
          {STATUS_STEPS.map((step, index) => {
            const config = STATUS_CONFIG[step];
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <View key={step} style={styles.timelineStep}>
                <View style={styles.timelineLeft}>
                  <View style={[
                    styles.timelineDot,
                    isCompleted && styles.completedDot,
                    isCurrent && styles.currentDot,
                  ]}>
                    <Ionicons
                      name={config.icon as any}
                      size={16}
                      color={isCompleted ? Colors.white : Colors.textTertiary}
                    />
                  </View>
                  {index < STATUS_STEPS.length - 1 && (
                    <View style={[
                      styles.timelineLine,
                      isCompleted && styles.completedLine,
                    ]} />
                  )}
                </View>
                <View style={styles.timelineContent}>
                  <Text style={[
                    styles.timelineLabel,
                    isCompleted && styles.completedLabel,
                    isCurrent && styles.currentLabel,
                  ]}>
                    {config.label}
                  </Text>
                  <Text style={[
                    styles.timelineDesc,
                    isCompleted && styles.completedDesc,
                  ]}>
                    {config.description}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Order Info */}
        <View style={styles.infoSection}>
          <Text style={styles.infoSectionTitle}>Order Details</Text>

          <View style={styles.infoCard}>
            {order.items.map((item, idx) => (
              <View key={idx} style={styles.infoRow}>
                <Ionicons name="document-text" size={18} color={Colors.textSecondary} />
                <Text style={styles.infoItemName}>{item.fileName}</Text>
                <Text style={styles.infoItemQty}>x{item.quantity}</Text>
              </View>
            ))}
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Total Amount</Text>
              <Text style={styles.infoValue}>{formatPrice(order.total)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Payment</Text>
              <Text style={styles.infoValue}>{order.paymentMethod}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Delivery</Text>
              <Text style={styles.infoValue}>{order.deliveryAddress}</Text>
            </View>
          </View>
        </View>

        {/* Tracking link */}
        {order.status === 'shipped' && (
          <TouchableOpacity style={styles.trackingLink}>
            <Ionicons name="location" size={18} color={Colors.primary} />
            <Text style={styles.trackingLinkText}>Track via courier partner</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.primary} />
          </TouchableOpacity>
        )}
      </ScrollView>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  errorText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  statusCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statusDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  timelineContainer: {
    paddingLeft: 8,
    marginBottom: 24,
  },
  timelineStep: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 40,
  },
  timelineDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  completedDot: {
    backgroundColor: Colors.primary,
  },
  currentDot: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.border,
    marginVertical: -2,
  },
  completedLine: {
    backgroundColor: Colors.primaryLight,
  },
  timelineContent: {
    flex: 1,
    paddingLeft: 12,
    paddingBottom: 24,
  },
  timelineLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textTertiary,
    marginBottom: 2,
  },
  completedLabel: {
    color: Colors.text,
  },
  currentLabel: {
    color: Colors.primary,
    fontWeight: '700',
  },
  timelineDesc: {
    fontSize: 13,
    color: Colors.textTertiary,
  },
  completedDesc: {
    color: Colors.textSecondary,
  },
  infoSection: {
    marginBottom: 20,
  },
  infoSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 8,
  },
  infoItemName: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
  },
  infoItemQty: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  infoDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    flex: 2,
    textAlign: 'right',
  },
  trackingLink: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '10',
    padding: 16,
    borderRadius: 14,
    gap: 8,
    marginBottom: 20,
  },
  trackingLinkText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
});
