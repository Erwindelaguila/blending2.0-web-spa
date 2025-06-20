export interface IGroup {
  grupo: number;
  nombre: string;
  toneladas: number;
  valorInicial: number;
  valorFinal: number;
  valorAgregado: number;
  costoTotal: number;
  calidadesUtil: string[];
  status?: boolean;
}
