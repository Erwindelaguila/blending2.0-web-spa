export interface IPlantaRequest {
  codigo: string;
  nombre: string;
  descripcion: string;
  numeroRuma: number;
  activo: boolean;
}

export interface IPlantaResponse {
  id: string; // UNIQUEIDENTIFIER en SQL Server
  codigo: string;
  nombre: string;
  descripcion: string;
  numeroRuma: number;
  activo: boolean;
  creadoEl: string; // DateTime generado por el backend
}

// Mantener IPlanta e IPlantaGet para compatibilidad
export interface IPlanta extends IPlantaRequest {}
export interface IPlantaGet extends IPlantaResponse {}
 