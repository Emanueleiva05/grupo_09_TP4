import { useLocation } from '@/hooks/useLocation';
import { Auto } from '@/models/Auto';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import PopupCard from './PopupCard';

type Props = {
  onClose: () => void;
  patentes: Auto[];
  onGuiar: (auto: Auto) => void; // nuevo prop
};

export default function ParkedVehiclePopup({ onClose, patentes, onGuiar }: Props) {
  const textColor = useThemeColor({}, 'text');
  const inputBackground = useThemeColor({}, 'inputBackground');
  const buttonBackground = useThemeColor({}, 'buttonBackground');
  const infoBoxBackground = useThemeColor({}, 'infoBoxBackground');

  const [patenteSeleccionada, setPatenteSeleccionada] = useState('');
  const [autoSeleccionado, setAutoSeleccionado] = useState<Auto | null>(null);

  const { location } = useLocation();

  const patentesFiltradas = useMemo(() => {
    return patentes.filter(
      (p) => p.posicion.latitude !== 0 && p.posicion.longitude !== 0
    );
  }, [patentes]);

  useEffect(() => {
    if (patentesFiltradas.length > 0) {
      const primera = patentesFiltradas[0];
      setPatenteSeleccionada(primera.patente);
      setAutoSeleccionado(primera);
    }
  }, [patentesFiltradas]);

  return (
    <PopupCard>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>
          Seleccione un vehículo estacionado
        </Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={[styles.closeButtonText, { color: textColor }]}>X</Text>
        </TouchableOpacity>
      </View>

      {patentesFiltradas.length > 0 ? (
        <View style={[styles.pickerWrapper, { backgroundColor: inputBackground }]}>
          <Picker
            selectedValue={patenteSeleccionada}
            onValueChange={(itemValue) => {
              setPatenteSeleccionada(itemValue);
              const auto = patentesFiltradas.find((p) => p.patente === itemValue) || null;
              setAutoSeleccionado(auto);
            }}
            dropdownIconColor={textColor}
            style={{ color: textColor }}
          >
            {patentesFiltradas.map((pat) => (
              <Picker.Item key={pat.patente} label={pat.patente} value={pat.patente} />
            ))}
          </Picker>
        </View>
      ) : (
        <View style={[styles.pickerWrapper, { backgroundColor: inputBackground, padding: 8 }]}>
          <Text style={{ color: textColor }}>No hay patentes disponibles</Text>
        </View>
      )}

      <View style={[styles.infoBox, { backgroundColor: infoBoxBackground }]}>
        <Text style={[styles.infoTitle, { color: textColor }]}>Información de la zona</Text>
        <Text style={[styles.infoText, { color: textColor }]}>Ej.: zona celeste</Text>
        <Text style={[styles.infoText, { color: textColor }]}>
          Solo permitido de lunes a sábados de 9hs hasta las 20hs
        </Text>
        <Text style={[styles.infoText, { color: textColor }]}>Precio por hora: $100.00</Text>
      </View>

      <View style={styles.buttonsRow}>
        <TouchableOpacity
          disabled={!location || !autoSeleccionado}
          style={[
            styles.secondaryButton,
            { backgroundColor: buttonBackground },
            (!location || !autoSeleccionado) && { opacity: 0.5 },
          ]}
          onPress={() => {
            if (!location) {
              Alert.alert('Ubicación', 'No se pudo obtener tu ubicación actual.');
              return;
            }
            if (!autoSeleccionado || !autoSeleccionado.posicion) {
              Alert.alert('Auto', 'No se pudo obtener la posición del auto.');
              return;
            }
            onGuiar(autoSeleccionado);  // <-- aquí usamos la función del padre
          }}
        >
          <Text style={[styles.buttonText, { color: textColor }]}>Guiar al vehículo</Text>
        </TouchableOpacity>
      </View>
    </PopupCard>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 16, marginBottom: 8 },
  closeButton: { padding: 4 },
  closeButtonText: { fontWeight: 'bold', fontSize: 16 },
  pickerWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },
  infoBox: {
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  infoTitle: { fontWeight: 'bold', marginBottom: 4 },
  infoText: { fontSize: 12 },
  buttonsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  secondaryButton: {
    borderRadius: 8,
    paddingVertical: 10,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  buttonText: { fontWeight: 'bold', fontSize: 12 },
});