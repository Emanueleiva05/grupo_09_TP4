export class Usuario {
    id: string;
    nombre: string;
    email: string;
    password: string;
    rol: 'cliente' | 'admin' | 'guardia';
    autos: string[]; // patentes asociadas
  
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
      if (!this.autos.includes(patente)) {
        this.autos.push(patente);
      }
    }
  
    eliminarAuto(patente: string) {
      this.autos = this.autos.filter(a => a !== patente);
    }
  
    esAdmin() {
      return this.rol === 'admin';
    }
  }
  