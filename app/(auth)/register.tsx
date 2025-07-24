import PrimaryButton from '@/components/PrimaryButton';
import { ThemedInput } from '@/components/ThemedInput';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/AuthContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import Checkbox from 'expo-checkbox';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import 'react-native-get-random-values';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const [errorUser, setErrorUser] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);

  // Obtener colores del tema
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const inputBackground = useThemeColor({}, 'inputBackground');
  const primaryColor = useThemeColor({}, 'primary');
  
  //Permite detectar safe areas para evitar superposicion de botones predeterminados de ciertos dispositivos
  const insets = useSafeAreaInsets();

  const handleCrearAdmin = async () => {
    await crearAdmin();
  };

  const handleRegister = async () => {
    setErrorUser(false);
    setErrorEmail(false);
    setErrorPassword(false);
    
    if (user.trim() === ""){
      setErrorUser(true);
      return;
    }
    
    if (email.trim() === "" || !email.includes('@') || !email.includes('.com')) {
      setErrorEmail(true);
      return;
    }
    
    if (password.trim() === "" || repeatPassword.trim() === "" || password !== repeatPassword ) {
      setErrorPassword(true);
      return;
    }
    
    const nuevo = new Usuario(uuidv4(), user, email, password, rol);
    const exito = await register(nuevo);
    if (!exito) {
      Alert.alert("Error", error ?? "Error desconocido");
    } else {
      router.push(Routes.Home);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView
          style={{backgroundColor: useThemeColor({}, 'background')}}
          contentContainerStyle={{...styles.scrollContainer, paddingBottom: 24 + insets.bottom}}
          enableOnAndroid={true}
          extraScrollHeight={20}
        >
          <ThemedView style={styles.container}>
            <Image
              source={require('@/assets/images/logo-azul.png')}
              style={styles.logo}
              resizeMode="contain"
            />

            
            <ThemedText style={[styles.label, { color: textColor }]}>Usuario</ThemedText>
            {errorUser && <ThemedText style={styles.errorText}>El usuario no puede estar vacio</ThemedText>}
            <ThemedInput
              style={[
                styles.input,
                { backgroundColor: inputBackground, color: textColor },
                errorUser && styles.errorInput, // se agrega solo si hay error
              ]}
              placeholder="Ej.: PerezJuan"
              value={user}
              onChangeText={(text) => {
                setUser(text);
                if (errorUser) setErrorUser(false);
              }}
              autoCapitalize="none"
            />
            <ThemedText style={[styles.label, { color: textColor }]}>Email</ThemedText>
            {errorEmail && <ThemedText style={styles.errorText}>El email no puede estar vacio, y tiene que contener un @ y .com</ThemedText>}
            <ThemedInput
              style={[
                styles.input,
                { backgroundColor: inputBackground, color: textColor },
                errorEmail && styles.errorInput, // se agrega solo si hay error
              ]}
              placeholder="Ej.: ejemplo@ejemplo.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <ThemedText style={[styles.label, { color: textColor }]}>Contraseña</ThemedText>
            {errorPassword && <ThemedText style={styles.errorText}>Los campos de contraseñas no pueden estar vacios y tienen que coincidir</ThemedText>}
            <ThemedInput
              style={[
                styles.input,
                { backgroundColor: inputBackground, color: textColor },
                errorPassword && styles.errorInput, // se agrega solo si hay error
              ]}
              placeholder="Ej.: 1234"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            <ThemedText style={[styles.label, { color: textColor }]}>Repetir contraseña</ThemedText>
            <ThemedInput
              style={[
                styles.input,
                { backgroundColor: inputBackground, color: textColor },
                errorPassword && styles.errorInput, // se agrega solo si hay error
              ]}
              placeholder="Ej.: 1234"
              value={repeatPassword}
              onChangeText={setRepeatPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            <View style={styles.checkboxRow}>
              <Checkbox
                value={isTransitStaff}
                onValueChange={setIsTransitStaff}
                color={isTransitStaff ? primaryColor : undefined}
              />
              <ThemedText style={[styles.checkboxLabel, { color: textColor }]}>¿Eres personal de tránsito?</ThemedText>
            </View>

            <PrimaryButton title="CREAR CUENTA" onPress={handleRegister} style={[styles.registerButton, { backgroundColor: primaryColor }]} />
            <PrimaryButton title="CREAR ADMIN" onPress={handleCrearAdmin} style={[styles.registerButton, { backgroundColor: primaryColor }]} />

            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <ThemedText style={styles.linkText}>¿Ya tenés cuenta? Iniciar sesión</ThemedText>
            </TouchableOpacity>
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
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 24,
    alignSelf: 'center',
  },
  label: {
    alignSelf: 'flex-start',
    marginLeft: 8,
    marginBottom: 4,
  },
  input: {
    width: '100%',
    marginBottom: 12,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 16,
    marginLeft: 4,
  },
  checkboxLabel: {
    marginLeft: 8,
  },
  registerButton: {
    width: '100%',
    marginBottom: 16,
  },
  linkText: {
    marginTop: 8,
    color: '#89b4fa',
  },
  errorText: {
    color: "red",
    marginBottom: 8,
  },
  errorInput: {
    borderColor: "red",
    borderWidth: 1,
  },
});
