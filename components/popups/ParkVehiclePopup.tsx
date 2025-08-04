import { Coordinates, useLocation } from '@/hooks/useLocation';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Coordenada, Horario, Zona } from '@/models/Zona';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
  posicion: Coordenada,
}

interface Direccion {
  house_number?: string;
  road?: string;
  city?: string;
  state_district?: string;
  state?: string;
  postcode?: string;
  country?: string;
  country_code?: string;
}

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

const reverseGeocode = async (latitude: number, longitude: number) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      {
        headers: {
          'User-Agent': 'estacionamientoLaPlata/1.0 (irineohiriart@alu.frlp.utn.edu.ar)' // Reemplazalo con tus datos
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.address; // Ej: {road, city, state, country, ...}
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    return null;
  }
};

  const getCurrentAndNextDay = () => {
    const now = new Date();
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    
    const currentDayIndex = now.getDay();
    const currentDay = days[currentDayIndex];
    const nextDay = days[(currentDayIndex + 1) % 7]; // Wrap around to the start of the week
    return { currentDay, nextDay };
  };


export default function ParkVehiclePopup({ onClose, patentes, zona, onEstacionar, posicion }: Props) {
  const [patenteSeleccionada, setPatenteSeleccionada] = React.useState('');
  const { currentDay, nextDay } = getCurrentAndNextDay();
  const [direccion, setDireccion] = useState<Direccion | null>(null);
  const { location } = useLocation();
  const [horasEstacionado, setHorasEstacionado] = useState('');

  const textColor = useThemeColor({}, 'text');
  const inputBackground = useThemeColor({}, 'inputBackground');
  const primary = useThemeColor({}, 'primary');
  const secondary = useThemeColor({}, 'secondary');

  const filteredHorarios = zona?.horariosPermitidos.filter(h => 
    h.dia === currentDay || h.dia === nextDay
  );

  useEffect(() => {
    if (patentes.length > 0) {
      setPatenteSeleccionada(patentes[0].patente);
    }
  }, [patentes]);

  const fetchAddress = async (posicion: Coordenada) => {
      const result = await reverseGeocode(posicion.latitude, posicion.longitude);
      setDireccion(result);
      
    };

  useEffect(() => {
    fetchAddress(posicion);
  })

  const handleConfirm = () => {
    if (!patenteSeleccionada) {
      Alert.alert('Error', 'Debe seleccionar un vehículo.');
      return;
    }

    const ubicacionFinal = posicion ?? location;
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

      <View style={[styles.infoBox, { backgroundColor: inputBackground }]}>
        <Text style={[styles.infoTitle, { color: textColor }]}>Ubicación:</Text>
        <View style={styles.locationRow}>
          <Text style={[styles.infoText, { color: textColor, flex: 1 }]}>
            <Text>
              {direccion ? (
                `${direccion.road} ${direccion.house_number || ''}, ${direccion.city}`
               ) : (
              <Text style={[styles.infoText, { color: textColor, flex: 1 }]}>
                 Cargando dirección...
              </Text>
              )}
            </Text>
          </Text>
          <TouchableOpacity
            style={[styles.selectButton, { backgroundColor: primary }]}
            onPress={() => {if (posicion) {fetchAddress(posicion)}}}
          >
            <Text style={{ color: textColor }}>Seleccion del mapa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.selectButton, { backgroundColor: primary, marginLeft: 10 }]}
            onPress={() => {if (location) {fetchAddress(location)}}}
          >
            <Text style={{ color: textColor }}>Usar ubicación actual</Text>
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
        <Text style={[styles.infoTitle, { color: textColor }]}>Zona</Text>
        {zona ? (
          <View>
            <Text style={[styles.infoText, { color: textColor }]}>{zona.nombre}</Text>
            <Text style={[styles.infoText, { color: textColor }]}>Precio por hora: ${zona.precioHora.toFixed(2)}</Text>
            {filteredHorarios && filteredHorarios.length > 0 ? (
              filteredHorarios.map((h: Horario) => (
                <Text key={h.dia} style={[styles.infoText, { color: textColor }]}>
                  {h.dia}: {h.desde} - {h.hasta}
                </Text>
              ))
            ) : (
              <Text style={{ color: textColor }}>No hay horarios pagos hoy ni tampoco mañana.</Text>
            )}
          </View>
        ) : (
          <Text style={{ color: textColor }}>Esta ubicación no es una zona paga.</Text>
        )}
      </View>


      <TouchableOpacity
        style={[styles.button, { backgroundColor: zona ? primary : secondary }]}
        // disabled={!zona}
        onPress={ handleConfirm}
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
