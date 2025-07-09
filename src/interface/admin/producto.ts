import { IBaseProduccion } from "./produccion";

export interface IProducto extends IBaseProduccion {
  calidad_id: string;
  tipo_produccion_id: string;
}
