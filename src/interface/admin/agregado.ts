interface IAgregadoBase {
  codigo: string;
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

export interface IAgregadoSend extends IAgregadoBase {
  creadoPorId: string;
}

export interface IAgregadoUpdate extends IAgregadoBase {
  id: string;
  modificadoPorId: string;
}

export interface IAgregado extends IAgregadoBase {
  id: string;
  activo: boolean; 
  creadoPorId: string;
  creadoEl: string; 
  modificadoPorId?: string;
  modificadoEl?: string;
}
export interface PagedAgregadoResponse {
  data: IAgregado[]; 
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


export interface AgregadoFiltersParams {
  codigo?: string;
  estado?: number;
  fechaDesde?: string; 
}