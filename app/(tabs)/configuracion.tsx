import PasswordChangePopoup from '@/components/popups/PasswordChangePopoup';
import { SettingsItem } from '@/components/SettingsItem';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/AuthContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import Routes from '../../constants/Routes';


export default function ConfiguracionScreen() {
  const { usuario, logout } = useAuth();
  const router = useRouter();
  const inicial = usuario?.nombre?.[0]?.toUpperCase() ?? 'U';
  const [mostrarPopup, setMostrarPopup] = useState(false);

  const handlePasswordChange = () => {
    setMostrarPopup(true);
  };

  
  const handleLogout = async () => {
    await logout();
    router.push(Routes.Login);
  }
  
  return (
    <ScrollView style={{backgroundColor: useThemeColor({}, 'background')}} contentContainerStyle={[styles.container]}>
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
          <SectionTitle title="Preferencias" />
          <SettingsItem icon="moon"
            text= {`Tema: Claro / Oscuro`}/>
          <SettingsItem icon="lock-closed-outline" text="Cambiar contraseña" onPress={() => handlePasswordChange()}/>
          <SettingsItem icon="language" text="Idioma: Español" />
        </View>

        <View style={styles.section}>
          <SectionTitle title="Soporte y cuenta" />
          <SettingsItem icon="help-circle" text="Centro de ayuda" />
          <SettingsItem icon="mail" text="Contacto" />
          <SettingsItem icon="log-out" text="Cerrar sesión" onPress={() => handleLogout()}/>
        </View>
      </ThemedView>
      
      {mostrarPopup && (
        <PasswordChangePopoup onClose={() => setMostrarPopup(false)} />
      )}
    </ScrollView>
  );
}

function SectionTitle({ title }: { title: string }) {
  const textColor = useThemeColor({}, 'text');
  return (
    <ThemedText style={[styles.sectionTitle, { color: textColor }]}>{title}</ThemedText>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemIcon: {
    marginRight: 12,
  },
  itemText: {
    fontSize: 16,
  },
});
