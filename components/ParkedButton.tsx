import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';

type Props = {
  onPress?: () => void;
  style?: object;
};

export default function ParkedButton({ onPress, style }: Props) {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
        <Image 
            source={require('@/assets/images/map_location.png')}
            resizeMode="contain"
            style={styles.logo}
        />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'black',
    borderRadius: 30,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 24,
    height: 24,
    tintColor: 'white'
  }
});
