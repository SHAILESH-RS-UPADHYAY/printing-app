import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import * as orderApi from '../services/api/orders';

export interface Order {
  id: string;
  orderId: string;
  items: { fileName: string; quantity: number }[];
  total: number;
  status: 'placed' | 'processing' | 'printed' | 'shipped' | 'delivered';
  createdAt: string;
  estimatedDelivery: string;
  deliveryAddress: string;
  paymentMethod: string;
  trackingUrl: string;
}

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  addOrder: (order: Order) => void;
  fetchOrders: (status?: string) => Promise<void>;
  getOrderById: (id: string) => Order | undefined;
  fetchOrderById: (id: string) => Promise<Order | null>;
}

const OrderContext = createContext<OrderContextType | null>(null);

function mapApiOrder(o: any): Order {
  return {
    id: o._id || o.id,
    orderId: o.orderId || `#PRINT${String(o._id || '').slice(-6).padStart(6, '0')}`,
    items: (o.items || []).map((i: any) => ({
      fileName: i.fileName || i.document?.fileName || 'Document',
      quantity: i.quantity || i.copies || 1,
    })),
    total: o.total || 0,
    status: o.status || 'placed',
    createdAt: o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
    estimatedDelivery: o.estimatedDelivery || '',
    deliveryAddress: o.deliveryAddress?.address || o.deliveryAddress || '',
    paymentMethod: o.paymentMethod || 'UPI',
    trackingUrl: o.trackingUrl || '',
  };
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(false);

  const fetchOrders = useCallback(async (status?: string) => {
    setLoading(true);
    try {
      const response = await orderApi.getUserOrders(status);
      const mapped = (response.orders || []).map(mapApiOrder);
      setOrders(mapped);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  const addOrder = useCallback((order: Order) => {
    setOrders((prev) => [order, ...prev]);
  }, []);

  const getOrderById = useCallback((id: string) => {
    return orders.find((o) => o.id === id);
  }, [orders]);

  const fetchOrderById = useCallback(async (id: string): Promise<Order | null> => {
    try {
      const response = await orderApi.getOrderById(id);
      return mapApiOrder(response.order || response);
    } catch {
      return null;
    }
  }, []);

  return (
    <OrderContext.Provider value={{ orders, loading, addOrder, fetchOrders, getOrderById, fetchOrderById }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within an OrderProvider');
  return context;
}
