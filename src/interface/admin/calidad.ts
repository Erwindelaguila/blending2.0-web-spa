export interface ICalidadRequest {
  codigo: string;
  nombre: string;
  codigoMaterial: string | null;
  descripcion: string;
  activo: boolean;
  conforme: boolean; // UI field (maps to backend noConforme = !conforme)
}

export interface ICalidadSend extends ICalidadRequest { creadoPorId: string; }
export interface ICalidadUpdate extends ICalidadRequest { id: string; modificadoPorId: string; }

export interface ICalidadResponse {
  id: string;
  codigo: string;
  nombre: string;
  codigoMaterial: string | null;
  descripcion: string;
  activo: boolean;
  conforme: boolean; // normalized
  creadoEl?: string | null;
  modificadoEl?: string | null;
}

export interface PagedCalidadResponse {
  items: ICalidadResponse[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}
