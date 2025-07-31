import { useThemeColor } from '@/hooks/useThemeColor';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Horario } from '../../models/Zona';
import PopupCard from './PopupCard';

type CrearZonaPopupProps = {
  onCancel: () => void;
  onSave: (nombre: string, precioHora: number, horarios: Horario[], color: string) => void;
};

export default function CrearZonaPopup({ onCancel, onSave }: CrearZonaPopupProps) {
  const [nombre, setNombre] = useState('');
  const [precioHora, setPrecioHora] = useState('');
  const [color, setColor] = useState('#000000');
  const [dia, setDia] = useState('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [horarios, setHorarios] = useState<Horario[]>([]);

  // Colores del tema
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const inputBackground = useThemeColor({}, 'inputBackground');
  const primaryColor = useThemeColor({}, 'primary');
  const buttonBackground = useThemeColor({}, 'buttonBackground');

  const handleAddHorario = () => {
    if (dia && desde && hasta) {
      setHorarios([...horarios, { dia, desde, hasta }]);
      setDia('');
      setDesde('');
      setHasta('');
    }
  };

  const handleGuardarZona = () => {
    const precioNum = parseFloat(precioHora);
    if (!nombre || isNaN(precioNum) || horarios.length === 0 || !color) {
      alert('Completa todos los campos y agrega al menos un horario');
      return;
    }
    onSave(nombre, precioNum, horarios, color);
  };

  return (
    <PopupCard>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Crear Nueva Zona</Text>
        <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
          <Text style={[styles.closeButtonText, { color: textColor }]}>X</Text>
        </TouchableOpacity>
      </View>

      {/** Inputs */}
      <TextInput
        placeholder="Nombre"
        style={[styles.input, { backgroundColor: inputBackground, color: textColor }]}
        value={nombre}
        onChangeText={setNombre}
        placeholderTextColor="#bbb"
      />
      <TextInput
        placeholder="Precio por Hora"
        style={[styles.input, { backgroundColor: inputBackground, color: textColor }]}
        value={precioHora}
        onChangeText={setPrecioHora}
        keyboardType="numeric"
        placeholderTextColor="#bbb"
      />
      <TextInput
        placeholder="Color (hex)"
        style={[styles.input, { backgroundColor: inputBackground, color: textColor }]}
        value={color}
        onChangeText={setColor}
        placeholderTextColor="#bbb"
      />

      <Text style={[styles.sectionTitle, { color: textColor }]}>Agregar Horario</Text>
      <TextInput
        placeholder="Día (Ej: Lunes)"
        style={[styles.input, { backgroundColor: inputBackground, color: textColor }]}
        value={dia}
        onChangeText={setDia}
        placeholderTextColor="#bbb"
      />
      <TextInput
        placeholder="Desde (HH:mm)"
        style={[styles.input, { backgroundColor: inputBackground, color: textColor }]}
        value={desde}
        onChangeText={setDesde}
        placeholderTextColor="#bbb"
      />
      <TextInput
        placeholder="Hasta (HH:mm)"
        style={[styles.input, { backgroundColor: inputBackground, color: textColor }]}
        value={hasta}
        onChangeText={setHasta}
        placeholderTextColor="#bbb"
      />

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: buttonBackground },
          (!dia || !desde || !hasta) && styles.buttonDisabled,
        ]}
        onPress={handleAddHorario}
        disabled={!dia || !desde || !hasta}
      >
        <Text style={[styles.buttonText, { color: textColor }]}>Agregar Horario</Text>
      </TouchableOpacity>

      {horarios.length > 0 && (
        <FlatList
          style={styles.list}
          data={horarios}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <Text style={[styles.listItem, { color: textColor }]}>
              {`${item.dia}: ${item.desde} - ${item.hasta}`}
            </Text>
          )}
        />
      )}

      <View style={styles.buttonsRow}>
        <TouchableOpacity style={[styles.secondaryButton, { backgroundColor: buttonBackground }]} onPress={onCancel}>
          <Text style={[styles.buttonText, { color: textColor }]}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.secondaryButton,
            { backgroundColor: primaryColor },
            (!nombre || !precioHora || horarios.length === 0 || !color) && styles.buttonDisabled,
          ]}
          onPress={handleGuardarZona}
          disabled={!nombre || !precioHora || horarios.length === 0 || !color}
        >
          <Text style={[styles.buttonText, { color: textColor }]}>Guardar Zona</Text>
        </TouchableOpacity>
      </View>
    </PopupCard>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 18, fontWeight: 'bold' },
  closeButton: { padding: 8 },
  closeButtonText: { fontWeight: 'bold', fontSize: 18 },
  input: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 14,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 10,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  list: {
    maxHeight: 100,
    marginBottom: 10,
  },
  listItem: {
    fontSize: 14,
    marginBottom: 2,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    borderRadius: 8,
    paddingVertical: 12,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
});
