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

export interface PagedLineaProduccionResponse {
  items: ILineaProduccion[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

// Nueva estructura para compatibilidad con el backend actualizado
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
