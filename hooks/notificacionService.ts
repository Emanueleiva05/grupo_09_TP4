import { v4 as uuidv4 } from 'uuid';
import { Notificacion } from '../models/Notificacion';

export const crearNotificacion = async (
    userId: string,
    titulo: string,
    mensaje: string,
    tipo: 'multa' | 'verificacion' | 'recordatorio' = 'recordatorio'
) => {
    const id = uuidv4();
    const notificacion = Notificacion.crearNotificacion({
        id,
        userId,
        titulo,
        mensaje,
        tipo,
    });
    await Notificacion.guardarNotificacion(notificacion);
};