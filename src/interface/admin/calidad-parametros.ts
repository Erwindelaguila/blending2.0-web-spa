// Interfaces para la matriz de calidad-parámetros

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
  valores: Record<string, IValorParametro>; // key = codigo del parámetro
}

export interface IMatrizCalidadParametros {
  parametros: IParametroMatriz[];
  calidades: ICalidadMatriz[];
}

// Para operaciones de upsert (crear/actualizar valor individual)
export interface ICalidadParametroUpsertRequest {
  calidadId: string;
  parametroId: string;
  valor: number;
}

// Para operaciones de upsert múltiple (array de cambios)
export interface ICalidadParametroUpsertBatchRequest {
  cambios: ICalidadParametroUpsertRequest[];
  modificadoPorId?: string; // Se inyectará automáticamente
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
