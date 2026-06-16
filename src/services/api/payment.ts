import api from './client';

export async function createPaymentOrder(orderId: string) {
  const { data } = await api.post('/payments/create-order', { orderId });
  return data;
}

export async function verifyPayment(params: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  orderId: string;
}) {
  const { data } = await api.post('/payments/verify', params);
  return data;
}
