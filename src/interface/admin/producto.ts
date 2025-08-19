import { IBaseProduccion } from "./produccion";

export interface IProductoBase extends IBaseProduccion {
  calidad_id: string;
  tipo_produccion_id: string;
}

export interface IProductoSend extends IProductoBase {
  creadoPorId: string;
}

export interface IProductoUpdate extends IProductoBase {
  id: string;
  modificadoPorId: string;
}

export interface IProductoResponse extends IProductoBase {
  id: string;
  fechaCreacion?: string | null;
  modificadoEl?: string | null;
}

export interface PagedProductoResponse {
  data: IProductoResponse[];
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
    hasPrevious: boolean;
    hasNext: boolean;
    previousPage: number | null;
    nextPage: number | null;
  };
}
