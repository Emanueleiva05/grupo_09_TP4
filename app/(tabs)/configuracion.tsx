import { StyleSheet, Text, View } from 'react-native';

export default function ConfiguracionScreen() {
  return (
    <View style={styles.container}>
      <Text>Pantalla de Configuración</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
