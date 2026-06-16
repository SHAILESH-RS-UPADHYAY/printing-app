import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TabParamList } from './types';
import { Colors } from '../constants/colors';
import { HomeScreen } from '../screens/HomeScreen';
import { UploadScreen } from '../screens/UploadScreen';
import { ShopScreen } from '../screens/ShopScreen';
import { MyOrdersScreen } from '../screens/MyOrdersScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator<TabParamList>();

type TabIconName = React.ComponentProps<typeof Ionicons>['name'];

const TAB_ICONS: Record<keyof TabParamList, { focused: TabIconName; unfocused: TabIconName }> = {
  Home: { focused: 'home', unfocused: 'home-outline' },
  Upload: { focused: 'cloud-upload', unfocused: 'cloud-upload-outline' },
  ShopTab: { focused: 'storefront', unfocused: 'storefront-outline' },
  Orders: { focused: 'receipt', unfocused: 'receipt-outline' },
  Profile: { focused: 'person', unfocused: 'person-outline' },
};

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, size }) => {
          const icons = TAB_ICONS[route.name as keyof TabParamList];
          return (
            <Ionicons
              name={focused ? icons.focused : icons.unfocused}
              size={size}
              color={focused ? Colors.primary : Colors.textTertiary}
            />
          );
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.border,
          borderTopWidth: 0.5,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="Upload"
        component={UploadScreen}
        options={{ tabBarLabel: 'Upload' }}
      />
      <Tab.Screen
        name="ShopTab"
        component={ShopScreen}
        options={{ tabBarLabel: 'Shop' }}
      />
      <Tab.Screen
        name="Orders"
        component={MyOrdersScreen}
        options={{ tabBarLabel: 'Orders' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
}
