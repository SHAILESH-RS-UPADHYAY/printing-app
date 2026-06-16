import api from './client';

export async function sendOtp(phone: string) {
  const { data } = await api.post('/auth/send-otp', { phone });
  return data;
}

export async function verifyOtp(phone: string, otp: string, name?: string) {
  const { data } = await api.post('/auth/verify-otp', { phone, otp, name });
  return data;
}

export async function getProfile() {
  const { data } = await api.get('/auth/profile');
  return data;
}

export async function updateProfile(updates: { name?: string; email?: string }) {
  const { data } = await api.put('/auth/profile', updates);
  return data;
}

export async function addAddress(address: any) {
  const { data } = await api.post('/auth/address', address);
  return data;
}

export async function deleteAddress(addressId: string) {
  const { data } = await api.delete(`/auth/address/${addressId}`);
  return data;
}
