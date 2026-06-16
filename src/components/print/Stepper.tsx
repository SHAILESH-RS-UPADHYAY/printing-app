import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';

interface StepperProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

export function Stepper({ label, value, min = 1, max = 99, onChange }: StepperProps) {
  const canDecrement = value > min;
  const canIncrement = value < max;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.stepperRow}>
        <TouchableOpacity
          style={[styles.button, !canDecrement && styles.buttonDisabled]}
          onPress={() => canDecrement && onChange(value - 1)}
          disabled={!canDecrement}
        >
          <Ionicons
            name="remove"
            size={20}
            color={canDecrement ? Colors.primary : Colors.textTertiary}
          />
        </TouchableOpacity>
        <Text style={styles.value}>{value}</Text>
        <TouchableOpacity
          style={[styles.button, !canIncrement && styles.buttonDisabled]}
          onPress={() => canIncrement && onChange(value + 1)}
          disabled={!canIncrement}
        >
          <Ionicons
            name="add"
            size={20}
            color={canIncrement ? Colors.primary : Colors.textTertiary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary + '12',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: Colors.surfaceAlt,
  },
  value: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
    marginHorizontal: 20,
    minWidth: 24,
    textAlign: 'center',
  },
});
