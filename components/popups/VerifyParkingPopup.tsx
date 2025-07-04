import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import PopupCard from './PopupCard';

type Props = {
  onClose: () => void;
};

export default function VerifyParkingPopup({ onClose }: Props) {
  return (
    <PopupCard>
      <Text style={styles.title}>Verificar vehículo estacionado</Text>

      <TextInput
        placeholder="Ingrese patente"
        placeholderTextColor="gray"
        style={styles.input}
      />

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Información de la zona</Text>
        <Text style={styles.infoText}>Ej.: zona celeste</Text>
        <Text style={styles.infoText}>Solo permitido de lunes a sábados de 9hs hasta las 20hs</Text>
        <Text style={styles.infoText}>Precio por hora: $100.00</Text>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Verificar pago</Text>
      </TouchableOpacity>
    </PopupCard>
  );
}

const styles = StyleSheet.create({
  title: { color: 'white', fontSize: 16, marginBottom: 8 },
  input: {
    backgroundColor: '#2c2f33',
    color: 'white',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  infoBox: {
    backgroundColor: '#2c2f33',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  infoTitle: { color: 'white', fontWeight: 'bold', marginBottom: 4 },
  infoText: { color: 'white', fontSize: 12 },
  button: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
});
