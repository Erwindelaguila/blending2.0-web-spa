import { IBaseProduccion } from "./produccion";

export interface ITipoProduccionSend extends ITipoProduccionRequest { creadoPorId: string; }
export interface ITipoProduccionUpdate extends ITipoProduccionRequest { id: string; modificadoPorId: string; }

export interface ITipoProduccion extends IBaseProduccion {
  linea_produccion_id: string;
  agregado_id: string;
}

export interface ITipoProduccionRequest {
  codigo: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  linea_produccion_id: string;
  agregado_id: string;
}

export interface ITipoProduccionResponse {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
  linea_produccion_id: string;
  agregado_id: string;
  fechaCreacion: string;
}

export interface PagedTipoProduccionResponse {
  items: ITipoProduccionResponse[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}
