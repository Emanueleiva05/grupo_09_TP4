import ParkedButton from '@/components/ParkedButton';
import ParkedVehiclePopup from '@/components/popups/ParkedVehiclePopup';
import ParkVehiclePopup from '@/components/popups/ParkVehiclePopup';
import VerifyParkingPopup from '@/components/popups/VerifyParkingPopup'; // Importar VerifyParkingPopup
import ZonaInfoPopup from '@/components/popups/ZonaInfoPopUp';
import { usePatentes } from '@/context/PatentesContext';
import { crearNotificacion } from '@/hooks/notificacionService';
import { useLocation } from '@/hooks/useLocation';
import { Auto } from '@/models/Auto';
import { Notificacion } from '@/models/Notificacion';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { MapPressEvent, Marker, Polygon } from 'react-native-maps';
import { v4 as uuidv4 } from 'uuid';
import CarButton from '../../components/CarButton';
import NotificationButton from '../../components/NotificationButton';
import CrearZonaPopup from '../../components/popups/CreateZonePopUp';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';
import { Coordenada, Horario, Zona } from '../../models/Zona';

export default function MapScreen() {
  const { usuario } = useAuth();
  const esAdmin = usuario?.rol === 'admin';
  const esGuardia = usuario?.rol === 'guardia';
  const esCliente = usuario?.rol === 'cliente';
  const { location, errorLocation } = useLocation();
  const [zonas, setZonas] = useState<Zona[]>([]);
  const [selectedPoints, setSelectedPoints] = useState<Coordenada[]>([]);
  const [showCrearZonaPopup, setShowCrearZonaPopup] = useState(false);
  const [showParkingPopup, setShowParkingPopup] = useState(false);
  const [showParkedPopup, setShowParkedPopup] = useState(false);
  const [showVerifyParkingPopup, setShowVerifyParkingPopup] = useState(false); // Estado nuevo para VerifyParkingPopup
  const [zonaSeleccionada, setZonaSeleccionada] = useState<Zona | null>(null);
  const [mostrarZonaPopup, setMostrarZonaPopup] = useState(false);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const { patentes, actualizarPatente, agregarPatente, cargarPatentes } = usePatentes();

  useEffect(() => {
    cargarZonas();
    cargarNotificaciones();
  }, []);

  useEffect(() => {
    cargarPatentes();
  }, [cargarPatentes]);

  const cargarZonas = async () => {
    try {
      const data = await AsyncStorage.getItem('zonasRegistradas');
      if (data) {
        const zonasGuardadas = JSON.parse(data);
        setZonas(zonasGuardadas);
      }
    } catch (error) {
      console.error('Error cargando zonas:', error);
    }
  };

  const guardarZonas = async (zonasAGuardar: Zona[]) => {
    try {
      await AsyncStorage.setItem('zonasRegistradas', JSON.stringify(zonasAGuardar));
      setZonas(zonasAGuardar);
    } catch (error) {
      console.error('Error guardando zonas:', error);
    }
  };

  const cargarNotificaciones = async () => {
    try {
      const data = await AsyncStorage.getItem('notificaciones');
      if (data) {
        const notificacionesGuardadas = JSON.parse(data);
        setNotificaciones(notificacionesGuardadas);
      }
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
    }
  };

  const handleMapPress = (e: MapPressEvent) => {
    if (!esAdmin) return; // Solo admin puede seleccionar puntos
    const newPoint = e.nativeEvent.coordinate;
    setSelectedPoints((prev) => [...prev, newPoint]);
  };

  const cancelarSeleccion = () => {
    setSelectedPoints([]);
  };

  const crearZona = () => {
    if (selectedPoints.length < 3) {
      Alert.alert('Error', 'Debes seleccionar al menos 3 puntos para crear una zona.');
      return;
    }
    setShowCrearZonaPopup(true);
  };

  const handleEstacionar = async (auto: Auto, ubicacion: { latitude: number; longitude: number }, horas: number) => {
    auto.actualizarEstacionamiento(ubicacion, new Date(), horas);
    await actualizarPatente(auto); 
    setShowParkingPopup(false);
  };


  const guardarNuevaZona = async (nombre: string, precioHora: number, horarios: Horario[], color: string) => {
    const nuevaZona = new Zona(uuidv4(), nombre, selectedPoints, horarios, precioHora, color);
    const nuevasZonas = [...zonas, nuevaZona];
    await guardarZonas(nuevasZonas);
    if (usuario?.id) {
      await crearNotificacion(
        usuario.id.toString(),
        'Zona Creada',
        `La zona "${nuevaZona.nombre}" ha sido creada.`,
        'recordatorio'
      );
    }
    setSelectedPoints([]);
    setShowCrearZonaPopup(false);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider="google"
        initialRegion={{
          latitude: -34.9214,
          longitude: -57.9544,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        onPress={handleMapPress}
      >
        {zonas.map((zona) => (
          <Polygon
            key={zona.id}
            coordinates={zona.area}
            strokeColor={zona.color}
            fillColor={`${zona.color}70`}
            strokeWidth={2}
            tappable
            onPress={() => {
              setZonaSeleccionada(zona);
              setMostrarZonaPopup(true);
            }}
          />
        ))}

        {selectedPoints.length > 0 && (
          <>
            <Polygon
              coordinates={selectedPoints}
              strokeColor="#00ff00"
              fillColor="rgba(0,255,0,0.3)"
              strokeWidth={2}
            />
            {selectedPoints.map((point, idx) => (
              <Marker key={idx} coordinate={point} />
            ))}
          </>
        )}

        {location && (
          <Marker coordinate={location}>
            <View style={styles.userMarkerOuter}>
              <View style={styles.userMarkerInner} />
            </View>
          </Marker>
        )}

        {errorLocation && (
          <View style={styles.errorContainer}>
            <Text>{errorLocation}</Text>
          </View>
        )}
      </MapView>

      {!esAdmin && !esGuardia && (
        <NotificationButton
          style={styles.buttonBell}
          count={notificaciones.filter(notificacion => !notificacion.leida).length}
          onPress={() => console.log('Notificaciones')}
        />
      )}

      {esGuardia ? (
        <CarButton style={styles.buttonCar} onPress={() => setShowVerifyParkingPopup(true)} />
      ) : (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
          <CarButton style={styles.buttonCar} onPress={() => setShowParkingPopup(true)} />
          <ParkedButton style={styles.buttonParked} onPress={() => setShowParkedPopup(true)} />
        </View>
      )}

      {showParkedPopup && (
        <View style={styles.popupContainer}>
          <ParkedVehiclePopup
            onClose={() => setShowParkedPopup(false)}
            patentes={patentes}
          />
        </View>
      )}
      
      {showParkingPopup && (
        <View style={styles.popupContainer}>
          <ParkVehiclePopup
            onClose={() => setShowParkingPopup(false)}
            patentes={patentes}
            zona={zonaSeleccionada}
            onEstacionar={handleEstacionar}
          />

        </View>
      )}

      {showVerifyParkingPopup && (
        <View style={styles.popupContainer}>
          <VerifyParkingPopup onClose={() => setShowVerifyParkingPopup(false)} />
        </View>
      )}

      {esAdmin && (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[styles.button, selectedPoints.length < 3 && styles.buttonDisabled]}
            onPress={crearZona}
            disabled={selectedPoints.length < 3}
          >
            <Text style={styles.buttonText}>Crear</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={cancelarSeleccion}>
            <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      )}

      {showCrearZonaPopup && (
        <View style={styles.popupContainer}>
          <CrearZonaPopup
            onCancel={() => setShowCrearZonaPopup(false)}
            onSave={guardarNuevaZona}
          />
        </View>
      )}

      {zonaSeleccionada && mostrarZonaPopup && (
        <ZonaInfoPopup
          visible={mostrarZonaPopup}
          zona={zonaSeleccionada}
          onClose={() => {
            setZonaSeleccionada(null);
            setMostrarZonaPopup(false);
          }}
          esAdmin={esAdmin}
          onEliminarZona={() => {
            Alert.alert(
              'Eliminar zona',
              '¿Estás seguro de que querés eliminar esta zona?',
              [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Eliminar',
                  style: 'destructive',
                  onPress: async () => {
                    const nuevasZonas = zonas.filter(z => z.id !== zonaSeleccionada.id);
                    guardarZonas(nuevasZonas);
                    if (usuario?.id) {
                      await crearNotificacion(
                        usuario.id.toString(),
                        'Zona Eliminada',
                        `La zona "${zonaSeleccionada.nombre}" ha sido eliminada.`,
                        'recordatorio'
                      );
                    }
                    setZonaSeleccionada(null);
                    setMostrarZonaPopup(false);
                  },
                },
              ],
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  map: { flex: 1 },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1B1E25',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  button: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    backgroundColor: '#4a90e2',
  },
  buttonDisabled: {
    backgroundColor: '#007AFF',
    elevation: 0,
    shadowOpacity: 0,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
  },
  cancelButtonText: {
    fontWeight: '700',
  },
  deleteButton: {
    backgroundColor: '#007AFF',
  },
  buttonCar: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  buttonParked: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  buttonBell: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  popupContainer: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  errorContainer: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,0,0,0.7)',
    padding: 8,
    borderRadius: 8,
  },
  userMarkerOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 122, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userMarkerInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 122, 255, 1)',
  },
});