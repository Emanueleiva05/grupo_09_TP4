import React from 'react';
import { TextInput, StyleSheet, TextInputProps, StyleProp, ViewStyle } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

type ThemedInputProps = TextInputProps & {
  containerStyle?: StyleProp<ViewStyle>;
  lightPlaceholderColor?: string;
  darkPlaceholderColor?: string;
  lightTextColor?: string;
  darkTextColor?: string;
};

export function ThemedInput({
  containerStyle,
  style,
  lightPlaceholderColor,
  darkPlaceholderColor,
  lightTextColor,
  darkTextColor,
  ...rest
}: ThemedInputProps) {
    const textColor = useThemeColor(
        { light: lightTextColor ?? '#000', dark: darkTextColor ?? '#fff' },
        'text'
    );

  const placeholderColor = useThemeColor(
    { light: lightPlaceholderColor ?? '#888', dark: darkPlaceholderColor ?? '#aaa' },
    'text'
  );



  return (
    <TextInput
      placeholderTextColor={placeholderColor}
      style={[styles.input, { color: textColor}, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
    color: '#000',
    fontSize: 16,
    //backgroundColor: '#1d3d47',
    padding: 10,
    marginVertical: 8,
  },
});
