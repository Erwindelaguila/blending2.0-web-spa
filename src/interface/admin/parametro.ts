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
  creadoEl: string; // DateTime generado por el backend
  modificadoEl?: string; // DateTime de modificación
  creadoPorId: string;
  modificadoPorId?: string;
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

// Nueva estructura para compatibilidad con el backend actualizado
import { PagedResponse } from "@/interface";
import { BaseFiltersParams } from "@/interface/components/filters";

export type PagedParametroResponse = PagedResponse<IParametroResponse>;

// Filtros para parámetros extendiendo la base común
export interface ParametroFiltersParams extends BaseFiltersParams {
  // BaseFiltersParams ya incluye: codigo?, estado?, fechaDesde?
}

// Mantener IParametroGet para compatibilidad
export interface IParametroGet extends IParametroResponse {}
