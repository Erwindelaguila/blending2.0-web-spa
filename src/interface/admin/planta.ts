interface IPlantaBase {
  codigo: string;
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

export interface IPlantaRequest {
  codigo: string;
  nombre: string;
  descripcion?: string;
  numeroRuma: number;
  activo: boolean;
}

export interface IPlantaUpdate extends IPlantaRequest {
  id: string;
}

export interface IPlantaResponse extends IPlantaBase {
  id: string;
  activo: boolean;
  numeroRuma: number;
  creadoPorId: string;
  creadoEl: string;
  modificadoPorId?: string;
  modificadoEl?: string;
}

import { PagedResponse, BaseFiltersParams } from "@/interface";
export type PagedPlantaResponse = PagedResponse<IPlantaResponse>;

// Nueva estructura con items similar a calidades
export interface PlantaPagedItemsResponse {
  items: IPlantaResponse[];
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

export interface PlantaFiltersParams extends BaseFiltersParams {}
