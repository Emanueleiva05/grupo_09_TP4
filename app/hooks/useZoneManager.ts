import { useState } from 'react';
import { MapPressEvent } from 'react-native-maps';
import { Zona } from '../models/Zona';

export function useZonaManager() {
  const [selectedPoints, setSelectedPoints] = useState<{latitude: number, longitude: number}[]>([]);
  const [zonas, setZonas] = useState<Zona[]>([]);

  const handleMapPress = (event: MapPressEvent) => {
    const newPoint = event.nativeEvent.coordinate;
    setSelectedPoints(prev => [...prev, newPoint]);
  };

  const crearZona = () => {
    if (selectedPoints.length < 3) return;
    const nuevaZona = new Zona(
      `zona${zonas.length + 1}`,
      `Zona personalizada ${zonas.length + 1}`,
      selectedPoints,
      [{ dia: 'Lunes', desde: '09:00', hasta: '20:00' }],
      100
    );
    setZonas(prev => [...prev, nuevaZona]);
    setSelectedPoints([]);
  };

  const cancelarSeleccion = () => setSelectedPoints([]);

  return {
    zonas,
    selectedPoints,
    handleMapPress,
    crearZona,
    cancelarSeleccion
  };
}
