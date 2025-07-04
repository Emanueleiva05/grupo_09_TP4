import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Colors } from '../../constants/Colors';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
};

export default function PopupCard({ children, style }: Props) {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    padding: 16,
    width: '90%',
    alignSelf: 'center',
  },
});
