import React from 'react';
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
import { Button } from '../components/common/Button';
import { useCart } from '../context/CartContext';
import { calculateDeliveryCharge, formatPrice } from '../services/pricing';

export function CartScreen({ navigation }: any) {
  const { state, removeItem, subtotal } = useCart();
  const deliveryCharge = calculateDeliveryCharge(subtotal);
  const total = subtotal + deliveryCharge - state.discount;

  const renderItem = ({ item }: any) => (
    <View style={styles.cartItem}>
      <View style={styles.itemIcon}>
        <Ionicons name="document-text" size={22} color={Colors.primary} />
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.document.fileName}</Text>
        <Text style={styles.itemDetails}>
          {item.settings.printType === 'double' ? 'Double-sided' : 'Single-sided'} •{' '}
          {item.settings.colorMode === 'color' ? 'Color' : 'B&W'} • {item.settings.copies} cop{item.settings.copies > 1 ? 'ies' : 'y'}
        </Text>
        {item.settings.binding !== 'none' && (
          <Text style={styles.itemBinding}>
            Binding: {item.settings.binding === 'spiral' ? 'Spiral' : 'Stapled'}
          </Text>
        )}
      </View>
      <View style={styles.itemRight}>
        <Text style={styles.itemPrice}>{formatPrice(item.subtotal)}</Text>
        <TouchableOpacity onPress={() => removeItem(item.id)}>
          <Ionicons name="trash-outline" size={18} color={Colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <Ionicons name="cart-outline" size={64} color={Colors.textTertiary} />
      </View>
      <Text style={styles.emptyTitle}>Your cart is empty</Text>
      <Text style={styles.emptySubtitle}>Add documents to start printing</Text>
      <Button
        title="Upload Documents"
        onPress={() => navigation.navigate('Upload')}
        variant="outline"
        size="medium"
        style={styles.emptyButton}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cart</Text>
        <View style={styles.backButton} />
      </View>

      {state.items.length === 0 ? (
        renderEmptyCart()
      ) : (
        <>
          <FlatList
            data={state.items}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
          />

          {/* Coupon Section */}
          <View style={styles.couponSection}>
            <Ionicons name="pricetag-outline" size={18} color={Colors.textSecondary} />
            <Text style={styles.couponPlaceholder}>Have a coupon code?</Text>
            <TouchableOpacity>
              <Text style={styles.couponApply}>Apply</Text>
            </TouchableOpacity>
          </View>

          {/* Price Breakdown */}
          <View style={styles.priceBreakdown}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Subtotal</Text>
              <Text style={styles.priceValue}>{formatPrice(subtotal)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>
                Delivery{deliveryCharge === 0 ? ' (Free)' : ''}
              </Text>
              <Text style={[styles.priceValue, deliveryCharge === 0 && styles.freeText]}>
                {deliveryCharge === 0 ? 'FREE' : formatPrice(deliveryCharge)}
              </Text>
            </View>
            <View style={[styles.priceRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>{formatPrice(total)}</Text>
            </View>
          </View>

          <View style={styles.bottomBar}>
            <View style={styles.bottomTotal}>
              <Text style={styles.bottomTotalLabel}>Total</Text>
              <Text style={styles.bottomTotalAmount}>{formatPrice(total)}</Text>
            </View>
            <Button
              title="Proceed to Checkout"
              onPress={() => navigation.navigate('Delivery')}
              size="large"
              style={styles.checkoutButton}
            />
          </View>
        </>
      )}
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
  listContent: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  itemIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: Colors.primary + '12',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  itemDetails: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  itemBinding: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 1,
  },
  itemRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  emptyButton: {
    paddingHorizontal: 32,
  },
  couponSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  couponPlaceholder: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 10,
  },
  couponApply: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  priceBreakdown: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  priceLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  freeText: {
    color: Colors.success,
    fontWeight: '700',
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
  checkoutButton: {
    flex: 1,
  },
});
