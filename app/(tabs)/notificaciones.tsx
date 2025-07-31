import { useAuth } from '@/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import NotificacionItem from '../../components/NotificacionItem';
import { Colors } from '../../constants/Colors';
import { Notificacion } from '../../models/Notificacion';

export default function NotificacionesScreen() {

  const { usuario } = useAuth();
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [ loading, setLoading] = useState(true);

  const handleMarkAsRead = async (id: string) => {
    const updatedNotificaciones = notificaciones.map(n => { if(n.id === id) { n.marcarLeida()}
    return n;
    });

    setNotificaciones(updatedNotificaciones);
    try {
      await AsyncStorage.setItem('notificaciones', JSON.stringify(updatedNotificaciones));
    } catch(error) {
      console.error('Error actualizando el estado de las notificaciones', error)
    }
  };

  useEffect(() => {
    const cargarNotificaciones = async () => {
      try {
        const todas = await Notificacion.obtenerNotificaciones();
        const delUsuario = todas.filter(n => n.userId === usuario?.id);
        const ordNotificaciones = delUsuario.sort((a,b) => {
          return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
        })
        setNotificaciones(ordNotificaciones);
      } catch (error) {
        console.error('Error al cargar notificaciones:', error);
      } finally {
        setLoading(false);
      }
    };
    cargarNotificaciones();
  }, [usuario]);

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.loading}> Cargando notificaciones...</Text>
      ):(
        <FlatList
        data={notificaciones}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificacionItem 
            notificacion={item}
            onMarkAsRead={handleMarkAsRead}
          />
        )}   
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={styles.empty}>No hay notificaciones</Text>}
      />
      )}
    </View>
      );
    }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  loading: {
    textAlign: 'center',
    marginTop: 20,
    color: Colors.light.text,
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: Colors.light.text,
  },
});
