export interface ICalidadRequest {
  codigo: string;
  nombre: string;
  codigoMaterial: string | null;
  descripcion: string;
  activo: boolean;
  conforme: boolean; 
}

export interface ICalidadSend extends ICalidadRequest {
  creadoPorId: string;
}
export interface ICalidadUpdate extends ICalidadRequest {
  id: string;
  modificadoPorId: string;
}

export interface ICalidadResponse {
  id: string;
  codigo: string;
  nombre: string;
  codigoMaterial: string | null;
  descripcion: string;
  activo: boolean;
  conforme: boolean; 
  creadoEl?: string | null;
  modificadoEl?: string | null;
}

import { PagedResponse, BaseFiltersParams } from "@/interface";

export type PagedCalidadResponse = PagedResponse<ICalidadResponse>;

export interface CalidadFiltersParams extends BaseFiltersParams {}
