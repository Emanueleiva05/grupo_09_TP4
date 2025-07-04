import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import PopupCard from './PopupCard';

type Props = { onClose: () => void; };

export default function ParkVehiclePopup({ onClose }: Props) {
  return (
    <PopupCard>
      <View style={styles.header}>
        <Text style={styles.title}>Estacionar vehículo</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>
      </View>

      <Picker style={styles.picker}>
        <Picker.Item label="XXX 000" value="xxx000" />
        <Picker.Item label="ZZZ 222" value="zzz222" />
      </Picker>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Información de la zona</Text>
        <Text style={styles.infoText}>Ej.: zona celeste</Text>
        <Text style={styles.infoText}>Solo permitido de lunes a sábados de 9hs hasta las 20hs</Text>
        <Text style={styles.infoText}>Precio por hora: $100.00</Text>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Confirmar estacionamiento</Text>
      </TouchableOpacity>
    </PopupCard>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: Colors.light.text, fontSize: 16, marginBottom: 8 },
  closeButton: { padding: 4 },
  closeButtonText: { color: Colors.light.text, fontWeight: 'bold', fontSize: 16 },
  picker: {
    backgroundColor: Colors.light.inputBackground,
    color: Colors.light.text,
    borderRadius: 8,
    marginBottom: 12,
  },
  infoBox: {
    backgroundColor: Colors.light.inputBackground,
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  infoTitle: { color: Colors.light.text, fontWeight: 'bold', marginBottom: 4 },
  infoText: { color: Colors.light.text, fontSize: 12 },
  button: {
    backgroundColor: Colors.light.buttonBackground,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonText: { color: Colors.light.text, fontWeight: 'bold' },
});
