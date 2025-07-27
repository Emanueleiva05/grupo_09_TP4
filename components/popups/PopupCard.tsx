import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
};

export default function PopupCard({ children, style }: Props) {
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'secondary');
  
  return (
    <View style={[
      styles.card,
      { backgroundColor, borderColor, borderWidth: 1 },
      style
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    width: '90%',
    alignSelf: 'center',
  },
});
