
export interface IParametroMatriz {
  id: string;
  codigo: string;
}

export interface IValorParametro {
  valor: number;
  esDefault: boolean;
}

export interface ICalidadMatriz {
  id: string;
  codigo: string;
  valores: Record<string, IValorParametro>;
}

export interface IMatrizCalidadParametros {
  parametros: IParametroMatriz[];
  calidades: ICalidadMatriz[];
}

export interface ICalidadParametroUpsertRequest {
  calidadId: string;
  parametroId: string;
  valor: number;
}

export interface ICalidadParametroUpsertBatchRequest {
  cambios: ICalidadParametroUpsertRequest[];
  modificadoPorId?: string; 
}

export interface ICalidadParametroUpsertBatchResponse {
  processedCount: number;
}

export interface ICalidadParametroUpsertResponse {
  id: string;
  calidadId: string;
  parametroId: string;
  valor: number;
  creadoPorId: string;
  creadoEl: string;
  modificadoPorId?: string;
  modificadoEl?: string;
}
