import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { getUserOrders } from '../services/api/orders';

interface HomeScreenProps {
  navigation: any;
}

interface QuickAction {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  gradient: [string, string];
  screen: string;
}

const quickActions: QuickAction[] = [
  {
    id: '1',
    icon: 'document-text',
    title: 'Upload & Print',
    description: 'Start printing your documents',
    gradient: ['#4F46E5', '#7C3AED'],
    screen: 'Upload',
  },
  {
    id: '2',
    icon: 'cube',
    title: 'Track Order',
    description: 'Know your delivery status',
    gradient: ['#06B6D4', '#0891B2'],
    screen: 'Orders',
  },
  {
    id: '3',
    icon: 'storefront',
    title: 'Shop Stationery',
    description: 'Planners, diaries & more',
    gradient: ['#F59E0B', '#D97706'],
    screen: 'ShopTab',
  },
  {
    id: '4',
    icon: 'receipt',
    title: 'My Orders',
    description: 'View order history',
    gradient: ['#10B981', '#059669'],
    screen: 'Orders',
  },
];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  placed: { bg: '#FEF3C7', text: '#D97706' },
  processing: { bg: '#DBEAFE', text: '#2563EB' },
  printed: { bg: '#DBEAFE', text: '#2563EB' },
  shipped: { bg: '#DBEAFE', text: '#2563EB' },
  delivered: { bg: '#D1FAE5', text: '#059669' },
};

const STATUS_LABELS: Record<string, string> = {
  placed: 'Placed',
  processing: 'Processing',
  printed: 'Printed',
  shipped: 'Shipped',
  delivered: 'Delivered',
};

export function HomeScreen({ navigation }: HomeScreenProps) {
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getUserOrders();
        setRecentOrders((res.orders || []).slice(0, 3));
      } catch {
        // silent
      } finally {
        setOrdersLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoSmall}>
              <Ionicons name="print" size={22} color={Colors.primary} />
            </View>
            <Text style={styles.headerTitle}>PrintClient</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={24} color={Colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('Cart')}
            >
              <Ionicons name="cart-outline" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Banner */}
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroBanner}
        >
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Print starting at</Text>
            <Text style={styles.heroPrice}>₹0.90/page</Text>
            <Text style={styles.heroSubtitle}>Free delivery on orders above ₹199</Text>
            <TouchableOpacity
              style={styles.heroButton}
              onPress={() => navigation.navigate('Upload')}
            >
              <Text style={styles.heroButtonText}>Order Now</Text>
              <Ionicons name="arrow-forward" size={18} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.heroGraphic}>
            <Ionicons name="print" size={80} color="rgba(255,255,255,0.15)" />
          </View>
        </LinearGradient>

        {/* Quick Actions Grid */}
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionCard}
              onPress={() => {
                const tabName = action.screen as any;
                const parentNav = navigation.getParent();
                if (parentNav) {
                  parentNav.navigate(tabName);
                }
              }}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={action.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionGradient}
              >
                <Ionicons name={action.icon} size={28} color={Colors.white} />
              </LinearGradient>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionDescription}>{action.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Features Strip */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Why Choose Us</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              { icon: 'wallet', label: 'Lowest Prices' },
              { icon: 'rocket', label: 'Free Delivery' },
              { icon: 'shield-checkmark', label: 'Quality Print' },
              { icon: 'timer', label: 'Fast Turnaround' },
              { icon: 'walk', label: 'Free Pickup' },
            ].map((feature, index) => (
              <View key={index} style={styles.featurePill}>
                <Ionicons name={feature.icon as any} size={18} color={Colors.primary} />
                <Text style={styles.featurePillText}>{feature.label}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Recent Orders */}
        <View style={styles.recentOrdersSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {ordersLoading ? (
            <ActivityIndicator color={Colors.primary} style={{ padding: 20 }} />
          ) : recentOrders.length === 0 ? (
            <View style={styles.orderCard}>
              <Text style={{ color: Colors.textSecondary, textAlign: 'center', padding: 20 }}>
                No orders yet. Start printing!
              </Text>
            </View>
          ) : (
            recentOrders.map((order: any) => {
              const statusKey = order.status || 'placed';
              const sc = STATUS_COLORS[statusKey] || STATUS_COLORS.placed;
              const orderId = order.orderId || `#PRINT${String(order._id || '').slice(-6).padStart(6, '0')}`;
              return (
                <View key={order._id || order.id} style={styles.orderCard}>
                  <View style={styles.orderCardHeader}>
                    <Text style={styles.orderId}>{orderId}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
                      <Text style={[styles.statusText, { color: sc.text }]}>
                        {STATUS_LABELS[statusKey] || statusKey}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.orderDate}>
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : ''} • {(order.items || []).length} item(s)
                  </Text>
                  <View style={styles.orderCardFooter}>
                    <Text style={styles.orderTotal}>₹{(order.total || 0).toFixed(2)}</Text>
                    <TouchableOpacity
                      style={styles.trackButton}
                      onPress={() => navigation.navigate('OrderTracking', { orderId: order._id || order.id })}
                    >
                      <Text style={styles.trackButtonText}>Track</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoSmall: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  heroBanner: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  heroContent: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },
  heroPrice: {
    fontSize: 36,
    fontWeight: '900',
    color: Colors.white,
    marginTop: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 6,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginTop: 16,
  },
  heroButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
    marginRight: 6,
  },
  heroGraphic: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    marginTop: 16,
  },
  actionCard: {
    width: '46%',
    backgroundColor: Colors.white,
    marginHorizontal: '2%',
    marginBottom: 12,
    borderRadius: 14,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  actionGradient: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  featuresSection: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  featurePillText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },
  recentOrdersSection: {
    marginTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  orderCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  orderCardHeader: {
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
    backgroundColor: Colors.infoLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.info,
  },
  orderDate: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  orderCardFooter: {
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
  trackButton: {
    backgroundColor: Colors.primary + '10',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  trackButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
});
