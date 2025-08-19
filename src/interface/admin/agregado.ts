interface IAgregadoBase {
  codigo: string;
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

export interface IAgregadoSend extends IAgregadoBase {
  creadoPorId: string;
}

export interface IAgregadoUpdate extends IAgregadoBase {
  id: string;
  modificadoPorId: string;
}

export interface IAgregado extends IAgregadoBase {
  id: string;
  activo: boolean; 
  creadoPorId: string;
  creadoEl: string; 
  modificadoPorId?: string;
  modificadoEl?: string;
}
import { PagedResponse, BaseFiltersParams } from "@/interface";
export type PagedAgregadoResponse = PagedResponse<IAgregado>;

export interface AgregadoFiltersParams extends BaseFiltersParams {}