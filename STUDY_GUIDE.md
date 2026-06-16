# Print Client App — Study Guide

> **Purpose**: This document tracks every step of building this React Native (Expo) app from scratch.
> **Location**: `D:\projects\printing app`
> **Current Phase**: All 13 screens complete — full print-ordering flow built.
> **Status**: ✅ Ready for review | Next: GitHub + client feedback
> **License**: MIT

---

## Completed Steps

### Step 1: Project Scaffolding ✅

**What we did**
- Created Expo project with TypeScript template at `D:\projects\printing app`
- Installed all core dependencies:
  - `@react-navigation/native` + `native-stack` + `bottom-tabs` — screen navigation
  - `react-native-reanimated` + `react-native-gesture-handler` — animations & gestures
  - `expo-linear-gradient` — gradient backgrounds (used everywhere)
  - `expo-document-picker` — file selection from device
  - `expo-splash-screen` + `expo-font` — splash & font loading
  - `@react-native-async-storage/async-storage` — local persistence
  - `uuid` — unique ID generation
  - `@expo/vector-icons` — icon library (Ionicons)

**Project Structure**
```
D:\projects\printing app\
├── App.tsx                    # Root — providers + navigator
├── app.json                   # Expo configuration (name, icons, splash)
├── PRD-PLAN.md                # Full product requirements document
├── STUDY_GUIDE.md             # This file — step-by-step documentation
├── src/
│   ├── constants/
│   │   ├── colors.ts          # Full color palette (indigo theme)
│   │   └── pricing.ts         # Print pricing rules + TypeScript types
│   ├── navigation/
│   │   ├── types.ts           # TypeScript param lists for all routes
│   │   ├── AppNavigator.tsx   # Root stack navigator (8 routes)
│   │   └── TabNavigator.tsx   # Bottom tab navigator (5 tabs)
│   ├── screens/               # 13 screens total
│   ├── components/
│   │   ├── common/
│   │   │   └── Button.tsx     # Reusable button (4 variants + gradient)
│   │   └── print/
│   │       ├── OptionSelector.tsx  # Radio-chip group selector
│   │       └── Stepper.tsx         # +/- quantity picker
│   ├── context/
│   │   ├── AuthContext.tsx    # Auth state (login/addresses)
│   │   ├── CartContext.tsx    # Cart state (useReducer + actions)
│   │   └── OrderContext.tsx   # Orders state + mock data
│   ├── services/
│   │   └── pricing.ts        # Price calculation engine
│   └── utils/
│       └── format.ts         # File size, date, order ID formatters
```

**Architecture Decisions**
- **Context + useReducer** over Redux — sufficient for this app's complexity (2 reducers max)
- **Native Stack** over JS Stack — better performance, native OS transitions
- **TypeScript strict** — every file is typed, zero `any` in business logic
- **Modular components** — screens never contain reusable UI; all extracted to `components/`
- **Services layer** — pricing and business logic separate from UI

---

### Step 2: Navigation Architecture ✅

**Location**: `src/navigation/`

**Two-level navigation:**

1. **`AppNavigator`** (Native Stack) — 8 routes:
   ```
   Splash (fade) → Onboarding (slide) → MainTabs (fade)
                                         → PrintCustomization (slide from bottom)
                                         → Cart → Delivery → Payment
                                         → OrderConfirmation (fade)
                                         → OrderTracking
   ```

2. **`TabNavigator`** (Bottom Tabs) — 5 tabs:
   ```
   Home | Upload | ShopTab | Orders | Profile
   ```

**Key navigation behaviors:**
- Splash → Onboarding: `navigation.reset()` prevents back navigation to splash
- Onboarding → MainTabs: stores `@has_seen_onboarding` in AsyncStorage
- Print flow screens (Cart → Delivery → Payment → Confirmation) are stack modals on top of tabs
- Cart is accessible from Home header or Upload screen
- Bottom tabs have focused/unfocused icon variants with color change

**TypeScript route types** (`src/navigation/types.ts`):
```typescript
type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  MainTabs: undefined;
  PrintCustomization: { documentId: string };
  Cart: undefined;
  Delivery: undefined;
  Payment: undefined;
  OrderConfirmation: { orderId: string };
  OrderTracking: { orderId: string };
};
```

---

### Step 3: Splash Screen ✅

**Location**: `src/screens/SplashScreen.tsx`

**Visual design:**
- Full-screen gradient background (Indigo → Purple) using `LinearGradient`
- Centered logo circle (100×100) with printer icon
- App name "PrintClient" — font size 32, weight 800, white
- Tagline: "Print Documents with Ease"
- Three animated dots at bottom as loading indicator

**Animation sequence:**
1. Logo scales up (0.3 → 1.0) + fades in — **800ms**
2. App name fades in — **500ms**
3. Tagline fades in — **400ms**
4. Loading dots appear — **300ms**
5. Auto-navigates to Onboarding after **3 seconds** total

**Code patterns to note:**
- `useRef(new Animated.Value(0))` for animation values (no re-renders)
- `Animated.sequence()` + `Animated.parallel()` for choreographed animations
- `navigation.reset()` instead of `navigate()` to prevent back navigation

---

### Step 4: Onboarding Screen ✅

**Location**: `src/screens/OnboardingScreen.tsx`

**3 slides with gradient backgrounds:**
1. **Upload Documents** — cloud-upload icon (Indigo → Purple gradient)
2. **Customize Your Print** — options icon (Purple → Cyan gradient)
3. **Get It Delivered** — rocket icon (Cyan → Indigo gradient)

**Interactive elements:**
- Horizontal swipe with `Animated.FlatList` + `pagingEnabled`
- **Dynamic animated dots**: width interpolates from 8→24 for active dot, opacity changes
- **"Skip" button** (top-right): saves `@has_seen_onboarding` flag, navigates to MainTabs
- **"Next" button** on slides 1-2
- **"Get Started" button** on slide 3 — green gradient CTA

**Persistence**: Uses `AsyncStorage.setItem('@has_seen_onboarding', 'true')` so onboarding only shows on first launch.

**Animation technique:**
- `Animated.event` tracks scroll offset on FlatList
- `scrollX.interpolate()` with `inputRange` maps scroll position → scale/opacity
- Each element (icon, title, description) has its own interpolation

---

### Step 5: Home Dashboard ✅

**Location**: `src/screens/HomeScreen.tsx`

**Layout structure:**
```
┌─────────────────────────────────┐
│  Logo    PrintClient  🔔 🛒    │  ← Header
├─────────────────────────────────┤
│  ┌─────────────────────────┐   │
│  │ Print starting at       │   │
│  │ ₹0.90/page              │   │  ← Hero Banner (gradient)
│  │ Free delivery > ₹199    │   │
│  │ [Order Now →]           │   │
│  └─────────────────────────┘   │
├─────────────────────────────────┤
│  ┌──────┐  ┌──────┐           │
│  │📄    │  │📦    │           │
│  │Upload│  │Track │           │  ← Quick Actions 2×2 Grid
│  │&Print│  │Order │           │
│  └──────┘  └──────┘           │
│  ┌──────┐  ┌──────┐           │
│  │🛍️   │  │📋    │           │
│  │ Shop │  │My    │           │
│  │      │  │Orders│           │
│  └──────┘  └──────┘           │
├─────────────────────────────────┤
│  Why Choose Us                 │
│  [Lowest] [Free] [Quality]     │  ← Features Strip (horizontal)
│  [Fast] [Pickup]               │
├─────────────────────────────────┤
│  Recent Orders                 │
│  ┌─────────────────────────┐   │
│  │ #PRINT0000001    Shipped│   │  ← Order Card
│  │ 10 Jun 2026 • 2 items   │   │
│  │ ₹185.50        [Track]  │   │
│  └─────────────────────────┘   │
└─────────────────────────────────┘
```

**Components used:**
- `Button` — gradient button (primary variant)
- Quick actions use inline `LinearGradient` with unique color pairs
- Cards have `shadowColor` + `elevation` for depth

**Navigation**: Quick actions navigate via `navigation.getParent()` to reach tab navigator

---

### Step 6: Upload Documents ✅

**Location**: `src/screens/UploadScreen.tsx`

**Features:**
- Dashed border upload area with cloud-upload icon
- `expo-document-picker` integration with type filters:
  - `application/pdf`
  - `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
  - `image/jpeg`, `image/png`
- **Multiple file selection** supported via `multiple: true`
- File list displays: icon, name, size (formatted), estimated page count
- **Delete** individual files with close-circle icon
- **Bottom bar**: total file count, estimated pages, price estimate (₹0.90 × pages)
- **"Continue"** button navigates to PrintCustomization

**Page estimation logic:**
```typescript
const ESTIMATED_PAGES = {
  'application/pdf': 10,
  'application/msword': 8,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 8,
  'image/jpeg': 1,
  'image/png': 1,
};
```

**Error handling**: `try/catch` around DocumentPicker with console log fallback

---

### Step 7: Print Customization Screen ✅

**Location**: `src/screens/PrintCustomizationScreen.tsx` *(core screen)*

**Purpose**: This is the most important screen — users configure all print options per document.

**Layout:**
```
┌─────────────────────────────────┐
│  📄 Print Settings    24 pages │  ← Header
│     Notes.pdf                   │
├─────────────────────────────────┤
│  ₹0.90/page (single side)      │  ← Price Preview Card
│  24 effective pages × 1 copy    │
├─────────────────────────────────┤
│  Print Type                     │
│  [Single-sided] [Double-sided]  │  ← OptionSelector
├─────────────────────────────────┤
│  Color Mode                     │
│  [Black & White] [Color]        │  ← OptionSelector
├─────────────────────────────────┤
│  Paper Size                     │
│  [A4] [A3] [Letter]             │  ← OptionSelector
├─────────────────────────────────┤
│  Copies                   1     │  ← Stepper (+/-)
├─────────────────────────────────┤
│  Binding                        │
│  [None] [Stapled] [Spiral]      │  ← OptionSelector
├─────────────────────────────────┤
│  ❤️ Motivational Cover Page  🔘 │  ← Switch toggle
├─────────────────────────────────┤
│  Total    ₹21.60   [Add to Cart]│  ← Bottom Bar
└─────────────────────────────────┘
```

**Options available:**
| Option | Choices | Default |
|--------|---------|---------|
| Print Type | Single-sided, Double-sided | Single |
| Color | B&W (₹0.90), Color (₹3.00) | B&W |
| Paper Size | A4, A3, Letter | A4 |
| Copies | 1–99 (stepper) | 1 |
| Binding | None, Stapled (free), Spiral (₹35) | None |
| Cover Page | On/Off toggle | Off |

**Real-time price calculation** via `useMemo`:
```typescript
const subtotal = useMemo(() =>
  calculateItemPrice({ pageCount, copies, printType, colorMode, binding, coverPage }),
  [pageCount, copies, printType, colorMode, binding, coverPage]
);
```

**"Add to Cart"** dispatches to `CartContext` with document + settings + subtotal, then navigates to Cart.

**Custom components created:**
- `OptionSelector` — horizontal chip group with selected state
- `Stepper` — +/- buttons with min/max bounds

---

### Step 8: Shop (Stationery) ✅

**Location**: `src/screens/ShopScreen.tsx`

**Features:**
- **Category filter chips**: All, Planners, Diaries, Notebooks, Posters
- **2-column product grid** with gradient image placeholders
- Product name + price (₹59–₹299)
- Add-to-cart button per product
- Cart icon in header

**Categories & Products** (mock data):
| Product | Category | Price |
|---------|----------|-------|
| Daily Planner 2026 | Planner | ₹149 |
| Weekly Planner | Planner | ₹129 |
| Hardbound Diary | Diary | ₹199 |
| Spiral Notebook | Notebook | ₹89 |
| Motivational Poster | Poster | ₹59 |
| Study Planner | Planner | ₹99 |
| Premium Diary | Diary | ₹299 |
| A4 Notebook | Notebook | ₹119 |

**Filter logic**: Local state `activeCategory` filters the products array (`'all'` shows all)

---

### Step 9: Cart / Review Screen ✅

**Location**: `src/screens/CartScreen.tsx`

**Features:**
- **Back button** + "Cart" title in header
- **Cart items list**: file icon, name, settings summary (double/single, B&W/color, copies), binding info, price, delete button
- **Coupon section**: placeholder input with "Apply" button
- **Price breakdown card**:
  - Subtotal (sum of all item prices)
  - Delivery charge (free if subtotal ≥ ₹199, else ₹40)
  - Total (subtotal + delivery - discount)
- **Empty state**: cart icon, message, "Upload Documents" CTA button
- **Bottom bar**: total amount + "Proceed to Checkout" button

**State management**: All cart state comes from `CartContext`:
```typescript
const { state, removeItem, subtotal } = useCart();
```

**Pricing integration**:
```typescript
const deliveryCharge = calculateDeliveryCharge(subtotal);
// Returns 0 if subtotal >= 199, else 40
```

---

### Step 10: Delivery Details Screen ✅

**Location**: `src/screens/DeliveryScreen.tsx`

**Features:**
- **Mode toggle**: Delivery / Pickup (segmented control)
- **Delivery mode** shows:
  - Info banner: "Free delivery on orders above ₹199"
  - Form fields: Full Name *, Phone *, Address *, City, State, Pincode, Landmark
  - Text inputs with proper keyboard types (phone-pad, number-pad)
- **Pickup mode** shows:
  - Storefront icon
  - "Pickup from our outlet" message
  - "2-4 hours" turnaround
  - Address: Bypass Road, Sitapur, Haridwar, Uttarakhand 249407
- **Bottom bar**: Total + "Continue to Payment" button

**Form state management**:
```typescript
const [form, setForm] = useState({
  fullName: '', phone: '', address: '', city: '', state: '', pincode: '', landmark: '',
});
```

**UX details**:
- `KeyboardAvoidingView` for iOS keyboard handling
- `textAlignVertical: 'top'` for multiline address input
- `maxLength` constraints on phone (10) and pincode (6)

---

### Step 11: Payment Screen ✅

**Location**: `src/screens/PaymentScreen.tsx`

**Features:**
- **Order summary card**: itemized list, subtotal, delivery, total
- **Payment method selection** (4 options):
  - UPI (GPay, PhonePe, Paytm) — default selected
  - Card (Credit / Debit)
  - Net Banking (All banks)
  - Cash on Delivery
- **Radio-style selection** with checkmark icon
- **Bottom bar**: Total + "Place Order" button

**"Place Order" flow**:
1. Sets `processing = true`, button shows spinner + "Processing..."
2. Simulates 1.5s payment delay via `setTimeout`
3. Clears cart via `clearCart()`
4. Resets navigation to MainTabs + pushes OrderConfirmation

**Navigation reset trick**:
```typescript
navigation.reset({
  index: 0,
  routes: [
    { name: 'MainTabs' },
    { name: 'OrderConfirmation', params: { orderId: generateId() } },
  ],
});
```
This ensures back from confirmation goes to tabs, not back to payment.

---

### Step 12: Order Confirmation Screen ✅

**Location**: `src/screens/OrderConfirmationScreen.tsx`

**Visual design:**
- **Animated success checkmark**: green gradient circle with checkmark icon
  - Scales from 0 to 1 over 500ms (`Animated.spring`)
  - Content fades in after (400ms)
- **"Order Placed!"** title
- **Order info card**: Order ID, Estimated Delivery (2-4 days), Payment status
- **Delivery note**: SMS updates info bar

**Animation breakdown:**
```typescript
Animated.sequence([
  Animated.timing(scaleAnim, { toValue: 1, duration: 500 }),
  Animated.timing(opacityAnim, { toValue: 1, duration: 400 }),
]).start();
```

**Two CTA buttons:**
1. "Track Order" (outline) → navigates to OrderTracking
2. "Continue Shopping" (primary) → resets to MainTabs

---

### Step 13: Order Tracking Screen ✅

**Location**: `src/screens/OrderTrackingScreen.tsx`

**Features:**
- **Status card**: Current status label + uppercase badge (color-coded)
- **Vertical timeline** with 5 steps:
  ```
  🧾 Order Placed     ✓ (completed)
  🔄 Processing       ✓ (completed)
  🖨️ Printing         ● (current — highlighted)
  🚲 Shipped          ○ (upcoming)
  ✅ Delivered        ○ (upcoming)
  ```
- Each step has: circular icon dot, connecting line, label, description
- Completed steps: filled primary color
- Current step: primary + glow shadow
- Upcoming steps: gray
- **Order details card**: items list, total, payment method, delivery address
- **Tracking link** (visible only when `status === 'shipped'`): "Track via courier partner"

**Status flow**: `placed → processing → printed → shipped → delivered`

**Status configuration**:
```typescript
const STATUS_CONFIG = {
  placed:    { icon: 'receipt',         label: 'Order Placed',    description: 'Your order has been placed' },
  processing:{ icon: 'sync',            label: 'Processing',      description: 'We are preparing your prints' },
  printed:   { icon: 'print',           label: 'Printing',        description: 'Your documents are being printed' },
  shipped:   { icon: 'bicycle',         label: 'Shipped',         description: 'Out for delivery' },
  delivered: { icon: 'checkmark-done',  label: 'Delivered',       description: 'Order delivered successfully' },
};
```

**Error handling**: Shows "Order not found" if `getOrderById()` returns undefined

---

### Step 14: My Orders (List) ✅

**Location**: `src/screens/MyOrdersScreen.tsx`

**Features:**
- **Filter tabs**: All, Processing, Shipped, Delivered
- **Order cards**: Order ID, date + item count, status badge, total amount, "Track" button (for shipped)
- **Status badge colors**:
  - `placed`/`processing`/`printed`/`shipped` → blue (info)
  - `delivered` → green (success)
- **Tap card** → navigates to OrderTracking
- **Empty state**: receipt icon + "No orders yet" + "Start printing to see your orders here"

**Data source**: `OrderContext` with 2 mock orders (one shipped, one delivered)

---

### Step 15: Profile / Account ✅

**Location**: `src/screens/ProfileScreen.tsx`

**Features:**
- **Profile card**: avatar circle, name, phone (or "Sign In" if logged out)
- **6 menu items**:
  1. My Addresses → AddressForm
  2. Saved Documents → (placeholder)
  3. Order History → Orders tab
  4. About App → (placeholder)
  5. Rate Us → (placeholder)
  6. Share App → (placeholder)
- **Logout button** (visible when logged in): red outline, confirmation dialog
- **App version footer**: "Version 1.0.0"

**Auth state**: Uses `AuthContext` — `isLoggedIn`, `user`, `logout()`

---

## Context Layer Architecture

### CartContext (`src/context/CartContext.tsx`)
- **State**: `{ items: CartItem[], couponCode: string, discount: number }`
- **Reducer actions**: `ADD_ITEM`, `REMOVE_ITEM`, `UPDATE_SETTINGS`, `UPDATE_SUBTOTAL`, `CLEAR_CART`, `SET_COUPON`, `REMOVE_COUPON`
- **Derived values**: `totalItems` (count), `subtotal` (sum)
- **Usage**: `const { state, addItem, removeItem, subtotal } = useCart()`

### AuthContext (`src/context/AuthContext.tsx`)
- **State**: `{ user: User | null, addresses: Address[] }`
- **Methods**: `login(phone)`, `verifyOtp(otp)`, `logout()`, `updateProfile()`, `addAddress()`, `removeAddress()`, `setDefaultAddress()`

### OrderContext (`src/context/OrderContext.tsx`)
- **State**: `orders: Order[]` (starts with 2 mock orders)
- **Methods**: `addOrder()`, `updateOrderStatus()`, `getOrderById()`

---

## Services Layer

### Pricing Engine (`src/services/pricing.ts`)
```typescript
calculateItemPrice({ pageCount, copies, printType, colorMode, binding, coverPage })
  → number (total price)

calculateDeliveryCharge(subtotal)
  → 0 if subtotal >= 199, else 40

formatPrice(amount)
  → "₹21.60"
```

**Pricing rules** (from `src/constants/pricing.ts`):
| Service | Rate |
|---------|------|
| B&W Single-sided | ₹0.90/page |
| B&W Double-sided | ₹1.50/page |
| Color Single-sided | ₹3.00/page |
| Color Double-sided | ₹5.00/page |
| Spiral Binding | ₹35 |
| Delivery (< ₹199) | ₹40 |
| Free Delivery | ≥ ₹199 |
| Cover Page | ₹5 |

---

## UI Component Library

| Component | File | Variants |
|-----------|------|----------|
| `Button` | `components/common/Button.tsx` | primary (gradient), secondary, outline, ghost; small/medium/large; loading state |
| `OptionSelector` | `components/print/OptionSelector.tsx` | Horizontal chip group with selected highlight |
| `Stepper` | `components/print/Stepper.tsx` | +/- buttons with label, min/max bounds |

---

## How to Run

```bash
cd D:\projects\printing app
npm start              # Start Expo dev server
npm run android        # Start on Android emulator
npm run ios            # Start on iOS simulator (macOS only)
```

To test on your **physical phone**:
1. Install **Expo Go** from Play Store
2. Run `npm start`
3. Scan the QR code with Expo Go

---

## How to Build for Play Store

```bash
npm install -g eas-cli
eas login
eas build --platform android --profile production
```

This generates an **AAB file** ready for Play Store upload.

To generate an **APK** (for sideloading):
```bash
eas build --platform android --profile preview
```

---

## How to Modify

### Change App Name
Edit `app.json`:
```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug",
    "android": {
      "package": "com.yourcompany.yourapp"
    }
  }
}
```

### Change Colors
Edit `src/constants/colors.ts` — every component imports from this single source.

### Change Pricing
Edit `src/constants/pricing.ts` — the pricing engine in `services/pricing.ts` uses these values.

### Add a New Screen
1. Create file in `src/screens/`
2. Add route + params to `src/navigation/types.ts`
3. Add `<Stack.Screen>` in `AppNavigator.tsx`

### Add a New Tab
1. Add route to `TabParamList` in `src/navigation/types.ts`
2. Add `<Tab.Screen>` in `TabNavigator.tsx`
3. Add icon mapping in `TAB_ICONS`

---

## File Index (26 source files)

| File | Lines | Purpose |
|------|-------|---------|
| `App.tsx` | ~20 | Root: providers + navigator |
| `src/constants/colors.ts` | ~25 | Color palette |
| `src/constants/pricing.ts` | ~30 | Pricing rules + types |
| `src/navigation/types.ts` | ~20 | Route param types |
| `src/navigation/AppNavigator.tsx` | ~60 | Stack navigator |
| `src/navigation/TabNavigator.tsx` | ~70 | Bottom tabs |
| `src/context/CartContext.tsx` | ~120 | Cart reducer + provider |
| `src/context/AuthContext.tsx` | ~100 | Auth state + addresses |
| `src/context/OrderContext.tsx` | ~80 | Orders + mock data |
| `src/services/pricing.ts` | ~45 | Price calculation |
| `src/utils/format.ts` | ~25 | Formatting helpers |
| `src/components/common/Button.tsx` | ~95 | Reusable button |
| `src/components/print/OptionSelector.tsx` | ~80 | Chip group selector |
| `src/components/print/Stepper.tsx` | ~70 | Quantity stepper |
| `src/screens/SplashScreen.tsx` | ~100 | Animated splash |
| `src/screens/OnboardingScreen.tsx` | ~170 | Swipeable onboarding |
| `src/screens/HomeScreen.tsx` | ~260 | Main dashboard |
| `src/screens/UploadScreen.tsx` | ~180 | Document upload |
| `src/screens/PrintCustomizationScreen.tsx` | ~230 | Print settings |
| `src/screens/CartScreen.tsx` | ~210 | Cart review |
| `src/screens/DeliveryScreen.tsx` | ~210 | Address form |
| `src/screens/PaymentScreen.tsx` | ~200 | Payment methods |
| `src/screens/OrderConfirmationScreen.tsx` | ~120 | Success screen |
| `src/screens/OrderTrackingScreen.tsx` | ~230 | Order timeline |
| `src/screens/MyOrdersScreen.tsx` | ~180 | Order list |
| `src/screens/ShopScreen.tsx` | ~150 | Stationery shop |
| `src/screens/ProfileScreen.tsx` | ~150 | Account settings |
