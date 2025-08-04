export type Coordenada = { latitude: number; longitude: number };

export type Horario = { dia: string; desde: string; hasta: string };

export class Zona {
  id: string;
  nombre: string;
  area: Coordenada[];
  horariosPermitidos: Horario[];
  precioHora: number;
  color: string;

  constructor(
    id: string,
    nombre: string,
    area: Coordenada[],
    horariosPermitidos: Horario[],
    precioHora: number,
    color: string
  ) {
    this.id = id;
    this.nombre = nombre;
    this.area = area;
    this.horariosPermitidos = horariosPermitidos;
    this.precioHora = precioHora;
    this.color = color;
  }

  estaPermitido(dia: string, hora: string): boolean {
    const horario = this.horariosPermitidos.find(h => h.dia === dia);
    if (!horario) return false;
    return hora >= horario.desde && hora <= horario.hasta;
  }

  contienePunto(punto: Coordenada): boolean {
    let inside = false;
    const x = punto.longitude;
    const y = punto.latitude;
    
    for (let i = 0, j = this.area.length - 1; i < this.area.length; j = i++) {
      const xi = this.area[i].longitude;
      const yi = this.area[i].latitude;
      const xj = this.area[j].longitude;
      const yj = this.area[j].latitude;
      
      const intersect = ((yi > y) !== (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    
    return inside;
  }
}
