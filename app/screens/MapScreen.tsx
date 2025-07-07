import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import CarButton from '../../components/CarButton';
import NotificationButton from '../../components/NotificationButton';
import { Colors } from '../../constants/Colors';
import { useZonaManager } from '../hooks/useZoneManager';

export default function MapScreen() {
  const {
    zonas,
    selectedPoints,
    handleMapPress,
    crearZona,
    cancelarSeleccion
  } = useZonaManager();

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
        {/* Zonas guardadas */}
        {zonas.map(zona => (
          <Polygon
            key={zona.id}
            coordinates={zona.area}
            strokeColor="#435C6D"
            fillColor="rgba(67,92,109,0.4)"
            strokeWidth={2}
          />
        ))}
        {/* Polígono en construcción */}
        {selectedPoints.length > 0 && (
          <Polygon
            coordinates={selectedPoints}
            strokeColor="#00ff00"
            fillColor="rgba(0,255,0,0.3)"
            strokeWidth={2}
          />
        )}
        {/* Puntos marcados */}
        {selectedPoints.map((point, idx) => (
          <Marker key={idx} coordinate={point} />
        ))}
      </MapView>

      <CarButton style={styles.buttonCar} onPress={() => console.log('Auto')} />
      <NotificationButton style={styles.buttonBell} count={3} onPress={() => console.log('Notificaciones')} />

      <View style={styles.bottomBar}>
        <Button title="Crear zona" onPress={crearZona} disabled={selectedPoints.length < 3} />
        <Button title="Cancelar" onPress={cancelarSeleccion} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  map: { flex: 1 },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1B1E25',
    padding: 8,
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
});
