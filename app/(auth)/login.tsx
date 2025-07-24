import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import { ThemedInput } from '@/components/ThemedInput';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/AuthContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Keyboard, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Routes from '../../constants/Routes';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { login, error } = useAuth();

  // Obtener colores del tema
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const inputBackground = useThemeColor({}, 'inputBackground');
  const primaryColor = useThemeColor({}, 'primary');

  //Permite detectar safe areas para evitar superposicion de botones predeterminados de ciertos dispositivos
  const insets = useSafeAreaInsets();

  const handleLogin = async () => {
    const exito = await login(email, password);
    if (!exito) {
      Alert.alert("Error", error ?? "Error desconocido");
    } else {
      router.push(Routes.Home);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAwareScrollView
        style={{ backgroundColor: useThemeColor({}, 'background') }}
        contentContainerStyle={{ ...styles.scrollContainer, paddingBottom: 24 + insets.bottom }}
        enableOnAndroid={true}
        extraScrollHeight={20}
      >
        <ThemedView style={styles.container}>
          <Image
            source={require('@/assets/images/logo-azul.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <ThemedText style={[styles.label, { color: textColor }]}>Email</ThemedText>
          <ThemedInput
            style={[styles.input, { backgroundColor: inputBackground, color: textColor }]}
            placeholder="Ej.: ejemplo@ejemplo.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <ThemedText style={[styles.label, { color: textColor }]}>Contraseña</ThemedText>
          <ThemedInput
            style={[styles.input, { backgroundColor: inputBackground, color: textColor }]}
            placeholder="Ej.: 1234"
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            secureTextEntry
          />

          <PrimaryButton title="INGRESAR" onPress={() => handleLogin()} style={[styles.registerButton, { backgroundColor: primaryColor }]} />

          <TouchableOpacity>
            <ThemedText style={styles.linkText}>Olvidé mi contraseña</ThemedText>
          </TouchableOpacity>

          <ThemedText style={styles.bottomText}>¿No tenés cuenta?</ThemedText>
          <SecondaryButton
            title="REGISTRARSE"
            onPress={() => router.push('/register')}
            style={styles.registerButton}
          />
        </ThemedView>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  label: {
    alignSelf: 'flex-start',
    marginLeft: 8,
    marginBottom: 4,
    color: '#ffffff',
  },
  input: {
    width: '100%',
    marginBottom: 12,
    backgroundColor: '#3a3a4c',
    color: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  loginButton: {
    marginTop: 8,
    width: '100%',
  },
  linkText: {
    color: '#89b4fa',
    marginTop: 12,
    marginBottom: 12,
  },
  bottomText: {
    color: '#cdd6f4',
    marginBottom: 8,
  },
  registerButton: {
    width: '100%',
  },
});
