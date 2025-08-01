import { useThemeColor } from '@/hooks/useThemeColor';
import { Notificacion } from '@/models/Notificacion';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
    notificacion: Notificacion;
    onMarkAsRead: (id: string) => Promise<void>;
};

export default function NotificacionItem({ notificacion, onMarkAsRead}: Props) {
    const icono = getIconoTipo(notificacion.tipo);
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const secondary = useThemeColor({}, 'secondary');

    const iconColor = notificacion.leida ? secondary : textColor;

    const formattedDateTime = new Date(notificacion.fecha).toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <TouchableOpacity style={[styles.container, { backgroundColor }]} onPress={() => onMarkAsRead(notificacion.id)}>
            <Ionicons name={icono} size={24} color={iconColor} style={styles.icon} />
            <View style={styles.info}>
                <Text style={[styles.titulo, { color: textColor }]}>{notificacion.titulo}</Text>
                <Text style={[styles.mensaje, { color: textColor }]}>{notificacion.mensaje}</Text>
                <Text style={[styles.fecha, { color: textColor }]}>{formattedDateTime}</Text>
            </View>
        </TouchableOpacity>
    );
}

function getIconoTipo(tipo: Notificacion['tipo']) {
    switch (tipo) {
        case 'multa':
            return 'alert-circle-outline';
        case 'verificacion':
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
