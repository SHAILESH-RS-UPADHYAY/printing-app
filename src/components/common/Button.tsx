import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
}: ButtonProps) {
  const sizeStyles = {
    small: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
    medium: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12 },
    large: { paddingVertical: 18, paddingHorizontal: 32, borderRadius: 14 },
  };

  const textSizes = {
    small: 13,
    medium: 15,
    large: 17,
  };

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.9}
        style={style}
      >
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.button, sizeStyles[size]]}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} size="small" />
          ) : (
            <Text style={[styles.text, { fontSize: textSizes[size] }]}>
              {title}
            </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.button,
        sizeStyles[size],
        variant === 'outline' && styles.outlineButton,
        variant === 'ghost' && styles.ghostButton,
        disabled && styles.disabledButton,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? Colors.primary : Colors.white}
          size="small"
        />
      ) : (
        <Text
          style={[
            styles.text,
            { fontSize: textSizes[size] },
            variant === 'outline' && styles.outlineText,
            variant === 'ghost' && styles.ghostText,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: Colors.white,
    fontWeight: '700',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  outlineText: {
    color: Colors.primary,
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: Colors.primary,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
