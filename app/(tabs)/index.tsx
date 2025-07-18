import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Polygon } from 'react-native-maps';
import CarButton from '../../components/CarButton';
import NotificationButton from '../../components/NotificationButton';
import ParkedVehiclePopup from '../../components/popups/ParkedVehiclePopup';
import { Colors } from '../../constants/Colors';
import { Zona } from '../../models/Zona';


export default function MapScreen() {
  const [showPopup, setShowPopup] = useState(false);

  const zonas = [
    new Zona(
      'zona1',
      'Norte-Centro',
      [
        { latitude: -34.9090, longitude: -57.9700 },
        { latitude: -34.9090, longitude: -57.9500 },
        { latitude: -34.9170, longitude: -57.9450 },
        { latitude: -34.9200, longitude: -57.9500 },
        { latitude: -34.9200, longitude: -57.9600 },
        { latitude: -34.9170, longitude: -57.9690 },
      ],
      [{ dia: 'Lunes', desde: '09:00', hasta: '20:00' }],
      100,
      '#e63946'  // rojo claro
    ),
    new Zona(
      'zona2',
      'Centro',
      [
        { latitude: -34.9201, longitude: -57.9600 },
        { latitude: -34.9201, longitude: -57.9500 },
        { latitude: -34.9270, longitude: -57.9450 },
        { latitude: -34.9320, longitude: -57.9500 },
        { latitude: -34.9320, longitude: -57.9600 },
        { latitude: -34.9270, longitude: -57.9650 },
      ],
      [{ dia: 'Martes', desde: '09:00', hasta: '20:00' }],
      90,
      '#f1a208'  // naranja
    ),
    new Zona(
      'zona3',
      'Sur-Centro',
      [
        { latitude: -34.9321, longitude: -57.9600 },
        { latitude: -34.9321, longitude: -57.9500 },
        { latitude: -34.9380, longitude: -57.9460 },
        { latitude: -34.9430, longitude: -57.9500 },
        { latitude: -34.9430, longitude: -57.9600 },
        { latitude: -34.9380, longitude: -57.9650 },
      ],
      [{ dia: 'Miércoles', desde: '09:00', hasta: '20:00' }],
      110,
      '#06d6a0'  // verde agua
    ),
    new Zona(
      'zona4',
      'Este',
      [
        { latitude: -34.9200, longitude: -57.9499 },
        { latitude: -34.9170, longitude: -57.9450 },
        { latitude: -34.9250, longitude: -57.9400 },
        { latitude: -34.9300, longitude: -57.9450 },
        { latitude: -34.9270, longitude: -57.9499 },
      ],
      [{ dia: 'Jueves', desde: '09:00', hasta: '20:00' }],
      80,
      '#118ab2'  // azul
    ),
    new Zona(
      'zona5',
      'Sur-Este',
      [
        { latitude: -34.9320, longitude: -57.9499 },
        { latitude: -34.9300, longitude: -57.9450 },
        { latitude: -34.9360, longitude: -57.9400 },
        { latitude: -34.9420, longitude: -57.9450 },
        { latitude: -34.9380, longitude: -57.9460 },
      ],
      [{ dia: 'Viernes', desde: '09:00', hasta: '20:00' }],
      120,
      '#8338ec'  // violeta
    ),
  ];
  
  
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
      >
        {zonas.map(zona => (
          <Polygon
            key={zona.id}
            coordinates={zona.area}
            strokeColor={zona.color}
            fillColor={`${zona.color}70`} // 70 = ~44% de opacidad
            strokeWidth={2}
          />
        ))}
      </MapView>

      <CarButton style={styles.buttonCar} onPress={() => setShowPopup(true)} />
      <NotificationButton style={styles.buttonBell} count={3} onPress={() => console.log('Notificaciones')} />

      {showPopup && (
        <View style={styles.popupContainer}>
          <ParkedVehiclePopup onClose={() => setShowPopup(false)} />
        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.light.background,
  },
  map: { flex: 1 },
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