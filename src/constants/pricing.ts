export const Pricing = {
  bwSingleSided: 0.90,
  bwDoubleSided: 1.50,
  colorSingleSided: 3.00,
  colorDoubleSided: 5.00,
  bindingStaple: 0,
  bindingSpiral: 35,
  deliveryCharge: 40,
  freeDeliveryThreshold: 199,
  pickupCharge: 0,
  coverPageCharge: 5,
};

export const PaperSizes = ['A4', 'A3', 'Letter'] as const;
export type PaperSize = (typeof PaperSizes)[number];

export const PrintTypes = [
  { id: 'single', label: 'Single-sided', description: 'Print on one side only' },
  { id: 'double', label: 'Double-sided', description: 'Print on both sides' },
] as const;
export type PrintType = (typeof PrintTypes)[number]['id'];

export const ColorModes = [
  { id: 'bw', label: 'Black & White', description: 'Starting at ₹0.90/page' },
  { id: 'color', label: 'Color', description: 'Starting at ₹3.00/page' },
] as const;
export type ColorMode = (typeof ColorModes)[number]['id'];

export const BindingOptions = [
  { id: 'none', label: 'No Binding', price: 0 },
  { id: 'staple', label: 'Stapled', price: 0 },
  { id: 'spiral', label: 'Spiral Binding', price: 35 },
] as const;
export type BindingOption = (typeof BindingOptions)[number]['id'];
