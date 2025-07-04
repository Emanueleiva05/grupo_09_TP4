import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';
import CarButton from '../../components/CarButton';
import NotificationButton from '../../components/NotificationButton';
import ParkedVehiclePopup from '../../components/popups/ParkedVehiclePopup';


export default function MapScreen() {
  const [showPopup, setShowPopup] = useState(false);

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
      />

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
  container: { flex: 1 },
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
