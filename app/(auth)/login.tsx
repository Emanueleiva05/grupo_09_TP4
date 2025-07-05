import React, { useState } from 'react';
import { Image, StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedInput } from '@/components/ThemedInput';
import PrimaryButton from '@/components/PrimaryButton';
import { useRouter } from 'expo-router';
import Routes from '../../constants/Routes';

export default function Login() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
        <Image
          source={require('@/assets/images/logo-azul.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <ThemedText style={styles.label}>Usuario</ThemedText>
        <ThemedInput
          style={styles.input}
          placeholder="Ej.: PerezJuan"
          value={user}
          onChangeText={setUser}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <ThemedText style={styles.label}>Contraseña</ThemedText>
        <ThemedInput
          style={styles.input}
          placeholder="Ej.: 1234"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <PrimaryButton title="INGRESAR" onPress={() => router.push(Routes.Home)} style={styles.loginButton} />

        <TouchableOpacity>
          <ThemedText style={styles.linkText}>Olvidé mi contraseña</ThemedText>
        </TouchableOpacity>

        <ThemedText style={styles.bottomText}>¿No tenés cuenta?</ThemedText>
        <PrimaryButton
          title="REGISTRARSE"
          onPress={() => router.push('/register')}
          style={styles.registerButton}
        />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#1e1e2e', // fondo oscuro opcional
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
