export interface RequestHomogenizacion {
  stockFiltrado: StockFiltradoItem[];
  valoresParametros: ValorParametro[];
  planta: string;
  calidadObjetivo: string[];
  parametros: string[];
  incluirCadmio: boolean;
  cantidadRumas: number;
  divisionRumas: number;
}

export interface StockFiltradoItem {
  rumaNro: string;
  cantidad: number;
  parametros: Record<string, number>;
}

export interface ValorParametro {
  [codigoCalidad: string]: Record<string, number>; 
}