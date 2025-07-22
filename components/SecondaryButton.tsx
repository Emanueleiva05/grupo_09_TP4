import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import {
    GestureResponderEvent,
    StyleProp,
    StyleSheet,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';

type PrimaryButtonProps = {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
};

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ title, onPress, style }) => {
  const textColor = useThemeColor({}, 'text');
  const secondaryColor = useThemeColor({},'secondary')
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.button, style, {backgroundColor: secondaryColor}]}
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