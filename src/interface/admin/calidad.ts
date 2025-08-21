interface ICalidadBase {
  codigo: string;
  nombre: string;
  codigoMaterial?: string | null;
  descripcion?: string;
  activo?: boolean;
  conforme?: boolean;
}

export interface ICalidadRequest {
  codigo: string;
  nombre: string;
  codigoMaterial?: string | null;
  descripcion?: string;
  activo: boolean;
  conforme: boolean;
}

export interface ICalidadUpdate extends ICalidadRequest {
  id: string;
}

export interface ICalidadResponse extends ICalidadBase {
  id: string;
  activo: boolean;
  creadoPorId: string;
  creadoEl: string;
  modificadoPorId?: string;
  modificadoEl?: string;
}

import { PagedResponse, BaseFiltersParams } from "@/interface";
export type PagedCalidadResponse = PagedResponse<ICalidadResponse>;

export interface CalidadFiltersParams extends BaseFiltersParams {}
