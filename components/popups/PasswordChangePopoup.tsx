import { useAuth } from "@/context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { Alert, StyleSheet, View } from 'react-native';
import PrimaryButton from "../PrimaryButton";
import SecondaryButton from "../SecondaryButton";
import { ThemedInput } from "../ThemedInput";
import { ThemedText } from "../ThemedText";
import PopupCard from "./PopupCard";


type Props = { onClose: () => void; };

export default function PasswordChangePopoup({ onClose }: Props) {
    const { usuario } = useAuth();
    const [passwordActual, setPasswordActual] = useState('');  
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorActual, setErrorActual] = useState(false);
    const [errorNueva, setErrorNueva] = useState(false);
    const [errorVacio, setErrorVacio] = useState(false);
    
    const handleConfirm = async () => {
        setErrorActual(false);
        setErrorNueva(false);
        setErrorVacio(false);
        
        if (passwordActual.trim() === "" || newPassword.trim() === "" || confirmPassword.trim() === "") {
            setErrorVacio(true);
            return;
        }
  
        if (passwordActual !== usuario?.password) {
            setErrorActual(true);
            return;
        }
        
        if (newPassword !== confirmPassword) {
            setErrorNueva(true);
            return;
        }
        
        try {
            const data = await AsyncStorage.getItem("usuariosRegistrados");
            let usuarios = data ? JSON.parse(data) : [];
            
            const actualizados = usuarios.map((u : any) =>
                u.id === usuario?.id ? { ...u, password: newPassword } : u
            );
            
            await AsyncStorage.setItem("usuariosRegistrados", JSON.stringify(actualizados));
            await AsyncStorage.setItem("usuario", JSON.stringify({ ...usuario, password: newPassword }));
            
            Alert.alert("Exito", "Contraseña actualizada correctamente");
            onClose();
        } catch (error) {
            console.error("Error actualizando contraseña: ", error);
            Alert.alert("Error", "No se pudo actualizar la contraseña");
        }
    };
    
    return (
        <PopupCard>
            <View> 
                <ThemedText style={styles.title}>Cambiar contraseña</ThemedText>
            
                {errorVacio && <ThemedText style={styles.errorText}>No pueden haber campos vacios</ThemedText>}
                <ThemedText>Ingresar contraseña actual</ThemedText>
                <ThemedInput 
                    placeholder="Contraseña actual"
                    value={passwordActual}
                    onChangeText={setPasswordActual}
                    autoCapitalize="none"
                    secureTextEntry
                    style={[ (errorActual || errorVacio) && styles.errorInput ]}
                />
                {errorActual && <ThemedText style={styles.errorText}>Contraseña incorrecta</ThemedText>}
                
                <ThemedText>Ingresar la nueva contraseña</ThemedText>
                <ThemedInput 
                    placeholder="Contraseña nueva"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    autoCapitalize="none"
                    secureTextEntry
                    style={[(errorNueva || errorVacio) && styles.errorInput]}
                />
                <ThemedText>Confirmar la nueva contraseña</ThemedText>
                <ThemedInput 
                    placeholder="Contraseña nueva"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    autoCapitalize="none"
                    secureTextEntry
                    style={[(errorNueva || errorVacio) && styles.errorInput]}
                />
                {errorNueva && <ThemedText style={styles.errorText}>Las contraseñas no coinciden</ThemedText>}
            </View>
            
            <PrimaryButton
                title="Confirmar"
                onPress={handleConfirm}
            />
            <SecondaryButton 
                title="Cancelar"
                onPress={onClose}
            />
            
        </PopupCard>
    );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
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