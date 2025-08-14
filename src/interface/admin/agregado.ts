interface IAgregadoBase {
  codigo: string;
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

// Para envío de datos (crear/editar)
export interface IAgregadoSend extends IAgregadoBase {
  creadoPorId: string;
}

export interface IAgregadoUpdate extends IAgregadoBase {
  id: string;
  modificadoPorId: string;
}


// Para respuesta completa del backend
export interface IAgregado extends IAgregadoBase {
  id: string;
  activo: boolean; // aquí ya no es opcional, porque la respuesta lo tiene definido
  creadoPorId: string;
  creadoEl: string; // o Date
  modificadoPorId?: string;
  modificadoEl?: string;
}

// Interface para la respuesta paginada del backend (nueva estructura)
export interface PagedAgregadoResponse {
  data: IAgregado[]; // Los registros están en data
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
    hasPrevious: boolean;
    hasNext: boolean;
    previousPage: number | null;
    nextPage: number | null;
  };
}