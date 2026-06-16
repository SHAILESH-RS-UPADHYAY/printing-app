import api from './client';

export async function createOrder(orderData: {
  items: any[];
  deliveryAddress: any;
  deliveryMode: string;
  paymentMethod: string;
}) {
  const { data } = await api.post('/orders', orderData);
  return data;
}

export async function getUserOrders(status?: string) {
  const params = status && status !== 'all' ? `?status=${status}` : '';
  const { data } = await api.get(`/orders${params}`);
  return data;
}

export async function getOrderById(orderId: string) {
  const { data } = await api.get(`/orders/${orderId}`);
  return data;
}
