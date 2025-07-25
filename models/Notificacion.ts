type TipoNotificacion = 'multa' | 'pago' | 'recordatorio';

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
}
