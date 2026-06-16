import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { useOrders, Order } from '../context/OrderContext';

const STATUS_TABS = [
  { id: 'all', label: 'All' },
  { id: 'processing', label: 'Processing' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'delivered', label: 'Delivered' },
] as const;

const STATUS_COLORS: Record<Order['status'], { bg: string; text: string }> = {
  placed: { bg: Colors.warningLight, text: Colors.warning },
  processing: { bg: Colors.infoLight, text: Colors.info },
  printed: { bg: Colors.infoLight, text: Colors.info },
  shipped: { bg: Colors.infoLight, text: Colors.info },
  delivered: { bg: Colors.successLight, text: Colors.success },
};

interface MyOrdersScreenProps {
  navigation: any;
}

export function MyOrdersScreen({ navigation }: MyOrdersScreenProps) {
  const { orders, fetchOrders } = useOrders();
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchOrders(activeTab !== 'all' ? activeTab : undefined);
  }, [activeTab]);

  const filteredOrders = orders;

  const renderOrder = ({ item }: { item: Order }) => {
    const statusStyle = STATUS_COLORS[item.status];
    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() => navigation.navigate('OrderTracking', { orderId: item.id })}
        activeOpacity={0.7}
      >
        <View style={styles.orderHeader}>
          <Text style={styles.orderId}>{item.orderId}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>
        <Text style={styles.orderDate}>{item.createdAt} • {item.items.length} item(s)</Text>
        <View style={styles.orderFooter}>
          <Text style={styles.orderTotal}>₹{item.total.toFixed(2)}</Text>
          {item.status === 'shipped' && (
            <TouchableOpacity style={styles.trackBtn}>
              <Text style={styles.trackBtnText}>Track</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>

      <View style={styles.tabsContainer}>
        <FlatList
          horizontal
          data={STATUS_TABS}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === item.id && styles.activeTab,
              ]}
              onPress={() => setActiveTab(item.id)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === item.id && styles.activeTabText,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={filteredOrders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={64} color={Colors.textTertiary} />
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptySubtitle}>Start printing to see your orders here</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
  },
  tabsContainer: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  tabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: Colors.surfaceAlt,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.white,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  orderCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderId: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderDate: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  trackBtn: {
    backgroundColor: Colors.primary + '10',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  trackBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 6,
  },
});
