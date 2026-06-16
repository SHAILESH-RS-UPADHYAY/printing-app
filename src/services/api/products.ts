import api from './client';

export async function getProducts(category?: string) {
  const params = category && category !== 'all' ? `?category=${category}` : '';
  const { data } = await api.get(`/products${params}`);
  return data;
}

export async function getProductById(productId: string) {
  const { data } = await api.get(`/products/${productId}`);
  return data;
}
