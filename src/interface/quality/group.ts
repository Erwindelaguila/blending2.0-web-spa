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

export interface ICardGroups {
  group: IGroup;
  selected: number[];
  setSelect: React.Dispatch<React.SetStateAction<number[]>>;
  readOnly?: boolean;
}
