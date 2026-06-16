import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { useAuth } from '../context/AuthContext';

interface SplashScreenProps {
  navigation: any;
}

export function SplashScreen({ navigation }: SplashScreenProps) {
  const { restoreSession } = useAuth();
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const spinnerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(spinnerOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(async () => {
      await restoreSession();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Onboarding' }],
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={[Colors.gradientStart, Colors.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <View style={styles.content}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: logoScale }],
              opacity: logoOpacity,
            },
          ]}
        >
          <View style={styles.logoCircle}>
            <Ionicons name="print" size={52} color={Colors.white} />
          </View>
        </Animated.View>

        <Animated.Text style={[styles.appName, { opacity: textOpacity }]}>
          PrintClient
        </Animated.Text>

        <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
          Print Documents with Ease
        </Animated.Text>
      </View>

      <Animated.View style={[styles.footer, { opacity: spinnerOpacity }]}>
        <Ionicons name="ellipse" size={8} color="rgba(255,255,255,0.6)" style={styles.dot} />
        <Ionicons name="ellipse" size={8} color="rgba(255,255,255,0.6)" style={styles.dot} />
        <Ionicons name="ellipse" size={8} color="rgba(255,255,255,0.6)" style={styles.dot} />
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
    letterSpacing: 0.5,
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    marginHorizontal: 4,
  },
});
