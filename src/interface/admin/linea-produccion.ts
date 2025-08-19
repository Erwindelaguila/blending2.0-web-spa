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

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
  previousPage?: number;
  nextPage?: number;
}

export interface NewPagedLineaProduccionResponse {
  data: ILineaProduccion[];
  pagination: PaginationMeta;
}

export type PagedLineaProduccionResponse = NewPagedLineaProduccionResponse;

export interface LineaProduccionFiltersParams {
  codigo?: string;
  estado?: number;
  fechaDesde?: string;
}
