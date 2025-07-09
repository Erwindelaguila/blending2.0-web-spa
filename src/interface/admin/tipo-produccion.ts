import { IBaseProduccion } from "./produccion";

export interface ITipoProduccion extends IBaseProduccion {
  linea_produccion_id: string;
  agregado_id: string;
}
