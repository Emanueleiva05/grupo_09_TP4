import { Auto } from './Auto';
import { Usuario } from './Usuario';
import { Zona } from './Zona';

export class GestorEstacionamiento {
  zonas: Zona[];
  autos: Auto[];
  usuarios: Usuario[];

  constructor() {
    this.zonas = [];
    this.autos = [];
    this.usuarios = [];
  }

  agregarZona(zona: Zona) {
    this.zonas.push(zona);
  }

  agregarAuto(auto: Auto): boolean {
    const zona = this.zonas.find(z => z.id === auto.zonaId);
    if (!zona) return false;
    this.autos.push(auto);
    return true;
  }

  retirarAuto(patente: string) {
    this.autos = this.autos.filter(a => a.patente !== patente);
  }

  agregarUsuario(usuario: Usuario) {
    this.usuarios.push(usuario);
  }

  obtenerUsuarioPorId(id: string): Usuario | undefined {
    return this.usuarios.find(u => u.id === id);
  }

  obtenerAutosPorZona(zonaId: string): Auto[] {
    return this.autos.filter(a => a.zonaId === zonaId);
  }
}
