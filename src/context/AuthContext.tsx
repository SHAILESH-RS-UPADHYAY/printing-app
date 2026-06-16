import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as api from '../services/api';
import { TOKEN_KEY } from '../services/api/client';

interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
}

interface Address {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
  isDefault: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  addresses: Address[];
  login: (phone: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  addAddress: (address: Omit<Address, 'id'>) => Promise<void>;
  removeAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => void;
  restoreSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [addresses, setAddresses] = React.useState<Address[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [pendingPhone, setPendingPhone] = React.useState<string | null>(null);

  const isLoggedIn = user !== null;

  const restoreSession = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (token) {
        const profile = await api.getProfile();
        setUser({
          id: profile.user._id || profile.user.id,
          name: profile.user.name,
          phone: profile.user.phone,
          email: profile.user.email || '',
        });
        setAddresses(
          (profile.user.addresses || []).map((a: any) => ({
            id: a.id || a._id,
            fullName: a.fullName,
            phone: a.phone,
            address: a.address,
            city: a.city,
            state: a.state,
            pincode: a.pincode,
            landmark: a.landmark || '',
            isDefault: a.isDefault || false,
          }))
        );
      }
    } catch {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (phone: string) => {
    await api.sendOtp(phone);
    setPendingPhone(phone);
  }, []);

  const verifyOtp = useCallback(async (otp: string): Promise<boolean> => {
    if (!pendingPhone) return false;
    const response = await api.verifyOtp(pendingPhone, otp);
    await AsyncStorage.setItem(TOKEN_KEY, response.token);
    setUser({
      id: response.user._id || response.user.id,
      name: response.user.name,
      phone: response.user.phone,
      email: response.user.email || '',
    });
    setAddresses(
      (response.user.addresses || []).map((a: any) => ({
        id: a.id || a._id,
        fullName: a.fullName,
        phone: a.phone,
        address: a.address,
        city: a.city,
        state: a.state,
        pincode: a.pincode,
        landmark: a.landmark || '',
        isDefault: a.isDefault || false,
      }))
    );
    setPendingPhone(null);
    return true;
  }, [pendingPhone]);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setAddresses([]);
  }, []);

  const handleUpdateProfile = useCallback(async (data: Partial<User>) => {
    await api.updateProfile(data);
    if (user) setUser({ ...user, ...data });
  }, [user]);

  const addAddress = useCallback(async (address: Omit<Address, 'id'>) => {
    const response = await api.addAddress(address);
    setAddresses((prev) => [
      ...prev,
      {
        ...address,
        id: response.address?.id || response.address?._id || Date.now().toString(),
      },
    ]);
  }, []);

  const removeAddress = useCallback(async (id: string) => {
    await api.deleteAddress(id);
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const setDefaultAddress = useCallback((id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isLoading,
        addresses,
        login,
        verifyOtp,
        logout,
        updateProfile: handleUpdateProfile,
        addAddress,
        removeAddress,
        setDefaultAddress,
        restoreSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
