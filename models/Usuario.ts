import { Auto } from "./Auto";

export class Usuario {
  id: string;
  nombre: string;
  email: string;
  password: string;
  rol: 'cliente' | 'admin' | 'guardia';
  autos: Auto[];

  constructor(
    id: string,
    nombre: string,
    email: string,
    password: string,
    rol: 'cliente' | 'admin' | 'guardia' = 'cliente'
  ) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.password = password;
    this.rol = rol;
    this.autos = [];
  }

  agregarAuto(patente: string) {
    const yaExiste = this.autos.some(a => a.patente === patente);
    if (!yaExiste) {
      const nuevoAuto = new Auto(patente, '', { latitude: 0, longitude: 0 });
      this.autos.push(nuevoAuto);
    }
  }

  eliminarAuto(patente: string) {
    this.autos = this.autos.filter(a => a.patente !== patente);
  }

  esAdmin() {
    return this.rol === 'admin';
  }

  static fromJson(json: any): Usuario {
    const user = new Usuario(json.id, json.nombre, json.email, json.password, json.rol);
    user.autos = json.autos.map((a: any) => new Auto(a.patente, '', { latitude: 0, longitude: 0 }));
    return user;
  }

  toJson() {
    return {
      id: this.id,
      nombre: this.nombre,
      email: this.email,
      password: this.password,
      rol: this.rol,
      autos: this.autos.map(a => ({ patente: a.patente })),
    };
  }
}
