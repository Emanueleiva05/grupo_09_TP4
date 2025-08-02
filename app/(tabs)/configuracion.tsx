import PasswordChangePopoup from '@/components/popups/PasswordChangePopoup';
import { SettingsItem } from '@/components/SettingsItem';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/AuthContext';
import { usePatentes } from '@/context/PatentesContext';
import { useLocation } from '@/hooks/useLocation';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Linking, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import Routes from '../../constants/Routes';

export default function ConfiguracionScreen() {
  const { usuario, logout, actualizarUsuario } = useAuth();
  const router = useRouter();
  const inicial = usuario?.nombre?.[0]?.toUpperCase() ?? 'U';
  const { patentes: misPatentes, agregarPatente, eliminarPatente } = usePatentes();

  const [nuevaPatente, setNuevaPatente] = useState('');
  const [mostrarPopup, setMostrarPopup] = useState(false);

  const { location, pedirPermiso, errorLocation } = useLocation();
  const handlePasswordChange = () => setMostrarPopup(true);

  const handleLogout = async () => {
    await logout();
    router.push(Routes.Login);
  };

  const handleReintentarPermisoUbicacion = async () => {
    const permitido = await pedirPermiso();
    if (!permitido) {
      Alert.alert(
        'Permiso denegado',
        'No se pudo obtener permiso de ubicación. Revisá los ajustes del sistema.',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Ir a configuración',
            onPress: () => Linking.openSettings(),
          },
        ]
      );
    } else {
      Alert.alert('Ubicacion activada', 'La app deberia funcionar con normalidad.')
      console.log(location)
    }
  };

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <ScrollView
        style={{ backgroundColor: useThemeColor({}, 'background') }}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedView style={styles.container}>
          <ThemedView style={[styles.profileContainer, { backgroundColor: useThemeColor({}, 'background') }]}>
            <Image
              source={{
                uri: `https://ui-avatars.com/api/?name=${inicial}&length=1&background=1e1e2e&color=89b4fa&rounded=true`,
              }}
              style={styles.avatar}
            />
            <ThemedText type="title">{usuario?.nombre}</ThemedText>
            <ThemedText style={{ color: Colors.dark.text }}>{usuario?.email}</ThemedText>
          </ThemedView>

          <View style={styles.section}>
            <SectionTitle title="Mis patentes" />
            <View style={styles.patenteInputContainer}>
              <TextInput
                style={styles.patenteInput}
                placeholder="Ingresar patente"
                value={nuevaPatente}
                onChangeText={setNuevaPatente}
                autoCapitalize="characters"
                keyboardType="default"
                returnKeyType="done"
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  agregarPatente(nuevaPatente);
                  setNuevaPatente('');
                }}
              >
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            {misPatentes.length > 0 && (
              <View style={styles.patentesScrollContainer}>
                {misPatentes.map(auto => (
                  <View key={auto.patente} style={styles.patenteItem}>
                    <Text style={styles.patenteText}>{auto.patente}</Text>
                    <TouchableOpacity onPress={() => eliminarPatente(auto.patente)}>
                      <Text style={styles.deleteText}>X</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

          </View>

          <View style={styles.section}>
            <SectionTitle title="Preferencias" />
            <SettingsItem icon="moon" text={`Tema: Claro / Oscuro`} />
            <SettingsItem icon="lock-closed-outline" text="Cambiar contraseña" onPress={handlePasswordChange} />
            <SettingsItem icon="language" text="Idioma: Español" />
          </View>

          <View style={styles.section}>
            <SectionTitle title="Soporte y cuenta" />
            <SettingsItem icon="help-circle" text="Centro de ayuda" />
            <SettingsItem icon="locate" text="Permitir acceso a ubicación" onPress={handleReintentarPermisoUbicacion} />
            <SettingsItem icon="mail" text="Contacto" />
            <SettingsItem icon="log-out" text="Cerrar sesión" onPress={handleLogout} />
          </View>
        </ThemedView>
      </ScrollView>
      {mostrarPopup && (
        <View style={styles.popupOverlay}>
          <PasswordChangePopoup onClose={() => setMostrarPopup(false)} />
        </View>
      )}
    </View>
  );
}

function SectionTitle({ title }: { title: string }) {
  const textColor = useThemeColor({}, 'text');
  return <ThemedText style={[styles.sectionTitle, { color: textColor }]}>{title}</ThemedText>;
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 20,
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 32,
  },
  profileContainer: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 36,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    opacity: 0.8,
  },
  patenteInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  patenteInput: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#1E90FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  patentesScrollContainer: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#1e1e2e',
    marginTop: 8,
  },
  patenteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  patenteText: {
    color: 'white',
    fontSize: 16,
  },
  deleteText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 8,
  },
  popupOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
});
