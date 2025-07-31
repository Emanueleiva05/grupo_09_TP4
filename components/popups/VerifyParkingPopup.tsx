import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import PopupCard from './PopupCard';

type Props = { onClose: () => void; };

export default function VerifyParkingPopup({ onClose }: Props) {
  const textColor = useThemeColor({}, 'text');
  const inputBackground = useThemeColor({}, 'inputBackground');
  const buttonBackground = useThemeColor({}, 'buttonBackground');

  return (
    <PopupCard>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Verificar vehículo estacionado</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={[styles.closeButtonText, { color: textColor }]}>X</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Ingrese patente"
        placeholderTextColor="gray"
        style={[styles.input, { backgroundColor: inputBackground, color: textColor }]}
      />

      <View style={[styles.infoBox, { backgroundColor: inputBackground }]}>
        <Text style={[styles.infoTitle, { color: textColor }]}>Información de la zona</Text>
        <Text style={[styles.infoText, { color: textColor }]}>Ej.: zona celeste</Text>
        <Text style={[styles.infoText, { color: textColor }]}>Solo permitido de lunes a sábados de 9hs hasta las 20hs</Text>
        <Text style={[styles.infoText, { color: textColor }]}>Precio por hora: $100.00</Text>
      </View>

      <TouchableOpacity style={[styles.button, { backgroundColor: buttonBackground }]}>
        <Text style={[styles.buttonText, { color: textColor }]}>Verificar pago</Text>
      </TouchableOpacity>
    </PopupCard>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 16, marginBottom: 8 },
  closeButton: { padding: 4 },
  closeButtonText: { fontWeight: 'bold', fontSize: 16 },
  input: {
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  infoBox: {
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  infoTitle: { fontWeight: 'bold', marginBottom: 4 },
  infoText: { fontSize: 12 },
  button: {
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonText: { fontWeight: 'bold' },
});
