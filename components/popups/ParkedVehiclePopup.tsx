import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import PopupCard from './PopupCard';

type Props = {
  onClose: () => void;
};

export default function ParkedVehiclePopup({ onClose }: Props) {
  return (
    <PopupCard>
      <View style={styles.header}>
        <Text style={styles.title}>Vehículo estacionado</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>
      </View>

      <Picker style={styles.picker}>
        <Picker.Item label="XXX 000" value="xxx000" />
        <Picker.Item label="YYY 111" value="yyy111" />
      </Picker>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Información de la zona</Text>
        <Text style={styles.infoText}>Ej.: zona celeste</Text>
        <Text style={styles.infoText}>Solo permitido de lunes a sábados de 9hs hasta las 20hs</Text>
        <Text style={styles.infoText}>Precio por hora: $100.00</Text>
      </View>

      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.buttonText}>Ya me fui!</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.buttonText}>Guiar al vehículo</Text>
        </TouchableOpacity>
      </View>
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
  buttonsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  secondaryButton: {
    backgroundColor: Colors.light.buttonBackground,
    borderRadius: 8,
    paddingVertical: 10,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  buttonText: { color: Colors.light.text, fontWeight: 'bold', fontSize: 12 },
});
