import Polyline from '@mapbox/polyline';

type Coordenada = {
  latitude: number;
  longitude: number;
};

export async function obtenerRuta(origen: Coordenada, destino: Coordenada, apiKey: string) {
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origen.latitude},${origen.longitude}&destination=${destino.latitude},${destino.longitude}&key=AIzaSyDQmP0A4QZevfEyLaI9Aktg-n5_RxlcJ-E`;

  console.log('URL para Directions API:', url);

  try {
    const response = await fetch(url);
    const data = await response.json();

    console.log('Respuesta Directions API:', data);

    if (data.status !== 'OK') {
      console.warn('Directions API error:', data.status, data.error_message);
      return [];
    }

    if (data.routes.length > 0) {
      const points = Polyline.decode(data.routes[0].overview_polyline.points);
      return points.map(point => ({ latitude: point[0], longitude: point[1] }));
    }
    return [];
  } catch (error) {
    console.error('Error obteniendo ruta:', error);
    return [];
  }
}
