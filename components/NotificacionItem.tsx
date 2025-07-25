import { useThemeColor } from '@/hooks/useThemeColor';
import { Notificacion } from '@/models/Notificacion';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
    notificacion: Notificacion;
};

export default function NotificacionItem({ notificacion }: Props) {
    const icono = getIconoTipo(notificacion.tipo);
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const secondary = useThemeColor({}, 'secondary');

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Ionicons name={icono} size={24} color={secondary} style={styles.icon} />
            <View style={styles.info}>
                <Text style={[styles.titulo, { color: textColor }]}>{notificacion.titulo}</Text>
                <Text style={[styles.mensaje, { color: textColor }]}>{notificacion.mensaje}</Text>
                <Text style={[styles.fecha, { color: textColor }]}>{new Date(notificacion.fecha).toLocaleDateString()}</Text>
            </View>
        </View>
    );
}

function getIconoTipo(tipo: Notificacion['tipo']) {
    switch (tipo) {
        case 'multa':
            return 'alert-circle-outline';
        case 'pago':
            return 'checkmark-circle-outline';
        case 'recordatorio':
            return 'time-outline';
        default:
            return 'notifications-outline';
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginVertical: 8,
        padding: 16, 
        borderRadius: 12, 
        elevation: 4, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2, 
        shadowRadius: 4,
    },
    icon: {
        marginRight: 12,
    },
    info: {
        flex: 1,
    },
    titulo: {
        fontWeight: 'bold',
        fontSize: 16, 
    },
    mensaje: {
        fontSize: 14,
    },
    fecha: {
        fontSize: 12,
    },
});
