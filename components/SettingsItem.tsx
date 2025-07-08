// components/SettingsItem.tsx
import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

type Props = {
  icon: string;
  text: string;
  danger?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
};

export function SettingsItem({ icon, text, danger = false, onPress, style }: Props) {
  const color = useThemeColor({}, danger ? 'background' : 'text');

  return (
    <TouchableOpacity style={[styles.item, style]} onPress={onPress}>
      <Ionicons name={icon as any} size={20} color={color} style={styles.icon} />
      <ThemedText style={[styles.text, { color }]}>{text}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  icon: {
    marginRight: 12,
  },
  text: {
    fontSize: 16,
  },
});
