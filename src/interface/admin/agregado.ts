interface IAgregadoBase {
  codigo: string;
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

// Request DTO sin campos de auditoría
export interface IAgregadoRequest {
  codigo: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

export interface IAgregadoUpdate extends IAgregadoRequest {
  id: string;
}

// Response estandarizado (mismo patrón que parámetros/plantas)
export interface IAgregadoResponse extends IAgregadoBase {
  id: string;
  activo: boolean; 
  creadoPorId: string;
  creadoEl: string; 
  modificadoPorId?: string;
  modificadoEl?: string;
}

// Alias para compatibilidad retro con código existente
export type IAgregado = IAgregadoResponse;
import { PagedResponse, BaseFiltersParams } from "@/interface";
export type PagedAgregadoResponse = PagedResponse<IAgregadoResponse>;

export interface AgregadoFiltersParams extends BaseFiltersParams {}