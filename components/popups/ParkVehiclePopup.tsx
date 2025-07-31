import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
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

const abrirAppSEM = async () => {
  try {
    // Intento de abrir la app directamente (si se conoce el scheme)
    const urlApp = 'semla://';
    const soporta = await Linking.canOpenURL(urlApp);
    if (soporta) {
      await Linking.openURL(urlApp);
    } else {
      // Si no está instalada, abrimos el Play Store (Android)
      await Linking.openURL('https://play.google.com/store/apps/details?id=ar.edu.unlp.semmobile.laplata');
    }
  } catch (error) {
    console.error('No se pudo abrir la app del SEM:', error);
  }
};


export default function ParkVehiclePopup({ onClose, patentes }: Props) {
  const [patenteSeleccionada, setPatenteSeleccionada] = React.useState('');

  const textColor = useThemeColor({}, 'text');
  const inputBackground = useThemeColor({}, 'inputBackground');
  const buttonBackground = useThemeColor({}, 'buttonBackground');

  React.useEffect(() => {
    if (patentes.length > 0) {
      setPatenteSeleccionada(patentes[0].patente);
    }
  }, [patentes]);

  return (
    <PopupCard>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Estacionar vehículo</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={[styles.closeButtonText, { color: textColor }]}>X</Text>
        </TouchableOpacity>
      </View>

      {patentes.length > 0 ? (
        <Picker
          style={[styles.picker, { backgroundColor: inputBackground, color: textColor }]}
          selectedValue={patenteSeleccionada}
          onValueChange={(itemValue) => setPatenteSeleccionada(itemValue)}
        >
          {patentes.map((auto) => (
            <Picker.Item key={auto.patente} label={auto.patente} value={auto.patente} />
          ))}
        </Picker>
      ) : (
        <Text style={{ color: textColor, marginBottom: 15, }}>No hay patentes disponibles</Text>
      )}

      <View style={[styles.infoBox, { backgroundColor: inputBackground }]}>
        <Text style={[styles.infoTitle, { color: textColor }]}>Información de la zona</Text>
        <Text style={[styles.infoText, { color: textColor }]}>Ej.: zona celeste</Text>
        <Text style={[styles.infoText, { color: textColor }]}>Solo permitido de lunes a sábados de 9hs hasta las 20hs</Text>
        <Text style={[styles.infoText, { color: textColor }]}>Precio por hora: $100.00</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: buttonBackground }]}
        onPress={abrirAppSEM}
      >
        <Text style={[styles.buttonText, { color: textColor }]}>Confirmar estacionamiento</Text>
      </TouchableOpacity>

    </PopupCard>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 16, marginBottom: 8 },
  closeButton: { padding: 4 },
  closeButtonText: { fontWeight: 'bold', fontSize: 16 },
  picker: {
    borderRadius: 8,
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
