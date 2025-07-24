export interface IParametroRequest {
  codigo: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

export interface IParametroResponse {
  id: string; // UNIQUEIDENTIFIER como en plantas
  codigo: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
  fechaCreacion: string;
}

// Mantener IParametro e IParametroGet para compatibilidad
export interface IParametro extends IParametroRequest {}
export interface IParametroGet extends IParametroResponse {}
