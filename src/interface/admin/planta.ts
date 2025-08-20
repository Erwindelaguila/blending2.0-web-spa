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

export interface PlantaFiltersParams extends BaseFiltersParams {}
