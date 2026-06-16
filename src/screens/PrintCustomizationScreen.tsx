import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Button } from '../components/common/Button';
import { OptionSelector } from '../components/print/OptionSelector';
import { Stepper } from '../components/print/Stepper';
import { calculateItemPrice, formatPrice } from '../services/pricing';
import { useCart } from '../context/CartContext';
import { PrintType, ColorMode, BindingOption } from '../constants/pricing';

export function PrintCustomizationScreen({ navigation, route }: any) {
  const { addItem } = useCart();
  const document = route.params?.document || {
    id: 'doc-1',
    name: 'Notes.pdf',
    fileName: 'Notes.pdf',
    pageCount: 24,
    fileSize: 2450000,
    fileUri: 'file://mock',
    uri: 'file://mock',
  };
  const currentDoc = {
    id: document.id,
    fileName: document.fileName || document.name || 'Document',
    pageCount: document.pageCount || 10,
    fileSize: document.fileSize || 0,
    fileUri: document.uri || document.fileUri || '',
  };

  const [printType, setPrintType] = useState<PrintType>('single');
  const [colorMode, setColorMode] = useState<ColorMode>('bw');
  const [paperSize, setPaperSize] = useState<'A4' | 'A3' | 'Letter'>('A4');
  const [copies, setCopies] = useState(1);
  const [binding, setBinding] = useState<BindingOption>('none');
  const [coverPage, setCoverPage] = useState(false);

  const subtotal = useMemo(
    () =>
      calculateItemPrice({
        pageCount: currentDoc.pageCount,
        copies,
        printType,
        colorMode,
        binding,
        coverPage,
      }),
    [currentDoc.pageCount, copies, printType, colorMode, binding, coverPage]
  );

  const perPagePrice = colorMode === 'color'
    ? (printType === 'double' ? 5.00 : 3.00)
    : (printType === 'double' ? 1.50 : 0.90);

  const effectivePages = printType === 'double'
    ? Math.ceil(currentDoc.pageCount / 2)
    : currentDoc.pageCount;

  const handleAddToCart = () => {
    addItem(
      {
        id: currentDoc.id,
        fileName: currentDoc.fileName,
        fileUri: currentDoc.fileUri,
        pageCount: currentDoc.pageCount,
        fileSize: currentDoc.fileSize,
      },
      {
        printType,
        colorMode,
        paperSize,
        copies,
        pageRange: 'all',
        binding,
        coverPage,
      },
      subtotal
    );
    navigation.navigate('Cart');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.fileIconSmall}>
            <Ionicons name="document-text" size={20} color={Colors.primary} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Print Settings</Text>
            <Text style={styles.fileName}>{currentDoc.fileName}</Text>
          </View>
        </View>
        <View style={styles.pageBadge}>
            <Text style={styles.pageBadgeText}>{currentDoc.pageCount} pages</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Price Preview Card */}
        <View style={styles.pricePreview}>
          <Text style={styles.pricePerPage}>
            ₹{perPagePrice.toFixed(2)} / page ({printType === 'double' ? 'both sides' : 'single side'})
          </Text>
          <Text style={styles.effectivePages}>
            {effectivePages} effective page{effectivePages > 1 ? 's' : ''} × {copies} cop{copies > 1 ? 'ies' : 'y'}
          </Text>
        </View>

        {/* Print Type */}
        <OptionSelector
          title="Print Type"
          icon="copy-outline"
          options={[
            { id: 'single', label: 'Single-sided', description: 'Print on one side' },
            { id: 'double', label: 'Double-sided', description: 'Print on both sides' },
          ]}
          selectedId={printType}
          onSelect={(id) => setPrintType(id as PrintType)}
        />

        {/* Color */}
        <OptionSelector
          title="Color Mode"
          icon="color-palette-outline"
          options={[
            { id: 'bw', label: 'Black & White', description: '₹0.90/page' },
            { id: 'color', label: 'Color', description: '₹3.00/page' },
          ]}
          selectedId={colorMode}
          onSelect={(id) => setColorMode(id as ColorMode)}
        />

        {/* Paper Size */}
        <OptionSelector
          title="Paper Size"
          icon="expand-outline"
          options={[
            { id: 'A4', label: 'A4' },
            { id: 'A3', label: 'A3' },
            { id: 'Letter', label: 'Letter' },
          ]}
          selectedId={paperSize}
          onSelect={(id) => setPaperSize(id as 'A4' | 'A3' | 'Letter')}
        />

        {/* Copies */}
        <Stepper label="Copies" value={copies} min={1} max={99} onChange={setCopies} />

        {/* Binding */}
        <OptionSelector
          title="Binding"
          icon="book-outline"
          options={[
            { id: 'none', label: 'None', description: 'No binding' },
            { id: 'staple', label: 'Stapled', description: 'Free' },
            { id: 'spiral', label: 'Spiral', description: '₹35' },
          ]}
          selectedId={binding}
          onSelect={(id) => setBinding(id as BindingOption)}
        />

        {/* Cover Page Toggle */}
        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Ionicons name="heart-outline" size={20} color={Colors.textSecondary} />
            <View style={styles.toggleText}>
              <Text style={styles.toggleLabel}>Motivational Cover Page</Text>
              <Text style={styles.toggleDesc}>Personalized with your name (+₹5)</Text>
            </View>
          </View>
          <Switch
            value={coverPage}
            onValueChange={setCoverPage}
            trackColor={{ false: Colors.border, true: Colors.primaryLight }}
            thumbColor={coverPage ? Colors.primary : Colors.textTertiary}
          />
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>{formatPrice(subtotal)}</Text>
          {binding === 'spiral' && (
            <Text style={styles.includeBinding}>Includes spiral binding</Text>
          )}
        </View>
        <Button
          title="Add to Cart"
          onPress={handleAddToCart}
          size="large"
          style={styles.addToCartButton}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileIconSmall: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.primary + '12',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },
  fileName: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  pageBadge: {
    backgroundColor: Colors.surfaceAlt,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  pageBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  pricePreview: {
    backgroundColor: Colors.primary + '08',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.primary + '15',
  },
  pricePerPage: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  effectivePages: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
  },
  toggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  toggleText: {
    marginLeft: 10,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  toggleDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
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
  totalSection: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.text,
  },
  includeBinding: {
    fontSize: 11,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  addToCartButton: {
    flex: 1,
  },
});
