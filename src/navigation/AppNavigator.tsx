import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { TabNavigator } from './TabNavigator';
import { SplashScreen } from '../screens/SplashScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { PrintCustomizationScreen } from '../screens/PrintCustomizationScreen';
import { CartScreen } from '../screens/CartScreen';
import { DeliveryScreen } from '../screens/DeliveryScreen';
import { PaymentScreen } from '../screens/PaymentScreen';
import { OrderConfirmationScreen } from '../screens/OrderConfirmationScreen';
import { OrderTrackingScreen } from '../screens/OrderTrackingScreen';
import { PhoneAuthScreen } from '../screens/PhoneAuthScreen';
import { Colors } from '../constants/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ animation: 'fade' }}
        />
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="MainTabs"
          component={TabNavigator}
          options={{ animation: 'fade', gestureEnabled: false }}
        />
        <Stack.Screen
          name="PrintCustomization"
          component={PrintCustomizationScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="Cart"
          component={CartScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="Delivery"
          component={DeliveryScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="Payment"
          component={PaymentScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="OrderConfirmation"
          component={OrderConfirmationScreen}
          options={{ animation: 'fade' }}
        />
        <Stack.Screen
          name="OrderTracking"
          component={OrderTrackingScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="PhoneAuth"
          component={PhoneAuthScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
