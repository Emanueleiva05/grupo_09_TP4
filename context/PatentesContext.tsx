import { useAuth } from '@/context/AuthContext';
import { Auto } from '@/models/Auto';
import { Usuario } from '@/models/Usuario';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type PatentesContextType = {
  patentes: Auto[];
  agregarPatente: (patente: string) => Promise<void>;
  eliminarPatente: (patente: string) => Promise<void>;
  cargarPatentes: () => Promise<void>;
};

const PatentesContext = createContext<PatentesContextType | undefined>(undefined);

export const PatentesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { usuario, actualizarUsuario } = useAuth();
  const [patentes, setPatentes] = useState<Auto[]>([]);

  const cargarPatentes = async () => {
    const guardadas = await AsyncStorage.getItem('patentes');
    let autosDesdeStorage: Auto[] = [];

    if (guardadas) {
      const autosPlanos = JSON.parse(guardadas);
      autosDesdeStorage = autosPlanos.map((a: any) => new Auto(
        a.patente,
        a.zonaId ?? '',
        a.posicion ?? { latitude: 0, longitude: 0 },
        a.fechaEstacionamiento ? new Date(a.fechaEstacionamiento) : undefined
      ));
    }

    const autosDesdeUsuario = usuario?.autos ?? [];

    const todasPatentesMap = new Map<string, Auto>();

    autosDesdeStorage.forEach(auto => todasPatentesMap.set(auto.patente, auto));
    autosDesdeUsuario.forEach(auto => todasPatentesMap.set(auto.patente, auto));

    const todasPatentes = Array.from(todasPatentesMap.values());

    setPatentes(todasPatentes);
  };

  useEffect(() => {
    cargarPatentes();
  }, [usuario]);

  const agregarPatente = async (patente: string) => {
    const patenteClean = patente.trim().toUpperCase();
    if (!patenteClean || patentes.some(auto => auto.patente === patenteClean)) return;

    const nuevoAuto = new Auto(patenteClean, '', { latitude: 0, longitude: 0 });
    const nuevasPatentes = [...patentes, nuevoAuto];
    setPatentes(nuevasPatentes);

    if (usuario) {
      const usuarioActualizado = new Usuario(
        usuario.id,
        usuario.nombre,
        usuario.email,
        usuario.password,
        usuario.rol
      );
      usuarioActualizado.autos = nuevasPatentes;

      await actualizarUsuario(usuarioActualizado);
      await AsyncStorage.setItem('patentes', JSON.stringify(
        nuevasPatentes.map(a => ({
          patente: a.patente,
          zonaId: a.zonaId,
          posicion: a.posicion,
          fechaEstacionamiento: a.fechaEstacionamiento?.toISOString(),
        }))
      ));
    }
  };

  const eliminarPatente = async (patente: string) => {
    if (!usuario) return;
    const nuevasPatentes = patentes.filter(auto => auto.patente !== patente);
    setPatentes(nuevasPatentes);

    const usuarioActualizado = new Usuario(
      usuario.id,
      usuario.nombre,
      usuario.email,
      usuario.password,
      usuario.rol
    );
    usuarioActualizado.autos = nuevasPatentes;

    await actualizarUsuario(usuarioActualizado);
    await AsyncStorage.setItem('patentes', JSON.stringify(
      nuevasPatentes.map(a => ({
        patente: a.patente,
        zonaId: a.zonaId,
        posicion: a.posicion,
        fechaEstacionamiento: a.fechaEstacionamiento?.toISOString(),
      }))
    ));
  };

  return (
    <PatentesContext.Provider value={{ patentes, agregarPatente, eliminarPatente, cargarPatentes }}>
      {children}
    </PatentesContext.Provider>
  );
};

export const usePatentes = () => {
  const context = useContext(PatentesContext);
  if (!context) {
    throw new Error('usePatentes must be used within a PatentesProvider');
  }
  return context;
};
