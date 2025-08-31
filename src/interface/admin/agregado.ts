interface IAgregadoBase {
  codigo: string;
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

export interface IAgregadoRequest {
  codigo: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

export interface IAgregadoUpdate extends IAgregadoRequest {
  id: string;
}

export interface IAgregadoResponse extends IAgregadoBase {
  id: string;
  activo: boolean; 
  creadoPorId: string;
  creadoEl: string; 
  modificadoPorId?: string;
  modificadoEl?: string;
}
export type IAgregado = IAgregadoResponse;
import { PagedResponse, BaseFiltersParams } from "@/interface";
export type PagedAgregadoResponse = PagedResponse<IAgregadoResponse>;

export interface AgregadoFiltersParams extends BaseFiltersParams {}