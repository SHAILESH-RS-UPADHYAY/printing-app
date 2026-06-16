import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';
import { getProducts } from '../services/api/products';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'planner', label: 'Planners' },
  { id: 'diary', label: 'Diaries' },
  { id: 'notebook', label: 'Notebooks' },
  { id: 'poster', label: 'Posters' },
];

const PRODUCT_ICONS: Record<string, string> = {
  planner: 'calendar',
  diary: 'book',
  notebook: 'create',
  poster: 'image',
};

interface ShopScreenProps {
  navigation: any;
}

export function ShopScreen({ navigation }: ShopScreenProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getProducts(activeCategory !== 'all' ? activeCategory : undefined);
        setProducts(res.products || []);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [activeCategory]);

  const filteredProducts = products;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Stationery Shop</Text>
        <TouchableOpacity style={styles.cartButton}>
          <Ionicons name="cart-outline" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryChip,
                activeCategory === cat.id && styles.activeCategoryChip,
              ]}
              onPress={() => setActiveCategory(cat.id)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  activeCategory === cat.id && styles.activeCategoryChipText,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Products Grid */}
        {loading ? (
          <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
        ) : (
          <View style={styles.productsGrid}>
            {filteredProducts.map((product) => (
              <TouchableOpacity
                key={product._id || product.id}
                style={styles.productCard}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={['#F1F5F9', '#E2E8F0']}
                  style={styles.productImage}
                >
                  <Ionicons
                    name={(PRODUCT_ICONS[product.category] || 'cube') as any}
                    size={36}
                    color={Colors.textTertiary}
                  />
                </LinearGradient>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productPrice}>₹{product.price}</Text>
                </View>
                <TouchableOpacity style={styles.addButton}>
                  <Ionicons name="add-circle" size={28} color={Colors.primary} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
  cartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesContainer: {
    marginTop: 16,
  },
  categoriesContent: {
    paddingHorizontal: 16,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.white,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeCategoryChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  activeCategoryChipText: {
    color: Colors.white,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    marginTop: 8,
  },
  productCard: {
    width: '46%',
    backgroundColor: Colors.white,
    marginHorizontal: '2%',
    marginBottom: 12,
    borderRadius: 14,
    padding: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  productImage: {
    height: 100,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  productInfo: {
    marginBottom: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
    marginTop: 4,
  },
  addButton: {
    alignSelf: 'flex-end',
  },
});
