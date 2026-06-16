import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { CartProvider } from './src/context/CartContext';
import { AuthProvider } from './src/context/AuthContext';
import { OrderProvider } from './src/context/OrderContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { Colors } from './src/constants/colors';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
        <AuthProvider>
          <CartProvider>
            <OrderProvider>
              <AppNavigator />
            </OrderProvider>
          </CartProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
