import { IBaseProduccion } from "./produccion";

export interface ICalidadSend extends ICalidadRequest { creadoPorId: string; }
export interface ICalidadUpdate extends ICalidadRequest { id: number; modificadoPorId: string; }

export interface ICalidad extends IBaseProduccion {
  codigoMaterial: string;
  conforme: boolean;
}

export interface ICalidadGet extends ICalidad {
  id: number;
  fechaCreacion: string; 
}


export interface ICalidadRequest {
  codigo: string;
  nombre: string;
  codigoMaterial: string;
  descripcion: string;
  activo: boolean;
  conforme: boolean;
}

export interface ICalidadResponse {
  id: number;
  codigo: string;
  nombre: string;
  codigoMaterial: string;
  descripcion: string;
  activo: boolean;
  conforme: boolean;
  fechaCreacion: string;
}

export interface PagedCalidadResponse {
  items: ICalidadResponse[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}
