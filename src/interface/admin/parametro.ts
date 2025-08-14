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

// Interfaces para manejo consistente similar a agregado
interface IParametroBase {
  codigo: string;
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

// Para envío de datos (crear/editar)
export interface IParametroSend extends IParametroBase {
  creadoPorId: string;
}

export interface IParametroUpdate extends IParametroBase {
  id: string;
  modificadoPorId: string;
}

// Para respuesta completa del backend
export interface IParametro extends IParametroBase {
  id: string;
  activo: boolean;
  creadoPorId: string;
  creadoEl: string;
  modificadoPorId?: string;
  modificadoEl?: string;
}

// Interface para la respuesta paginada del backend
export interface PagedParametroResponse {
  items: IParametro[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

// Mantener IParametroGet para compatibilidad
export interface IParametroGet extends IParametroResponse {}
