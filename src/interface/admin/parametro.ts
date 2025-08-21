interface IParametroBase {
  codigo: string;
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

export interface IParametroRequest {
  codigo: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

export interface IParametroUpdate extends IParametroRequest {
  id: string;
}

export interface IParametroResponse extends IParametroBase {
  id: string;
  activo: boolean;
  creadoPorId: string;
  creadoEl: string;
  modificadoPorId?: string;
  modificadoEl?: string;
}

import { PagedResponse, BaseFiltersParams } from "@/interface";
export type PagedParametroResponse = PagedResponse<IParametroResponse>;

export interface ParametroFiltersParams extends BaseFiltersParams {}
