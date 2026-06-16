import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const TOKEN_KEY = '@auth_token';

const extra = Constants.expoConfig?.extra as Record<string, any> | undefined;
const apiUrls = extra?.apiUrl as Record<string, string> | undefined;
const isDev = __DEV__;

const BASE_URL = isDev
  ? apiUrls?.development || 'http://192.168.1.100:4000/api'
  : apiUrls?.production || 'https://print-client-api.up.railway.app/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem(TOKEN_KEY);
    }
    const message = error.response?.data?.error || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export { TOKEN_KEY, BASE_URL };
export default api;
