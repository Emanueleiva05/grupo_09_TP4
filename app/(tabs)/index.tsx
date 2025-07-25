import ParkVehiclePopup from '@/components/popups/ParkVehiclePopup';
import ZonaInfoPopup from '@/components/popups/ZonaInfoPopUp';
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

  const [zonas, setZonas] = useState<Zona[]>([]);
  const [selectedPoints, setSelectedPoints] = useState<Coordenada[]>([]);
  const [showCrearZonaPopup, setShowCrearZonaPopup] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [zonaSeleccionada, setZonaSeleccionada] = useState<Zona | null>(null);
  const [mostrarZonaPopup, setMostrarZonaPopup] = useState(false);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);

  useEffect(() => {
    cargarZonas();
    cargarNotificaciones();
  }, []);

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

  const guardarNuevaZona = (nombre: string, precioHora: number, horarios: Horario[], color: string) => {
    const nuevaZona = new Zona(uuidv4(), nombre, selectedPoints, horarios, precioHora, color);
    const nuevasZonas = [...zonas, nuevaZona];
    guardarZonas(nuevasZonas);
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
      </MapView>

      {!esAdmin && (
        <>
          <CarButton style={styles.buttonCar} onPress={() => setShowPopup(true)} />
          <NotificationButton style={styles.buttonBell} count={notificaciones.length} onPress={() => console.log('Notificaciones')} />
        </>
      )}

      {showPopup && (
        <View style={styles.popupContainer}>
          <ParkVehiclePopup
            onClose={() => setShowPopup(false)}
            patentes={usuario?.autos ?? []}
          />
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
                  onPress: () => {
                    const nuevasZonas = zonas.filter(z => z.id !== zonaSeleccionada.id);
                    guardarZonas(nuevasZonas);
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
});
