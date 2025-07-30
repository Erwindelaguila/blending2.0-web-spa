import { IBaseProduccion } from "./produccion";

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
