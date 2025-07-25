import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import PopupCard from './PopupCard';

type Auto = {
  patente: string;
  zonaId: string;
  posicion: { latitude: number; longitude: number };
  fechaEstacionamiento?: Date;
};

type Props = {
  onClose: () => void;
  patentes: Auto[];
};

export default function ParkVehiclePopup({ onClose, patentes }: Props) {
  const [patenteSeleccionada, setPatenteSeleccionada] = React.useState('');

  React.useEffect(() => {
    if (patentes.length > 0) {
      setPatenteSeleccionada(patentes[0].patente);
    }
  }, [patentes]);

  return (
    <PopupCard>
      <View style={styles.header}>
        <Text style={styles.title}>Estacionar vehículo</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>
      </View>

      {patentes.length > 0 ? (
        <Picker
          style={styles.picker}
          selectedValue={patenteSeleccionada}
          onValueChange={(itemValue) => setPatenteSeleccionada(itemValue)}
        >
          {patentes.map((auto) => (
            <Picker.Item key={auto.patente} label={auto.patente} value={auto.patente} />
          ))}
        </Picker>
      ) : (
        <Text style={{ color: Colors.light.text }}>No hay patentes disponibles</Text>
      )}

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
