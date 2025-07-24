import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Zona } from '../../models/Zona';
import PopupCard from './PopupCard';

type Props = {
  zona: Zona | null;
  visible: boolean;
  onClose: () => void;
  esAdmin?: boolean;
  onEliminarZona?: () => void;
};


export default function ZonaInfoPopup({ zona, visible, onClose, esAdmin, onEliminarZona }: Props) {
  if (!zona) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <PopupCard>
          <View style={styles.header}>
            <Text style={styles.title}>{zona.nombre}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Precio por hora</Text>
            <Text style={styles.infoText}>${zona.precioHora.toFixed(2)}</Text>

            <Text style={[styles.infoTitle, { marginTop: 10 }]}>Horarios permitidos</Text>
            {zona.horariosPermitidos.map((h, i) => (
              <Text key={i} style={styles.infoText}>{`${h.dia}: ${h.desde} - ${h.hasta}`}</Text>
            ))}
          </View>

          {esAdmin && onEliminarZona && (
            <TouchableOpacity
              style={[styles.closeButtonBottom, { backgroundColor: '#e74c3c', marginTop: 10 }]}
              onPress={onEliminarZona}
            >
              <Text style={styles.closeButtonText}>Eliminar zona</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.closeButtonBottom} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </PopupCard>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 12,
  },
  title: { 
    color: Colors.light.text, 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  closeButton: { 
    padding: 4 
  },
  closeButtonText: { 
    color: Colors.light.text, 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  infoBox: {
    backgroundColor: Colors.light.inputBackground,
    borderRadius: 8,
    padding: 12,
  },
  infoTitle: { 
    color: Colors.light.text, 
    fontWeight: 'bold', 
    marginBottom: 4 
  },
  infoText: { 
    color: Colors.light.text, 
    fontSize: 14,
    marginBottom: 2,
  },
  closeButtonBottom: {
    marginTop: 20,
    backgroundColor: Colors.light.buttonBackground,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
});
