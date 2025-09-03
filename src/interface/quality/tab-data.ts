export interface StockFiltradoItem {
  rumaNro: string;
  cantidad: number;
  parametros: Record<string, string>;
}

export interface ValorParametro {
  [codigoCalidad: string]: Record<string, number>;
}

export interface ITabData {
  stockFiltrado: StockFiltradoItem[];
  planta: string;
  incluirCadmio: boolean;
}

export interface ITabEjecucion {
  valoresParametros: ValorParametro[];
  calidadObjetivo: string[];
  parametros: string[];
  cantidadRumas: number;
  divisionRumas: number;
}

export interface RequestHomogenizacion extends ITabData, ITabEjecucion {}
export interface IPlantaDataShort {
  id: string;
  codigo: string;
  nombre: string;
}