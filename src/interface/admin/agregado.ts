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