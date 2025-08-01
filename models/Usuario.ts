export class Usuario {
  id: string;
  nombre: string;
  email: string;
  password: string;
  rol: 'cliente' | 'admin' | 'guardia';
  patentes: string[];

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
    this.patentes = [];
  }

  agregarPatente(patente: string) {
    if (!this.patentes.includes(patente)) {
      this.patentes.push(patente);
    }
  }

  eliminarPatente(patente: string) {
    this.patentes = this.patentes.filter(p => p !== patente);
  }

  esAdmin() {
    return this.rol === 'admin';
  }

  static fromJson(json: any): Usuario {
    const user = new Usuario(json.id, json.nombre, json.email, json.password, json.rol);
    user.patentes = Array.isArray(json.patentes) ? json.patentes : [];
    return user;
  }

  toJson() {
    return {
      id: this.id,
      nombre: this.nombre,
      email: this.email,
      password: this.password,
      rol: this.rol,
      patentes: this.patentes,
    };
  }
}