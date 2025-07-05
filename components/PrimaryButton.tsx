import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

type PrimaryButtonProps = {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
};

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ title, onPress, style }) => {
  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({},'primary')
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.button, style, {backgroundColor: primaryColor}]}
    >
      <ThemedText type="defaultSemiBold" style={[styles.buttonText,{ color: textColor}]}>
        {title}
      </ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
  borderRadius: 10,
  padding: 12,
  alignItems: 'center',
  marginTop: 12,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
},
  buttonText: {
    fontWeight: '600',
    fontSize: 16,
  },
});

export default PrimaryButton;