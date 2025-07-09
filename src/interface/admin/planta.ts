export interface IPlanta {
  codigo: string;
  nombre: string;
  descripcion: string;
  numeroRuma: number;
  activo: boolean;
}

export interface IPlantaGet extends IPlanta {
  id: number;
  fechaCreacion: string; // también puede ser Date si haces parsing
}
 