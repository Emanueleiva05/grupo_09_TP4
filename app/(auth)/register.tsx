import PrimaryButton from '@/components/PrimaryButton';
import { ThemedInput } from '@/components/ThemedInput';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Checkbox from 'expo-checkbox';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import 'react-native-get-random-values'; // hace que funcione la creacion del id
import { v4 as uuidv4 } from 'uuid';
import Routes from '../../constants/Routes';
import { Usuario } from '../../models/Usuario';


export default function Register() {
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [isTransitStaff, setIsTransitStaff] = useState(false);
  const rol = isTransitStaff ? 'guardia' : 'cliente';
  const router = useRouter();
  const { register, error } = useAuth();
  const { crearAdmin } = useAuth();
  
  //Para probar
  const handleCrearAdmin = async () => {
    await crearAdmin();
  };
  
  const handleRegister = async () => {
    const nuevo = new Usuario(uuidv4(), user, email, password, rol);
    const exito = await register(nuevo);
    const data = await AsyncStorage.getItem('usuariosRegistrados');
    console.log(data);
    if (!exito) {
      Alert.alert("Error", error ?? "Error desconocido");
    } else {
      router.push(Routes.Home);
    }
  }
  
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
        />
        
        <ThemedText style={styles.label}>Email</ThemedText>
        <ThemedInput
          style={styles.input}
          placeholder="Ej.: ejemplo@ejemplo.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <ThemedText style={styles.label}>Contraseña</ThemedText>
        <ThemedInput
          style={styles.input}
          placeholder="Ej.: 1234"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <ThemedText style={styles.label}>Repetir contraseña</ThemedText>
        <ThemedInput
          style={styles.input}
          placeholder="Ej.: 1234"
          value={repeatPassword}
          onChangeText={setRepeatPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <View style={styles.checkboxContainer}>
          <Checkbox
            value={isTransitStaff}
            onValueChange={setIsTransitStaff}
            color={isTransitStaff ? '#89b4fa' : undefined}
          />
          <ThemedText style={styles.checkboxLabel}>¿Eres personal de tránsito?</ThemedText>
        </View>

        <PrimaryButton title="CREAR CUENTA" onPress={() => handleRegister()} style={styles.registerButton} />
        <PrimaryButton title="CREAR ADMIN" onPress={() => handleCrearAdmin()} style={styles.registerButton} />  

        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
          <ThemedText style={styles.linkText}>¿Ya tenés cuenta? Iniciar sesión</ThemedText>
        </TouchableOpacity>
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 16,
    marginLeft: 4,
  },
  checkboxLabel: {
    marginLeft: 8,
    color: '#ffffff',
  },
  registerButton: {
    width: '100%',
    marginBottom: 16,
  },
  linkText: {
    color: '#89b4fa',
  },
});
