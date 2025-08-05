import { usePatentes } from '@/context/PatentesContext';
import { useLocation } from '@/hooks/useLocation';
import { Auto } from '@/models/Auto';
import { Zona } from '@/models/Zona';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import PopupCard from './PopupCard';

type Props = {
  onClose: () => void;
  patentes: Auto[];
  onGuiar: (auto: Auto) => void;
  onLimpiarRuta: () => void;
  zonas: Zona[];
};

export default function ParkedVehiclePopup({ onClose, patentes, onGuiar, onLimpiarRuta }: Props) {
  const textColor = useThemeColor({}, 'text');
  const inputBackground = useThemeColor({}, 'inputBackground');
  const buttonBackground = useThemeColor({}, 'buttonBackground');
  const infoBoxBackground = useThemeColor({}, 'infoBoxBackground');
  const [zona, setZona] = useState<Zona | null>(null);
  const [patenteSeleccionada, setPatenteSeleccionada] = useState('');
  const [autoSeleccionado, setAutoSeleccionado] = useState<Auto | null>(null);
  const { actualizarPatente } = usePatentes();

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
      cargarZona();
    }
  }, [patentesFiltradas]);

  const resetearAuto = async () => {
    if (!autoSeleccionado) return;

    const autoReseteado = new Auto(
      autoSeleccionado.patente,
      '',
      { latitude: 0, longitude: 0 },
      new Date(),
      0
    );

    await actualizarPatente(autoReseteado);

    setAutoSeleccionado(autoReseteado);

    onLimpiarRuta();

    Alert.alert(
      'Auto reseteado',
      `Se ha reseteado la información del auto ${autoReseteado.patente}`
    );
  };

  const cargarZona = async () => {
  }

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

      <View style={styles.buttonsRow}>
        {/* Botón Guiar */}
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
            onGuiar(autoSeleccionado);
          }}
        >
          <Text style={[styles.buttonText, { color: textColor }]}>Guiar al vehículo</Text>
        </TouchableOpacity>

        {/* Botón Reset */}
        <TouchableOpacity
          disabled={!autoSeleccionado}
          style={[
            styles.secondaryButton,
            { backgroundColor: buttonBackground },
            !autoSeleccionado && { opacity: 0.5 },
          ]}
          onPress={resetearAuto}
        >
          <Text style={[styles.buttonText, { color: textColor }]}>Ya me fui</Text>
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