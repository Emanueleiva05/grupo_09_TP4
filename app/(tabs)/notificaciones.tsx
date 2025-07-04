import { StyleSheet, Text, View } from 'react-native';

export default function NotificacionesScreen() {
  return (
    <View style={styles.container}>
      <Text>Pantalla de Notificaciones</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
