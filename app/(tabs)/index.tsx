import ParkVehiclePopup from '@/components/popups/ParkVehiclePopup';
import ZonaInfoPopup from '@/components/popups/ZonaInfoPopUp';
import { usePatentes } from '@/context/PatentesContext';
import { crearNotificacion } from '@/hooks/notificacionService';
import { useLocation } from '@/hooks/useLocation';
import { Auto } from '@/models/Auto';
import { Notificacion } from '@/models/Notificacion';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { LongPressEvent, MapPressEvent, Marker, Polygon } from 'react-native-maps';
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
  const { location, errorLocation } = useLocation();
  const [zonas, setZonas] = useState<Zona[]>([]);
  const [selectedPoints, setSelectedPoints] = useState<Coordenada[]>([]);
  const [showCrearZonaPopup, setShowCrearZonaPopup] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [zonaSeleccionada, setZonaSeleccionada] = useState<Zona | null>(null);
  const [mostrarZonaPopup, setMostrarZonaPopup] = useState(false);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [autos, setAutos] = useState<Auto[]>([]);
  const [pressTimer, setPressTimer] = useState<number | null>(null);
  const { patentes: misPatentes } = usePatentes();

  const zonasAGuardar: Zona[] = [
  new Zona(
    'zona-1',
    'Centro La Plata',
    [
      { latitude: -34.9212, longitude: -57.9544 },  // Plaza Moreno
      { latitude: -34.9203, longitude: -57.9528 },  // Catedral NE
      { latitude: -34.9225, longitude: -57.9515 },  // Municipalidad
      { latitude: -34.9231, longitude: -57.9556 }   // Pasaje Dardo Rocha
    ],
    [
      { dia: 'Lunes', desde: '08:00', hasta: '15:00' },
      { dia: 'Martes', desde: '08:00', hasta: '20:00' },
      { dia: 'Miércoles', desde: '08:00', hasta: '20:00' },
      { dia: 'Jueves', desde: '08:00', hasta: '20:00' },
      { dia: 'Viernes', desde: '08:00', hasta: '20:00' },
      { dia: 'Sábado', desde: '09:00', hasta: '14:00' }
    ],
    50,
    '#E74C3C'  // Rojo
  ),
  new Zona(
    'zona-2',
    'Zona Universitaria',
    [
      { latitude: -34.9098, longitude: -57.9405 },
      { latitude: -34.9082, longitude: -57.9361 }, 
      { latitude: -34.9115, longitude: -57.9350 },  
      { latitude: -34.9136, longitude: -57.9393 }   
    ],
    [
      { dia: 'Lunes', desde: '07:00', hasta: '17:00' },
      { dia: 'Martes', desde: '07:00', hasta: '22:00' },
      { dia: 'Miércoles', desde: '07:00', hasta: '22:00' },
      { dia: 'Jueves', desde: '07:00', hasta: '22:00' },
      { dia: 'Viernes', desde: '07:00', hasta: '22:00' }
    ],
    40,
    '#3498DB'  // Azul
  ),
  new Zona(
    'zona-3',
    'Plaza Malvinas',
    [
      { latitude: -34.9335, longitude: -57.9635 },
      { latitude: -34.9340, longitude: -57.9680 }, 
      { latitude: -34.9375, longitude: -57.9670 }, 
      { latitude: -34.9369, longitude: -57.9622 }  
    ],
    [
      { dia: 'Lunes', desde: '06:00', hasta: '23:00' },
      { dia: 'Martes', desde: '06:00', hasta: '23:00' },
      { dia: 'Miércoles', desde: '06:00', hasta: '23:00' },
      { dia: 'Jueves', desde: '06:00', hasta: '23:00' },
      { dia: 'Viernes', desde: '06:00', hasta: '23:00' },
      { dia: 'Sábado', desde: '07:00', hasta: '01:00' },
      { dia: 'Domingo', desde: '07:00', hasta: '01:00' }
    ],
    60,
    '#2ECC71'  // Verde
  )
];
  useEffect(() => {
    guardarZonas(zonasAGuardar)
    cargarZonas();
    cargarNotificaciones();
    cargarAutos();
  }, []);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem('autosRegistrados');
      if (raw) {
        setAutos(JSON.parse(raw)); // array de objetos planos
      }
    })();
  }, []);

  const cargarZonas = async () => {
    try {
      const data = await AsyncStorage.getItem('zonasRegistradas');
      if (data) {
        const zonasGuardadas = JSON.parse(data);
        const zonasConvertidas = zonasGuardadas.map((zona: any) => new Zona(
        zona.id,
        zona.nombre,
        zona.area,
        zona.horariosPermitidos,
        zona.precioHora,
        zona.color
      ));
        setZonas(zonasConvertidas);
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

  const cargarAutos = async () => {
    try {
      const data = await AsyncStorage.getItem('autos'); // Change 'notificaciones' to 'autos'
      if (data) {
        const autosGuardados = JSON.parse(data);
        setAutos(autosGuardados); // Assuming you have a state setter for autos
      } else {
        console.log('No autos found in storage.');
      }
    } catch (error) {
      console.error('Error cargando autos:', error);
    }
  };

  const handleMapPress = (e: MapPressEvent) => {
    const newPoint = e.nativeEvent.coordinate;

    if (esAdmin){
    setSelectedPoints((prev) => [...prev, newPoint]);
    }
  };

  const handleLongPress = (e: LongPressEvent) => {
    const newPoint = e.nativeEvent.coordinate;
    setSelectedPoints([newPoint]);

    const { dia, horaActual } = getCurrentDayAndTime();
    const zona = zonas.find(zona => zona.contienePunto(newPoint));;
    

    if (zona) {
      const horarioValido = zona.estaPermitido(dia, horaActual);
      if (!horarioValido) {
      Alert.alert(
        'Fuera de horario',
        `Esta zona es paga entre ${zona.horariosPermitidos
          .find(h => h.dia === dia)?.desde || '--:--'} y ${zona.horariosPermitidos
          .find(h => h.dia === dia)?.hasta || '--:--'}`
      );
    }
    setZonaSeleccionada(zona);
  } else {
    setZonaSeleccionada(null)
  }
    setShowPopup(true);
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

  const getCurrentDayAndTime = () => {
    const now = new Date();
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const dia = days[now.getDay()];
    const hora = now.getHours().toString().padStart(2, '0');
    const minutos = now.getMinutes().toString().padStart(2, '0');
    return { 
      dia, 
      horaActual: `${hora}:${minutos}` 
    };
  };


  const handleEstacionar = async (patente: string, ubicacion: Coordenada ,horas: number) => {
    console.log(
    "%c--- PARKING CONFIRMATION DATA ---",
    "color: green; font-weight: bold;"
    );
    console.log("%c1. Vehicle:", "color: blue;", patente);
    console.log("%c3. Duration:", "color: blue;", `${horas} hour(s)`);
    console.log("%c5. Address:", "color: blue;", ubicacion || "Not available");
    console.log(
      "%c---------------------------------",
      "color: green; font-weight: bold;"
    );

    if (usuario?.id) {
      await crearNotificacion(
       usuario.id.toString(),
       'Auto Estacionado',
       `El auto "${patente}" ha sido estacionado en "${ubicacion}" por "${horas}".`,
       'verificacion'
     );
    }
  }

  //   patente: string,
  //   ubicacion: Coordinates,
  //   horas: number
  // ) => {
  //   // 1. Leer la lista actual
  //   const raw = await AsyncStorage.getItem('autosRegistrados');
  //   const lista: Auto[] = raw ? JSON.parse(raw) : [];

  //   // 2. Mapear y actualizar sólo el auto con esa patente
  //   const actualizado = lista.map(a =>
  //     a.patente === patente
  //       ? {
  //         ...a,
  //         posicion: ubicacion,
  //         fechaEstacionamiento: new Date(),
  //         horasEstacionado: horas,
  //       }
  //       : a
  //   );

  //   // 3. Guardar de vuelta en AsyncStorage
  //   await AsyncStorage.setItem('autosRegistrados', JSON.stringify(actualizado));

  //   // 4. Refrescar el estado local
  //   setAutos(actualizado);
  // };

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
        onLongPress={handleLongPress}
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

      {!esAdmin && (
        <>
          <CarButton style={styles.buttonCar} onPress={() => setShowPopup(true)} />
          <NotificationButton style={styles.buttonBell} count={notificaciones.filter(notificacion => !notificacion.leida).length} onPress={() => console.log('Notificaciones')} />
        </>
      )}

      {showPopup && (
        <View style={styles.popupContainer}>
          <ParkVehiclePopup
            onClose={() => setShowPopup(false)}
            patentes={misPatentes}
            onEstacionar={handleEstacionar}
            zona={zonaSeleccionada}
            posicion={selectedPoints[0]}
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
