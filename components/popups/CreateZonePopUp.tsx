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
        <Text style={styles.title}>Crear Nueva Zona</Text>
        <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Nombre"
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholderTextColor="#bbb"
      />
      <TextInput
        placeholder="Precio por Hora"
        style={styles.input}
        value={precioHora}
        onChangeText={setPrecioHora}
        keyboardType="numeric"
        placeholderTextColor="#bbb"
      />
      <TextInput
        placeholder="Color (hex)"
        style={styles.input}
        value={color}
        onChangeText={setColor}
        placeholderTextColor="#bbb"
      />

      <Text style={styles.sectionTitle}>Agregar Horario</Text>
      <TextInput
        placeholder="Día (Ej: Lunes)"
        style={styles.input}
        value={dia}
        onChangeText={setDia}
        placeholderTextColor="#bbb"
      />
      <TextInput
        placeholder="Desde (HH:mm)"
        style={styles.input}
        value={desde}
        onChangeText={setDesde}
        placeholderTextColor="#bbb"
      />
      <TextInput
        placeholder="Hasta (HH:mm)"
        style={styles.input}
        value={hasta}
        onChangeText={setHasta}
        placeholderTextColor="#bbb"
      />

      <TouchableOpacity
        style={[styles.button, (!dia || !desde || !hasta) && styles.buttonDisabled]}
        onPress={handleAddHorario}
        disabled={!dia || !desde || !hasta}
      >
        <Text style={styles.buttonText}>Agregar Horario</Text>
      </TouchableOpacity>

      {horarios.length > 0 && (
        <FlatList
          style={styles.list}
          data={horarios}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <Text style={styles.listItem}>{`${item.dia}: ${item.desde} - ${item.hasta}`}</Text>
          )}
        />
      )}

      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.secondaryButton} onPress={onCancel}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.secondaryButton,
            (!nombre || !precioHora || horarios.length === 0 || !color) && styles.buttonDisabled,
          ]}
          onPress={handleGuardarZona}
          disabled={!nombre || !precioHora || horarios.length === 0 || !color}
        >
          <Text style={styles.buttonText}>Guardar Zona</Text>
        </TouchableOpacity>
      </View>
    </PopupCard>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  closeButton: { padding: 8 },
  closeButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  input: {
    backgroundColor: '#3a3a4c',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 14,
  },
  sectionTitle: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#4a90e2',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: '#888888',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  list: {
    maxHeight: 100,
    marginBottom: 10,
  },
  listItem: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 2,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    backgroundColor: '#4a90e2',
    borderRadius: 8,
    paddingVertical: 12,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
});
