export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  MainTabs: undefined;
  PhoneAuth: undefined;
  PrintCustomization: { documentId: string };
  Cart: undefined;
  Delivery: undefined;
  Payment: undefined;
  OrderConfirmation: { orderId: string };
  OrderTracking: { orderId: string };
  ProductDetail: { productId: string };
  AddressForm: { addressId?: string };
  Shop: undefined;
};

export type TabParamList = {
  Home: undefined;
  Upload: undefined;
  ShopTab: undefined;
  Orders: undefined;
  Profile: undefined;
};
