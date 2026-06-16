import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { useAuth } from '../context/AuthContext';

const MENU_ITEMS = [
  { icon: 'location-outline', label: 'My Addresses', screen: 'AddressForm' },
  { icon: 'document-outline', label: 'Saved Documents', screen: '' },
  { icon: 'receipt-outline', label: 'Order History', screen: 'Orders' },
  { icon: 'information-circle-outline', label: 'About App', screen: '' },
  { icon: 'star-outline', label: 'Rate Us', screen: '' },
  { icon: 'share-outline', label: 'Share App', screen: '' },
];

export function ProfileScreen({ navigation }: any) {
  const { isLoggedIn, user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Account</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <TouchableOpacity
          style={styles.profileCard}
          onPress={() => {
            if (!isLoggedIn) navigation.navigate('PhoneAuth');
          }}
          activeOpacity={0.7}
        >
          <View style={styles.avatar}>
            <Ionicons name="person" size={36} color={Colors.primary} />
          </View>
          {isLoggedIn ? (
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name || 'User'}</Text>
              <Text style={styles.profilePhone}>{user?.phone}</Text>
            </View>
          ) : (
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Sign In</Text>
              <Text style={styles.profilePhone}>Login to access your account</Text>
            </View>
          )}
          <Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
        </TouchableOpacity>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, index < MENU_ITEMS.length - 1 && styles.menuItemBorder]}
              activeOpacity={0.7}
            >
              <Ionicons name={item.icon as any} size={22} color={Colors.textSecondary} />
              <Text style={styles.menuItemLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        {isLoggedIn && (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color={Colors.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        )}

        {/* App Version */}
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    margin: 16,
    padding: 16,
    borderRadius: 14,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  profilePhone: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  menuSection: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    borderRadius: 14,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  menuItemLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text,
    marginLeft: 14,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.errorLight,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.error,
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 13,
    color: Colors.textTertiary,
    marginTop: 24,
    marginBottom: 40,
  },
});
