import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { generateId } from '../utils/format';

export interface CartDocument {
  id: string;
  fileName: string;
  fileUri: string;
  pageCount: number;
  fileSize: number;
}

export interface PrintSettings {
  printType: 'single' | 'double';
  colorMode: 'bw' | 'color';
  paperSize: 'A4' | 'A3' | 'Letter';
  copies: number;
  pageRange: string;
  binding: 'none' | 'staple' | 'spiral';
  coverPage: boolean;
}

export interface CartItem {
  id: string;
  document: CartDocument;
  settings: PrintSettings;
  subtotal: number;
}

interface CartState {
  items: CartItem[];
  couponCode: string;
  discount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { document: CartDocument; settings: PrintSettings; subtotal: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: { id: string; settings: Partial<PrintSettings> } }
  | { type: 'UPDATE_SUBTOTAL'; payload: { id: string; subtotal: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_COUPON'; payload: { code: string; discount: number } }
  | { type: 'REMOVE_COUPON' };

interface CartContextType {
  state: CartState;
  addItem: (document: CartDocument, settings: PrintSettings, subtotal: number) => void;
  removeItem: (id: string) => void;
  updateSettings: (id: string, settings: Partial<PrintSettings>) => void;
  updateSubtotal: (id: string, subtotal: number) => void;
  clearCart: () => void;
  setCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  totalItems: number;
  subtotal: number;
}

const initialState: CartState = {
  items: [],
  couponCode: '',
  discount: 0,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, { id: generateId(), ...action.payload }],
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    case 'UPDATE_SETTINGS': {
      const { id, settings } = action.payload;
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === id
            ? { ...item, settings: { ...item.settings, ...settings } }
            : item
        ),
      };
    }
    case 'UPDATE_SUBTOTAL': {
      const { id, subtotal } = action.payload;
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === id ? { ...item, subtotal } : item
        ),
      };
    }
    case 'CLEAR_CART':
      return initialState;
    case 'SET_COUPON':
      return {
        ...state,
        couponCode: action.payload.code,
        discount: action.payload.discount,
      };
    case 'REMOVE_COUPON':
      return { ...state, couponCode: '', discount: 0 };
    default:
      return state;
  }
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (document: CartDocument, settings: PrintSettings, subtotal: number) =>
    dispatch({ type: 'ADD_ITEM', payload: { document, settings, subtotal } });

  const removeItem = (id: string) =>
    dispatch({ type: 'REMOVE_ITEM', payload: id });

  const updateSettings = (id: string, settings: Partial<PrintSettings>) =>
    dispatch({ type: 'UPDATE_SETTINGS', payload: { id, settings } });

  const updateSubtotal = (id: string, subtotal: number) =>
    dispatch({ type: 'UPDATE_SUBTOTAL', payload: { id, subtotal } });

  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const setCoupon = (code: string, discount: number) =>
    dispatch({ type: 'SET_COUPON', payload: { code, discount } });

  const removeCoupon = () => dispatch({ type: 'REMOVE_COUPON' });

  const totalItems = state.items.length;
  const subtotal = state.items.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateSettings,
        updateSubtotal,
        clearCart,
        setCoupon,
        removeCoupon,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
