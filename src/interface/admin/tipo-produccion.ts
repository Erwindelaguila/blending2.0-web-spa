interface ITipoProduccionBase {
  codigo: string;
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

export interface ITipoProduccionRequest {
  codigo: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  LineaProduccionId: string;
  AgregadoId: string;
}

export interface ITipoProduccionUpdate extends ITipoProduccionRequest {
  id: string;
}

export interface ITipoProduccionResponse extends ITipoProduccionBase {
  id: string;
  activo: boolean;
  // Aceptar ambas variantes que puede enviar el backend para compatibilidad
  lineaProduccionId?: string;
  agregadoId?: string;
  LineaProduccionId?: string;
  AgregadoId?: string;
  creadoPorId: string;
  creadoEl: string;
  modificadoPorId?: string;
  modificadoEl?: string;
}

import { PagedResponse, BaseFiltersParams } from "@/interface";
export type PagedTipoProduccionResponse = PagedResponse<ITipoProduccionResponse>;

export interface TipoProduccionFiltersParams extends BaseFiltersParams {}
