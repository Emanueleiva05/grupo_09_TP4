import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/Colors'; // ajustá ruta si hace falta

export default function NotificacionesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pantalla de Notificaciones</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  text: {
    color: Colors.light.text,
  },
});
