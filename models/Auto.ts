export class Auto {
  patente: string;
  zonaId: string;
  posicion: { latitude: number; longitude: number };
  fechaEstacionamiento: Date;
  horasEstacionado?: number;

  constructor(
    patente: string,
    zonaId: string,
    posicion: { latitude: number; longitude: number },
    fechaEstacionamiento?: Date,
    horasEstacionado?: number
  ) {
    this.patente = patente;
    this.zonaId = zonaId;
    this.posicion = posicion;
    this.fechaEstacionamiento = fechaEstacionamiento ?? new Date();
    if (horasEstacionado !== undefined) {
      this.horasEstacionado = horasEstacionado;
    }
  }

  tiempoEstacionado(): number {
    const ahora = new Date();
    return Math.floor((ahora.getTime() - this.fechaEstacionamiento.getTime()) / 60000);
  }

  actualizarEstacionamiento(nuevaPosicion: { latitude: number; longitude: number }, fecha: Date, horas: number, nuevaZonaId: string) {
    this.posicion = nuevaPosicion;
    this.zonaId = nuevaZonaId
    this.fechaEstacionamiento = fecha;
    this.horasEstacionado = horas;
  }
}
