// Representa un diccionario dinámico de parámetros de calidad (clave -> valor numérico)
export interface Parametros {
  [codigoParametro: string]: number;
}

// Sección "demanda"
export interface IDemanda {
  cantidad: number;
  parametros: Parametros;
}

// Sección "oferta"
export interface IOferta {
  lote: string;
  cantidadAsignada: number;
  descripcionCentro: string;
  ubicacionAlmacen: string;
  emparejamiento: string;
  parametros: Parametros;
}

export interface IOfertaSacos {
  [lote: string]: string;
}

export interface ICapacidades {
  cantidad: number;
  capacidad: number;
}

export interface IParticiones {
  [lote: string]: string | number;
}

// Objeto raíz completo
export interface DataAsignacion {
  demanda: IDemanda;
  oferta: IOferta[];
  contenedores: string[];
  parametrosSeleccionados: string[];
  indiceOferta: string[];
  ofertaSacos: IOfertaSacos;
  capacidades: ICapacidades[];
  particiones: IParticiones;
  pesoContenedor: number
  emparejamientos: IEmparejamientos;
  tiempoEspera: number;
}

export interface IEmparejamientos {
  [grupo: string]: {
    [codigoParametro: string]: number;
  };
}
