import api from './client';

export async function loginAdmin(email: string, password: string) {
  const { data } = await api.post('/auth/admin-login', { email, password });
  return data;
}

export async function getOrders(status?: string, page = 1) {
  const params = new URLSearchParams();
  if (status && status !== 'all') params.set('status', status);
  params.set('page', page.toString());
  const { data } = await api.get(`/orders/all?${params}`);
  return data;
}

export async function getOrderById(id: string) {
  const { data } = await api.get(`/orders/${id}`);
  return data;
}

export async function updateOrderStatus(id: string, orderStatus: string, trackingUrl?: string) {
  const { data } = await api.put(`/orders/${id}/status`, { orderStatus, trackingUrl });
  return data;
}

export async function getUsers() {
  const { data } = await api.get('/auth/users');
  return data;
}

export async function getProducts() {
  const { data } = await api.get('/products');
  return data;
}

export async function createProduct(product: any) {
  const { data } = await api.post('/products', product);
  return data;
}

export async function updateProduct(id: string, product: any) {
  const { data } = await api.put(`/products/${id}`, product);
  return data;
}

export async function deleteProduct(id: string) {
  const { data } = await api.delete(`/products/${id}`);
  return data;
}
