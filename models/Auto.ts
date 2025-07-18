export class Auto {
    patente: string;
    zonaId: string;
    posicion: { latitude: number; longitude: number }; // dónde se estacionó
    fechaEstacionamiento: Date;
  
    constructor(
      patente: string,
      zonaId: string,
      posicion: { latitude: number; longitude: number },
      fechaEstacionamiento?: Date
    ) {
      this.patente = patente;
      this.zonaId = zonaId;
      this.posicion = posicion;
      this.fechaEstacionamiento = fechaEstacionamiento || new Date();
    }
  
    tiempoEstacionado(): number {
      const ahora = new Date();
      return Math.floor((ahora.getTime() - this.fechaEstacionamiento.getTime()) / 60000);
    }
  }
  