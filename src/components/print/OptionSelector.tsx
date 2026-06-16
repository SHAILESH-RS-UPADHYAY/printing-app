import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';

interface Option {
  id: string;
  label: string;
  description?: string;
  price?: number;
}

interface OptionSelectorProps {
  title: string;
  options: Option[];
  selectedId: string;
  onSelect: (id: string) => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function OptionSelector({ title, options, selectedId, onSelect, icon }: OptionSelectorProps) {
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        {icon && <Ionicons name={icon} size={18} color={Colors.textSecondary} style={styles.titleIcon} />}
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.optionsRow}>
        {options.map((opt) => {
          const isSelected = opt.id === selectedId;
          return (
            <TouchableOpacity
              key={opt.id}
              style={[styles.option, isSelected && styles.selectedOption]}
              onPress={() => onSelect(opt.id)}
              activeOpacity={0.7}
            >
              <Text style={[styles.optionLabel, isSelected && styles.selectedOptionLabel]}>
                {opt.label}
              </Text>
              {opt.description && (
                <Text style={[styles.optionDesc, isSelected && styles.selectedOptionDesc]}>
                  {opt.description}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleIcon: {
    marginRight: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  option: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: Colors.primary + '12',
    borderColor: Colors.primary,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  selectedOptionLabel: {
    color: Colors.primary,
  },
  optionDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  selectedOptionDesc: {
    color: Colors.primaryLight,
  },
});
