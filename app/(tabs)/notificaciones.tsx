import { FlatList, StyleSheet, Text, View } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import NotificacionItem from '../../components/NotificacionItem';
import { Colors } from '../../constants/Colors';
import { Notificacion } from '../../models/Notificacion';

const notificacionesDummy: Notificacion[] = [
  Notificacion.crearNotificacion({
    id: uuidv4(),
    userId: '1',
    titulo: 'Multa registrada',
    mensaje: 'Se ha cargado una nueva multa en tu cuenta.',
    tipo: 'multa',
  }),
  Notificacion.crearNotificacion({
    id: uuidv4(),
    userId: '1',
    titulo: 'Pago recibido',
    mensaje: 'Tu pago fue procesado correctamente.',
    tipo: 'pago',
  }),
  Notificacion.crearNotificacion({
    id: uuidv4(),
    userId: '1',
    titulo: 'Recordatorio de vencimiento',
    mensaje: 'La patente de tu vehículo vence en 3 días.',
    tipo: 'recordatorio',
  }),
];

export default function NotificacionesScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={notificacionesDummy}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificacionItem notificacion={item} />}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={styles.empty}>No hay notificaciones</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: Colors.light.text,
  },
});
