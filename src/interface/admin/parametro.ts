export interface IParametro {
  codigo: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

export interface IParametroGet extends IParametro {
  id: number;
  fechaCreacion: string; // también puede ser Date si haces parsing
}
