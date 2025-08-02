import { usePatentes } from '@/context/PatentesContext';
import { Coordinates, useLocation } from '@/hooks/useLocation';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Auto } from '@/models/Auto';
import { Horario, Zona } from '@/models/Zona';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { ThemedInput } from '../ThemedInput';
import PopupCard from './PopupCard';

interface Props {
  onClose: () => void;
  patentes: Auto[];
  zona?: Zona | null;
  onEstacionar: (auto: Auto, ubicacion: { latitude: number; longitude: number }, horas: number) => Promise<void>;
}

const abrirAppSEM = async () => {
  try {
    const urlApp = 'semla://';
    const soporta = await Linking.canOpenURL(urlApp);
    if (soporta) {
      await Linking.openURL(urlApp);
    } else {
      await Linking.openURL(
        'https://play.google.com/store/apps/details?id=ar.edu.unlp.semmobile.laplata'
      );
    }
  } catch (error) {
    console.error('No se pudo abrir la app del SEM:', error);
  }
};

export default function ParkVehiclePopup({
  onClose,
  zona,
}: Props) {
  const [ubicacionManual, setUbicacionManual] = useState<Coordinates | null>(null);
  const { location } = useLocation();
  const [horasEstacionado, setHorasEstacionado] = useState('');

  const [patenteSeleccionada, setPatenteSeleccionada] = useState('');
  const { patentes, actualizarPatente } = usePatentes();
  const patentesFiltradas = patentes.filter(
    p => p.posicion.latitude === 0 && p.posicion.longitude === 0
  );
  const patentesStrings = patentesFiltradas.map(p => p.patente);


  const textColor = useThemeColor({}, 'text');
  const inputBackground = useThemeColor({}, 'inputBackground');
  const primary = useThemeColor({}, 'primary');
  const secondary = useThemeColor({}, 'secondary');

  useEffect(() => {
      if (patentesFiltradas.length > 0) {
        setPatenteSeleccionada(patentesFiltradas[0].patente);
      }
    }, [patentesFiltradas]);

  return (
    <PopupCard>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Estacionar vehículo</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={[styles.closeButtonText, { color: textColor }]}>X</Text>
        </TouchableOpacity>
      </View>

      {patentesStrings.length > 0 ? (
        <View style={[styles.pickerWrapper, { backgroundColor: inputBackground }]}>
          <Picker
            selectedValue={patenteSeleccionada}
            onValueChange={(itemValue) => {
              setPatenteSeleccionada(itemValue);
              const autoSeleccionado = patentesFiltradas.find(p => p.patente === itemValue);
              console.log('Picker cambió a patente:', itemValue);
              console.log('Objeto auto correspondiente:', autoSeleccionado);
            }}
            dropdownIconColor={textColor}
            style={{ color: textColor }}
          >
            {patentesFiltradas.map(pat => (
              <Picker.Item
                key={pat.patente}
                label={pat.patente}
                value={pat.patente}
              />
            ))}
          </Picker>
        </View>
      ) : (
        <View style={[styles.pickerWrapper, { backgroundColor: inputBackground, padding: 8 }]}>
          <Text style={{ color: textColor }}>No hay patentes disponibles</Text>
        </View>
      )}

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
              console.log('Seleccionar manualmente...');
            }}
          >
            <Text style={{ color: textColor }}>Seleccionar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.infoBox, { backgroundColor: inputBackground }]}>
        <Text style={[styles.infoTitle, { color: textColor }]}>
          ¿Cuánto tiempo va a estar el auto estacionado?
        </Text>
        <View style={styles.horasRow}>
          <ThemedInput
            style={{ borderWidth: 0 }}
            value={horasEstacionado}
            onChangeText={setHorasEstacionado}
            placeholder="Ej.: 1"
            keyboardType="numeric"
            inputMode="numeric"
          />
          <Text style={[styles.infoText, { color: textColor }]}> hora/s</Text>
        </View>
      </View>

      <View style={[styles.infoBox, { backgroundColor: inputBackground }]}>
        <Text style={[styles.infoTitle, { color: textColor }]}>
          Información de la zona
        </Text>
        {zona ? (
          <View>
            <Text style={[styles.infoText, { color: textColor }]}>
              {zona.nombre}
            </Text>
            <Text style={[styles.infoText, { color: textColor }]}>
              Precio por hora: ${zona.precioHora.toFixed(2)}
            </Text>
            {zona.horariosPermitidos.map((h: Horario) => (
              <Text key={h.dia} style={[styles.infoText, { color: textColor }]}>
                {h.dia}: {h.desde} - {h.hasta}
              </Text>
            ))}
          </View>
        ) : (
          <Text style={{ color: textColor }}>
            No hay zona disponible en esta ubicación
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: zona ? primary : secondary }]}
        onPress={async () => {
          const ubicacionFinal = ubicacionManual ?? location;

          if (!ubicacionFinal) {
            console.warn('No se pudo obtener la ubicación');
            return;
          }

          const autoIndex = patentes.findIndex(p => p.patente === patenteSeleccionada);
          if (autoIndex === -1) {
            console.warn('Auto no encontrado');
            return;
          }

          const autoOriginal = patentes[autoIndex];

          const autoActualizado = new Auto(
            autoOriginal.patente,
            autoOriginal.zonaId,
            ubicacionFinal,
            new Date(),
            parseInt(horasEstacionado, 10) || 0
          );

          await actualizarPatente(autoActualizado);

          console.log(`Patente ${autoActualizado.patente} actualizada con posición:`, ubicacionFinal);

          await abrirAppSEM();

          onClose();
        }}
      >
        <Text style={{ color: textColor }}>Confirmar estacionamiento</Text>
      </TouchableOpacity>

    </PopupCard>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
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