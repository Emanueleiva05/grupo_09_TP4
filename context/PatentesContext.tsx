import { useAuth } from '@/context/AuthContext';
import { Auto } from '@/models/Auto';
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
  const { usuario } = useAuth();
  const [patentes, setPatentes] = useState<Auto[]>([]);

  const obtenerClaveStorage = () => `patentes_usuario_${usuario?.id}`;

  const cargarPatentes = async () => {
    if (!usuario) return;

    const clave = obtenerClaveStorage();
    const guardadas = await AsyncStorage.getItem(clave);

    let autos: Auto[] = [];

    if (guardadas) {
      const autosPlanos = JSON.parse(guardadas);
      autos = autosPlanos.map((a: any) => {
        const auto = new Auto(
          a.patente,
          a.zonaId ?? '',
          a.posicion ?? { latitude: 0, longitude: 0 },
          a.fechaEstacionamiento ? new Date(a.fechaEstacionamiento) : undefined,
          a.horasEstacionado ?? 0
        );
        return auto;
      });
    }
    setPatentes(autos);
  };

  useEffect(() => {
    cargarPatentes();
  }, [usuario]);

  const guardarPatentes = async (patentes: Auto[]) => {
    const clave = obtenerClaveStorage();
    await AsyncStorage.setItem(clave, JSON.stringify(
      patentes.map(a => ({
        patente: a.patente,
        zonaId: a.zonaId,
        posicion: a.posicion,
        fechaEstacionamiento: a.fechaEstacionamiento?.toISOString(),
        horasEstacionado: a.horasEstacionado,
      }))
    ));
  };

  const agregarPatente = async (patente: string) => {
    if (!usuario) return;

    const limpia = patente.trim().toUpperCase();
    if (!limpia || patentes.some(a => a.patente === limpia)) return;

    const nuevoAuto = new Auto(limpia, '', { latitude: 0, longitude: 0 });
    const nuevasPatentes = [...patentes, nuevoAuto];

    setPatentes(nuevasPatentes);
    console.log(nuevasPatentes);
    await guardarPatentes(nuevasPatentes);
  };

  const eliminarPatente = async (patente: string) => {
    if (!usuario) return;

    const nuevasPatentes = patentes.filter(a => a.patente !== patente);
    setPatentes(nuevasPatentes);
    await guardarPatentes(nuevasPatentes);
  };

  return (
    <PatentesContext.Provider value={{ patentes, agregarPatente, eliminarPatente, cargarPatentes }}>
      {children}
    </PatentesContext.Provider>
  );
};

export const usePatentes = () => {
  const context = useContext(PatentesContext);
  if (!context) throw new Error('usePatentes must be used within a PatentesProvider');
  return context;
};