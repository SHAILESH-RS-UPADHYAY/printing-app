import { Pricing, PrintType, ColorMode, BindingOption } from '../constants/pricing';

interface PriceParams {
  pageCount: number;
  copies: number;
  printType: PrintType;
  colorMode: ColorMode;
  binding: BindingOption;
  coverPage: boolean;
}

export function calculateItemPrice(params: PriceParams): number {
  const {
    pageCount,
    copies,
    printType,
    colorMode,
    binding,
    coverPage,
  } = params;

  const isDoubleSided = printType === 'double';
  const isColor = colorMode === 'color';

  let perPagePrice: number;
  if (isColor) {
    perPagePrice = isDoubleSided ? Pricing.colorDoubleSided : Pricing.colorSingleSided;
  } else {
    perPagePrice = isDoubleSided ? Pricing.bwDoubleSided : Pricing.bwSingleSided;
  }

  const actualPages = isDoubleSided ? Math.ceil(pageCount / 2) : pageCount;
  const printCost = perPagePrice * actualPages * copies;

  let bindingCost = 0;
  if (binding === 'spiral') bindingCost = Pricing.bindingSpiral;
  if (binding === 'staple') bindingCost = Pricing.bindingStaple;

  const coverCost = coverPage ? Pricing.coverPageCharge : 0;

  return printCost + bindingCost + coverCost;
}

export function calculateDeliveryCharge(subtotal: number): number {
  if (subtotal >= Pricing.freeDeliveryThreshold) return 0;
  return Pricing.deliveryCharge;
}

export function formatPrice(amount: number): string {
  return `₹${amount.toFixed(2)}`;
}
