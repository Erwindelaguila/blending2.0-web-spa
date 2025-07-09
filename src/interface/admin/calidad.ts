import { IBaseProduccion } from "./produccion";

export interface ICalidad extends IBaseProduccion {
  codigoMaterial: string;
  conforme: boolean;
}

export interface ICalidadGet extends ICalidad {
  id: number;
  fechaCreacion: string; 
}
