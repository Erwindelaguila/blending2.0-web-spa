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
  lineaProduccionId: string;
  agregadoId: string;
}

export interface ITipoProduccionUpdate extends ITipoProduccionRequest {
  id: string;
}

export interface ITipoProduccionResponse extends ITipoProduccionBase {
  id: string;
  activo: boolean;
  lineaProduccion: {
    id: string;
    codigo: string;
  };
  agregado: {
    id: string;
    codigo: string;
  };
  creadoPorId: string;
  creadoEl: string;
  modificadoPorId?: string;
  modificadoEl?: string;
}

import { PagedResponse, BaseFiltersParams } from "@/interface";
export type PagedTipoProduccionResponse = PagedResponse<ITipoProduccionResponse>;

export interface TipoProduccionFiltersParams extends BaseFiltersParams {}
