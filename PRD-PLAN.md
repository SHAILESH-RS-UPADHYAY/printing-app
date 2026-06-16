# Print Client App — Product Requirements & Project Plan

## 1. Reference App Analysis

### The Print Station (com.freeprintstation.application)
- **Founder**: Aman Chauhan (Dehradun, Uttarakhand)
- **Launched**: December 2019, relaunched February 2021
- **Users**: 80,000+ customers across India
- **Pages Printed**: 50 lakh+ (5 million)
- **Rating**: 4.2★ (1.04K reviews)
- **Pricing**: ₹0.90/page (B&W), free delivery > ₹199
- **Delivery Partners**: DTDC, Ekart, Amazon Shipping
- **Team**: 30+ employees

### Brand Identity (to replicate in own style)
- **Name**: Original: "The Print Station" — Client will need own brand name
- **Logo style**: Clean, modern print-themed icon
- **Color scheme**: Likely blue/purple gradient (based on app icon)
- **Tagline style**: "Print Documents with Ease" / "Inspiring success one page at a time"

---

## 2. Complete Screen-by-Screen Flow

### Screen 1: Splash Screen
- App logo centered
- Brand name below
- Loading indicator
- Auto-navigates after 2-3 seconds

### Screen 2: Onboarding (first-time users only)
- 3 slides with illustrations:
  1. "Upload Documents" — Select files from phone
  2. "Customize Print" — Choose settings per file
  3. "Get Delivery" — Receive at doorstep
- Skip button top-right
- "Get Started" button on last slide

### Screen 3: Home Dashboard
- **Header**: Logo + Notification bell + Cart icon
- **Hero section**: "Print starting at ₹0.90/page | Free delivery > ₹199"
- **Quick Action Cards**:
  - 📄 Upload & Print (primary CTA, large card)
  - 📦 Track Order
  - 🛍️ Shop Stationery
  - 📋 My Orders
- **Features strip**: Free delivery • Pickup option • Quality print
- **Bottom Tab Navigation**:
  1. Home (active)
  2. Upload
  3. Shop
  4. Orders
  5. Profile

### Screen 4: Upload Documents
- **Header**: "Upload Documents" + Back button
- **Upload area**: Large dashed border box with "+" icon
- **Supported formats**: PDF, DOC, DOCX, Images (PNG, JPG)
- **File picker integration** (system document picker)
- **Uploaded files list**:
  - File name
  - Page count
  - File size
  - Delete button
- **Note**: "Supports multiple files. Max 20MB per file."
- **Bottom bar**: Total pages + "Continue" button

### Screen 5: Print Customization (per individual file)
- **Header**: File name + Back + Next
- **Preview**: Mini page preview
- **Options**:
  - **Print Type**: Single-sided / Double-sided
  - **Color**: Black & White / Color
  - **Paper Size**: A4 (default), A3, Letter
  - **Copies**: +/- stepper (default 1)
  - **Page Range**: All / Custom (e.g., 1-5, 7, 9-12)
  - **Binding**: None / Stapled / Spiral Binding
  - **Cover Page**: None / Motivational Cover Page (personalized)
- **Real-time price calculation** displayed
- **"Add to Cart" button** with total price

### Screen 6: Group Print / Cart
- **Header**: "Review Cart" (or "Group Print")
- **List of all files** with their chosen settings:
  - File name
  - Print type, Color, Copies, Binding
  - Sub-price per file
- **"Add More Files"** button
- **Pricing Summary**:
  - Subtotal (per-page cost × pages × copies)
  - Binding charges
  - Delivery charge (if < ₹199)
  - **Total**
- **Coupon Code** input field
- **"Proceed to Checkout" button**

### Screen 7: Delivery Details
- **Header**: "Delivery Details"
- **Toggle**: Delivery / Pickup
- **If Delivery**:
  - Full Name
  - Phone Number
  - Address (multiline)
  - City
  - State
  - Pincode
  - Landmark (optional)
- **If Pickup**:
  - Show pickup locations / instructions
  - "Order will be ready in X hours"
- **Delivery info**: "Free delivery on orders above ₹199"
- **"Continue to Payment" button**

### Screen 8: Order Summary & Payment
- **Header**: "Order Summary"
- **Order details**: Items, quantity, price
- **Delivery address** (read-only)
- **Payment methods**:
  - UPI (GPay, PhonePe, Paytm)
  - Credit/Debit Card
  - Net Banking
  - Cash on Delivery (COD)
- **Razorpay/Stripe** integration
- **"Place Order" button**

### Screen 9: Order Confirmation
- **Success animation/icon** (✓)
- **Order ID**: #PRINTXXXXX
- **Estimated delivery**: X-X business days
- **"Track Order" button**
- **"Continue Shopping" button**
- **Share order** option

### Screen 10: My Orders
- **Header**: "My Orders"
- **Tabs**: All | Processing | Shipped | Delivered
- **Order cards**:
  - Order ID
  - Date
  - Item count
  - Status badge (color-coded)
  - Total amount
  - Tap to view details
- **Empty state**: "No orders yet. Start printing!"

### Screen 11: Order Tracking / Details
- **Header**: "Order #PRINTXXXXX"
- **Timeline/progress bar**:
  - ✅ Order Placed
  - ⏳ Processing
  - ⏳ Printing
  - ⏳ Shipped (with tracking link)
  - ⏳ Delivered
- **Order items list**
- **Delivery address**
- **Payment info**
- **Contact support** button

### Screen 12: Shop (Stationery Store)
- **Header**: "Shop"
- **Categories**:
  - Planners (Daily, Weekly, Monthly)
  - Diaries & Notebooks
  - Motivational Posters
  - Custom Notebooks
- **Product Card**:
  - Product image
  - Title
  - Price
  - "Add to Cart" button
- **Product Detail** (on tap):
  - Images
  - Description
  - Variants (size, color, design)
  - Quantity selector
  - "Add to Cart"

### Screen 13: Profile / Account
- **Header**: "My Account"
- **If logged in**:
  - Name, Email, Phone
  - My Addresses (manage)
  - Saved Documents
  - Order History
  - About / Rate Us
  - Share App
  - Logout
- **If not logged in**:
  - Login with Phone (OTP)
  - Name, Phone, Email form

---

## 3. Data Models

### User
```
{
  id: string,
  name: string,
  phone: string,
  email: string,
  addresses: Address[],
  createdAt: timestamp
}
```

### Document
```
{
  id: string,
  fileName: string,
  fileUri: string,
  pageCount: number,
  fileSize: number,
  mimeType: string
}
```

### PrintSettings
```
{
  documentId: string,
  printType: 'single' | 'double',
  colorMode: 'bw' | 'color',
  paperSize: 'A4' | 'A3' | 'Letter',
  copies: number,
  pageRange: 'all' | string,
  binding: 'none' | 'staple' | 'spiral',
  coverPage: boolean
}
```

### CartItem
```
{
  id: string,
  document: Document,
  settings: PrintSettings,
  subtotal: number
}
```

### Order
```
{
  id: string,
  userId: string,
  items: CartItem[],
  deliveryAddress: Address,
  deliveryMode: 'delivery' | 'pickup',
  subtotal: number,
  bindingCharges: number,
  deliveryCharge: number,
  discount: number,
  total: number,
  paymentMethod: string,
  paymentStatus: 'pending' | 'paid' | 'failed',
  orderStatus: 'placed' | 'processing' | 'printed' | 'shipped' | 'delivered',
  trackingUrl: string,
  createdAt: timestamp,
  estimatedDelivery: string
}
```

### Address
```
{
  id: string,
  fullName: string,
  phone: string,
  address: string,
  city: string,
  state: string,
  pincode: string,
  landmark: string,
  isDefault: boolean
}
```

### Product (Stationery)
```
{
  id: string,
  name: string,
  description: string,
  category: 'planner' | 'diary' | 'notebook' | 'poster',
  price: number,
  images: string[],
  variants: Variant[],
  inStock: boolean
}
```

---

## 4. Tech Stack

| Layer | Technology |
|-------|-----------|
| **Mobile Framework** | React Native (Expo) |
| **Navigation** | @react-navigation/native + bottom-tabs + stack |
| **State Management** | React Context + useReducer (lightweight) |
| **File Picker** | expo-document-picker |
| **File Viewer** | react-native-pdf / expo-file-system |
| **Payments** | Razorpay SDK (India) |
| **Storage (local)** | AsyncStorage (mock data phase) |
| **Icons** | react-native-vector-icons / @expo/vector-icons |
| **Maps** | (future for pickup locations) |
| **Push Notifications** | expo-notifications |
| **Splash Screen** | expo-splash-screen |

---

## 5. Project Structure

```
print-client/
├── App.tsx                    # Root component
├── app.json                   # Expo config
├── package.json
├── src/
│   ├── constants/
│   │   ├── colors.ts          # Theme colors
│   │   ├── fonts.ts           # Font sizes
│   │   ├── pricing.ts         # Pricing rules
│   │   └── mockData.ts        # Mock data
│   ├── navigation/
│   │   ├── AppNavigator.tsx   # Root navigator
│   │   ├── TabNavigator.tsx   # Bottom tabs
│   │   └── types.ts           # Navigation types
│   ├── screens/
│   │   ├── SplashScreen.tsx
│   │   ├── OnboardingScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── UploadScreen.tsx
│   │   ├── PrintCustomizationScreen.tsx
│   │   ├── CartScreen.tsx
│   │   ├── DeliveryScreen.tsx
│   │   ├── PaymentScreen.tsx
│   │   ├── OrderConfirmationScreen.tsx
│   │   ├── MyOrdersScreen.tsx
│   │   ├── OrderTrackingScreen.tsx
│   │   ├── ShopScreen.tsx
│   │   ├── ProductDetailScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── AddressScreen.tsx
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── PriceTag.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── LoadingIndicator.tsx
│   │   ├── home/
│   │   │   ├── QuickActionCard.tsx
│   │   │   └── FeaturesStrip.tsx
│   │   ├── upload/
│   │   │   ├── FileUploadArea.tsx
│   │   │   └── FileListItem.tsx
│   │   ├── print/
│   │   │   ├── OptionSelector.tsx
│   │   │   ├── Stepper.tsx
│   │   │   └── PriceSummary.tsx
│   │   ├── cart/
│   │   │   ├── CartItemCard.tsx
│   │   │   └── CouponInput.tsx
│   │   ├── order/
│   │   │   ├── OrderCard.tsx
│   │   │   └── OrderTimeline.tsx
│   │   └── shop/
│   │       ├── ProductCard.tsx
│   │       └── CategoryList.tsx
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   ├── CartContext.tsx
│   │   └── OrderContext.tsx
│   ├── services/
│   │   ├── pricing.ts         # Price calculation logic
│   │   ├── storage.ts         # AsyncStorage helpers
│   │   └── payment.ts         # Payment integration
│   └── utils/
│       ├── format.ts          # Number/date formatting
│       └── validation.ts      # Form validation
```

---

## 6. Pricing Model (Reference)

| Service | Price |
|---------|-------|
| B&W per page (Single-sided) | ₹0.90 |
| B&W per page (Double-sided) | ₹1.50 |
| Color per page | ₹3.00 - ₹5.00 |
| Spiral Binding | ₹25 - ₹50 |
| Stapling | Free |
| Delivery (orders < ₹199) | ₹30 - ₹50 |
| Delivery (orders ≥ ₹199) | FREE |
| Pickup | FREE |

---

## 7. Color Scheme (Proposed — to match reference style)

```js
colors = {
  primary: '#4F46E5',       // Indigo (modern, trustable)
  primaryLight: '#818CF8',
  secondary: '#06B6D4',     // Cyan accent
  background: '#F8FAFC',    // Light gray-white
  surface: '#FFFFFF',
  text: '#1E293B',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  white: '#FFFFFF',
  black: '#000000',
}
```

---

## 8. Development Phases

### Phase 1: Project Setup & Navigation (Day 1)
- Initialize Expo project
- Install dependencies
- Set up folder structure
- Configure navigation (Stack + Tabs)
- Build Splash + Onboarding screens

### Phase 2: Core Print Flow (Days 2-3)
- Home Screen with quick actions
- Upload Screen with file picker
- Print Customization screen
- Cart/Review screen
- Pricing calculation engine

### Phase 3: Checkout Flow (Days 4-5)
- Delivery/Pickup form
- Address management
- Payment screen (mock)
- Order Confirmation screen

### Phase 4: Orders & Shop (Days 6-7)
- My Orders list screen
- Order Tracking timeline
- Shop (Stationery) browse
- Product Detail screen

### Phase 5: Profile & Polish (Days 8-9)
- Profile/Account screen
- Phone Auth (OTP) flow
- UI polish, animations
- Testing on physical device

### Phase 6: Backend Integration (Future)
- Node.js + Express server
- MongoDB / PostgreSQL
- Razorpay real integration
- Admin dashboard
- Real file upload & print management

---

## 9. Next Step

I'll scaffold the Expo project with React Navigation and build **Screen 1 (Splash)** and **Screen 2 (Onboarding)** first. After you review and approve those, we move to the Home screen.
