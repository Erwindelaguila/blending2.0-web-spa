interface IProductoBase {
  codigo: string;
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

export interface IProductoRequest {
  codigo: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  CalidadId: string;
  TipoProduccionId: string;
}

export interface IProductoUpdate extends IProductoRequest {
  id: string;
}

export interface CalidadResumen { id: string; codigo: string; }
export interface TipoProduccionResumen { id: string; codigo: string; }

export interface IProductoResponse extends IProductoBase {
  id: string;
  activo: boolean;
  calidadId?: string;
  tipoProduccionId?: string;
  calidad?: CalidadResumen;
  tipoProduccion?: TipoProduccionResumen;
  creadoPorId?: string;
  creadoEl?: string;
  modificadoPorId?: string | null;
  modificadoEl?: string | null;
}

import { PagedResponse, BaseFiltersParams } from "@/interface";
export type PagedProductoResponse = PagedResponse<IProductoResponse>;

export interface ProductoFiltersParams extends BaseFiltersParams {}
