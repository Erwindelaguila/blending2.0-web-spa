interface ILineaProduccionBase {
  codigo: string;
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

export interface ILineaProduccionRequest {
  codigo: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

export interface ILineaProduccionUpdate extends ILineaProduccionRequest {
  id: string;
}

export interface ILineaProduccionResponse extends ILineaProduccionBase {
  id: string;
  activo: boolean;
  creadoPorId: string;
  creadoEl: string;
  modificadoPorId?: string;
  modificadoEl?: string;
}

import { PagedResponse, BaseFiltersParams } from "@/interface";
export type PagedLineaProduccionResponse = PagedResponse<ILineaProduccionResponse>;

export interface LineaProduccionFiltersParams extends BaseFiltersParams {}
