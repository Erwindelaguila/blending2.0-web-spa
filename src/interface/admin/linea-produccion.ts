interface ILineaProduccionBase {
  codigo: string;
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

export interface ILineaProduccionSend extends ILineaProduccionBase {
  creadoPorId: string;
}

export interface ILineaProduccionUpdate extends ILineaProduccionBase {
  id: string;
  modificadoPorId: string;
}

export interface ILineaProduccion extends ILineaProduccionBase {
  id: string;
  activo: boolean;
  creadoPorId: string;
  creadoEl: string;
  modificadoPorId?: string;
  modificadoEl?: string;
}

import { PaginationMeta, PagedResponse, BaseFiltersParams } from "@/interface";

export type PagedLineaProduccionResponse = PagedResponse<ILineaProduccion>;

export interface LineaProduccionFiltersParams extends BaseFiltersParams {}
