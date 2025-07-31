import AsyncStorage from '@react-native-async-storage/async-storage';

type TipoNotificacion = 'multa' | 'verificacion' | 'recordatorio';

export class Notificacion {
    id: string;
    userId: string;
    titulo: string;
    mensaje: string;
    tipo: TipoNotificacion;
    leida: boolean;
    fecha: Date;

    constructor(
        id: string = '',
        userId: string = '',
        titulo: string = '',
        mensaje: string = '',
        tipo: TipoNotificacion = 'recordatorio',
        leida: boolean = false,
        fecha: Date = new Date()
    ) {
        this.id = id;
        this.userId = userId;
        this.titulo = titulo;
        this.mensaje = mensaje;
        this.tipo = tipo;
        this.leida = leida;
        this.fecha = fecha;
    }

    static crearNotificacion({
        id,
        userId,
        titulo,
        mensaje,
        tipo = 'recordatorio'
    }: {
        id: string;
        userId: string;
        titulo: string;
        mensaje: string;
        tipo?: TipoNotificacion;
    }): Notificacion {
        if (!userId) throw new Error('Debe especificarse un usuario');
        return new Notificacion(
            id,
            userId,
            titulo,
            mensaje,
            tipo,
            false,
            new Date()
        );
    }

    marcarLeida(): void {
        this.leida = true;
    }

    static async obtenerNotificaciones(): Promise<Notificacion[]> {
    try {
        const data = await AsyncStorage.getItem('notificaciones');
        const raw = data ? JSON.parse(data) : [];
        return raw.map((n: any) => new Notificacion(
            n.id,
            n.userId,
            n.titulo,
            n.mensaje,
            n.tipo,
            n.leida,
            new Date(n.fecha)
        ));
    } catch (error) {
        console.error('Error al obtener notificaciones:', error);
        return [];
        }
    }

    static async guardarNotificacion(notificacion: Notificacion): Promise<void> {
    try {
        const data = await AsyncStorage.getItem('notificaciones');
        const existentes = data ? JSON.parse(data) : [];

        existentes.push({
            ...notificacion,
            fecha: notificacion.fecha.toISOString(),
        });

        await AsyncStorage.setItem('notificaciones', JSON.stringify(existentes));
    } catch (error) {
        console.error('Error al guardar notificación:', error);
    }
}
}
