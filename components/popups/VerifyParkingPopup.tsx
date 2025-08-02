import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import PopupCard from './PopupCard';

type Props = { onClose: () => void; };

export default function VerifyParkingPopup({ onClose }: Props) {
  const textColor = useThemeColor({}, 'text');
  const inputBackground = useThemeColor({}, 'inputBackground');
  const buttonBackground = useThemeColor({}, 'buttonBackground');

  const [patenteInput, setPatenteInput] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [mensajePago, setMensajePago] = useState<string | null>(null); // Nuevo estado para mensaje dentro del popup

  // Componente interno para mostrar mensaje dentro del popup
  const MensajePago = ({ mensaje }: { mensaje: string }) => (
    <View style={[styles.mensajePagoContainer, { backgroundColor: inputBackground }]}>
      <Text style={[styles.mensajePagoTexto, { color: textColor }]}>{mensaje}</Text>
      <TouchableOpacity onPress={() => setMensajePago(null)} style={[styles.button, { backgroundColor: buttonBackground }]}>
        <Text style={[styles.buttonText, { color: textColor }]}>Cerrar</Text>
      </TouchableOpacity>
    </View>
  );

  // Busca la patente en todos los usuarios AsyncStorage
  const verificarPatenteGlobal = async () => {
    if (!patenteInput.trim()) {
      setMensajePago('Por favor ingrese una patente para buscar.');
      return;
    }
    setBuscando(true);
    try {
      const patenteBuscada = patenteInput.trim().toUpperCase();
      // Obtener todas las claves del AsyncStorage
      const todasClaves = await AsyncStorage.getAllKeys();

      // Filtrar las claves que corresponden a patentes de usuario
      const clavesUsuarios = todasClaves.filter(clave => clave.startsWith('patentes_usuario_'));

      // Buscar en cada usuario
      for (const clave of clavesUsuarios) {
        const datosRaw = await AsyncStorage.getItem(clave);
        if (!datosRaw) continue;

        const autos = JSON.parse(datosRaw);
        // autos es un array de objetos con atributo 'patente'
        const autoEncontrado = autos.find((auto: any) => auto.patente === patenteBuscada);

        if (autoEncontrado) {
          // Aquí verificamos la posición
          const { posicion } = autoEncontrado;
          if (
            !posicion ||
            (posicion.latitude === 0 && posicion.longitude === 0) ||
            (posicion.lat === 0 && posicion.lon === 0) // por si usa keys diferentes
          ) {
            setMensajePago(`Patente ${patenteBuscada} encontrada pero NO tiene un estacionamiento registrado.`);
          } else {
            setMensajePago(`Patente ${patenteBuscada} encontrada con estacionamiento registrado.`);
          }
          setBuscando(false);
          return;
        }
      }
      setMensajePago(`Patente ${patenteBuscada} NO encontrada en ningún usuario.`);
    } catch (error) {
      setMensajePago('Ocurrió un error al buscar la patente.');
      console.error(error);
    } finally {
      setBuscando(false);
    }
  };

  return (
    <PopupCard>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Verificar vehículo estacionado</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={[styles.closeButtonText, { color: textColor }]}>X</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Ingrese patente"
        placeholderTextColor="gray"
        style={[styles.input, { backgroundColor: inputBackground, color: textColor }]}
        value={patenteInput}
        onChangeText={setPatenteInput}
        autoCapitalize="characters"
      />

      <View style={[styles.infoBox, { backgroundColor: inputBackground }]}>
        <Text style={[styles.infoTitle, { color: textColor }]}>Información de la zona</Text>
        <Text style={[styles.infoText, { color: textColor }]}>Ej.: zona celeste</Text>
        <Text style={[styles.infoText, { color: textColor }]}>Solo permitido de lunes a sábados de 9hs hasta las 20hs</Text>
        <Text style={[styles.infoText, { color: textColor }]}>Precio por hora: $100.00</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: buttonBackground, opacity: buscando ? 0.5 : 1 }]}
        onPress={verificarPatenteGlobal}
        disabled={buscando}
      >
        <Text style={[styles.buttonText, { color: textColor }]}>{buscando ? 'Buscando...' : 'Verificar pago'}</Text>
      </TouchableOpacity>

      {/* Mostrar mensaje de pago si existe */}
      {mensajePago && <MensajePago mensaje={mensajePago} />}
    </PopupCard>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 16, marginBottom: 8 },
  closeButton: { padding: 4 },
  closeButtonText: { fontWeight: 'bold', fontSize: 16 },
  input: {
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  infoBox: {
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  infoTitle: { fontWeight: 'bold', marginBottom: 4 },
  infoText: { fontSize: 12 },
  button: {
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonText: { fontWeight: 'bold' },
  mensajePagoContainer: {
    marginTop: 20,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  mensajePagoTexto: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
});
