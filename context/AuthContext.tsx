import { Usuario } from "@/models/Usuario";
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from "react";
import 'react-native-get-random-values'; // hace que funcione la creacion del id
import { v4 as uuidv4 } from 'uuid';

type AuthContextType = {
    usuario: Usuario | null;
    login: (email: string, password: string) => Promise<boolean>;
    register: (nuevoUsuario: Usuario) => Promise<boolean>;
    logout: () => Promise<void>;
    isLoading: boolean;
    error: string | null;
    crearAdmin: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const cargarSesion = async () => {
            try {
                const data = await AsyncStorage.getItem('usuario');
                if (data) setUsuario(JSON.parse(data));
            } catch (error) {
                console.error("Error cargando sesion: ", error);
            } finally {
                setIsLoading(false);
            }
        };
        cargarSesion();
    }, []);
    
    const login = async (email: string, password: string): Promise<boolean> => {
        setError(null);
        const data = await AsyncStorage.getItem('usuariosRegistrados');
        const usuarios: Usuario[] = data ? JSON.parse(data) : [];
        
        const encontrado = usuarios.find(
            (u) => u.email === email && u.password === password
        );
        
        if (encontrado) {
            setUsuario(encontrado);
            await AsyncStorage.setItem('usuario', JSON.stringify(encontrado));
            return true;
        } else {
            setError('Credenciales incorrectas');
            return false;
        }
    };
    
    const register = async (nuevoUsuario: Usuario): Promise<boolean> => {
        setError(null);
        const data = await AsyncStorage.getItem('usuariosRegistrados');
        const usuarios: Usuario[] = data ? JSON.parse(data) : [];
        
        const existe = usuarios.some((u) => u.email === nuevoUsuario.email);
        if (existe) {
            setError('Ya existe un usuario con ese email');
            return false;
        }
        
        const actualizado = [...usuarios, nuevoUsuario];
        await AsyncStorage.setItem('usuariosRegistrados', JSON.stringify(actualizado)); //agrega al usuario a la lista de usuarios registrados
        await AsyncStorage.setItem('usuario', JSON.stringify(nuevoUsuario)); //persiste la sesion
        setUsuario(nuevoUsuario); // mete al usuario al context (es parte del logeo de sesion)
        return true;
    }
    
    const logout = async () => {
        setUsuario(null);
        await AsyncStorage.removeItem('usuario');
    };
    
    // funcion para crear un admin, con datos harcodeados para pruebas
    const crearAdmin = async () => {
    try {
        const usuariosRaw = await AsyncStorage.getItem("usuariosRegistrados");
        const usuarios = usuariosRaw ? JSON.parse(usuariosRaw) : [];

        // Verificar si ya existe un admin con ese mail
        const yaExiste = usuarios.some((u: any) => u.email === "admin@admin.com");
        if (yaExiste) {
            const encontrado = usuarios.find((u: any) => u.email === "admin@admin.com");
            console.log("Ya existe un usuario admin.");
            console.log(encontrado);
            return;
        }

        const nuevoAdmin = {
        id: uuidv4(),
        nombre: "admin",
        email: "admin@admin.com",
        password: "admin123",
        rol: "admin",
        autos: [],
        };

        const usuariosActualizados = [...usuarios, nuevoAdmin];
        await AsyncStorage.setItem("usuariosRegistrados", JSON.stringify(usuariosActualizados));
        console.log("Usuario admin creado correctamente.");
        console.log(nuevoAdmin);
    } catch (error) {
        console.error("Error al crear el usuario admin:", error);
    }
    };
    
    return (
        <AuthContext.Provider value={{ usuario, login, register, logout, isLoading, error, crearAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
    return context;
};