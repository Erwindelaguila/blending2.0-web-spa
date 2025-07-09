export interface ICalidad {
  codigo: string;
  nombre: string;
  codigoMaterial: string;
  descripcion: string;
  conforme: boolean;
  activo: boolean;
}

export interface ICalidadGet extends ICalidad {
  id: number;
  fechaCreacion: string; 
}
