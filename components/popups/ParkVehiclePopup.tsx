import { Coordinates, useLocation } from '@/hooks/useLocation';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Horario, Zona } from '@/models/Zona';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemedInput } from '../ThemedInput';
import PopupCard from './PopupCard';

type Auto = {
  patente: string;
  zonaId: string;
  posicion: { latitude: number; longitude: number };
  fechaEstacionamiento?: Date;
};

interface Props {
  onClose: () => void;
  patentes: Auto[];
  zona?: Zona | null;
  onEstacionar: (patente: string, ubicacion: Coordinates, horas: number) => void;
}

export default function ParkVehiclePopup({ onClose, patentes, zona, onEstacionar }: Props) {
  const [patenteSeleccionada, setPatenteSeleccionada] = React.useState('');

  const [ubicacionManual, setUbicacionManual] = React.useState<Coordinates | null>(null);
  const { location } = useLocation();
  const [horasEstacionado, setHorasEstacionado] = useState('');

  const textColor = useThemeColor({}, 'text');
  const inputBackground = useThemeColor({}, 'inputBackground');
  const primary = useThemeColor({}, 'primary');
  const secondary = useThemeColor({}, 'secondary');

  React.useEffect(() => {
    if (patentes.length > 0) {
      setPatenteSeleccionada(patentes[0].patente);
    }
  }, [patentes]);

  const handleConfirm = () => {
    if (!patenteSeleccionada) {
      Alert.alert('Error', 'Debe seleccionar un vehículo.');
      return;
    }

    const ubicacionFinal = ubicacionManual ?? location;
    if (!ubicacionFinal) {
      Alert.alert('Error', 'No se pudo obtener la ubicación.');
      return;
    }

    const horas = parseInt(horasEstacionado, 10);
    if (isNaN(horas) || horas < 1) {
      Alert.alert('Error', 'Ingrese una cantidad de horas válida (mínimo 1).');
      return;
    }

    onEstacionar(patenteSeleccionada, ubicacionFinal, horas);
    onClose();
  };

  return (
    <PopupCard>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Estacionar vehículo</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={[styles.closeButtonText, { color: textColor }]}>X</Text>
        </TouchableOpacity>
      </View>

      {patentes.length > 0 ? (
        <View style={[styles.pickerWrapper, { backgroundColor: inputBackground }]}>
          <Picker
            selectedValue={patenteSeleccionada}
            onValueChange={(itemValue) => setPatenteSeleccionada(itemValue)}
            dropdownIconColor={secondary}
          >
            {patentes.map((auto) => (
              <Picker.Item key={auto.patente} label={auto.patente} value={auto.patente} color={textColor} />
            ))}
          </Picker>
        </View>
      ) : (
        <Text style={{ color: textColor }}>No hay patentes disponibles</Text>
      )}

      {/* Seleccion entre ubicacion actual y punto en el mapa */}
      <View style={[styles.infoBox, { backgroundColor: inputBackground }]}>
        <Text style={[styles.infoTitle, { color: textColor }]}>Ubicación:</Text>
        <View style={styles.locationRow}>
          <Text style={[styles.infoText, { color: textColor, flex: 1 }]}>
            {ubicacionManual
              ? `${ubicacionManual.latitude.toFixed(5)}, ${ubicacionManual.longitude.toFixed(5)}`
              : 'Posición actual'}
          </Text>
          <TouchableOpacity
            style={[styles.selectButton, { backgroundColor: primary }]}
            onPress={() => {
              console.log("Seleccionar manualmente...");
            }}
          >
            <Text style={{ color: textColor }}>Seleccionar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.infoBox, { backgroundColor: inputBackground }]}>
        <Text style={[styles.infoTitle, { color: textColor }]}>¿Cuanto tiempo va a estar el auto estacionado?</Text>
        <View style={styles.horasRow}>
          <ThemedInput
            style={{ borderWidth: 0 }}
            value={horasEstacionado}
            onChangeText={setHorasEstacionado}
            placeholder='Ej.: 1'
            keyboardType="numeric"
            inputMode="numeric"
          />
          <Text style={[styles.infoText, { color: textColor }]}> hora/s</Text>
        </View>
      </View>

      <View style={[styles.infoBox, { backgroundColor: inputBackground }]}>
        <Text style={[styles.infoTitle, { color: textColor }]}>Información de la zona</Text>
        {zona ? (
          <View>
            <Text style={[styles.infoText, { color: textColor }]}>{zona.nombre}</Text>
            <Text style={[styles.infoText, { color: textColor }]}>Precio por hora: ${zona.precioHora.toFixed(2)}</Text>
            {zona.horariosPermitidos.map((h: Horario) => (
              <Text key={h.dia} style={[styles.infoText, { color: textColor }]}>
                {h.dia}: {h.desde} - {h.hasta}
              </Text>
            ))}
          </View>
        ) : (
          <Text style={{ color: textColor }}>No hay zona disponible en esta ubicación</Text>
        )}
      </View>


      <TouchableOpacity
        style={[styles.button, { backgroundColor: zona ? primary : secondary }]}
        // disabled={!zona}
        onPress={handleConfirm}
      >
        <Text style={{ color: textColor }}>Confirmar estacionamiento</Text>
      </TouchableOpacity>
    </PopupCard>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 16, marginBottom: 8 },
  closeButton: { padding: 4 },
  closeButtonText: { fontWeight: 'bold', fontSize: 16 },

  infoBox: {
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  infoTitle: { fontWeight: 'bold', marginBottom: 8 },
  infoText: { fontSize: 14, marginBottom: 4 },
  button: {
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  selectButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 100,
    alignItems: 'center',
  },
  pickerWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },
  horasRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
});
