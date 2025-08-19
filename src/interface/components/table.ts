type Column = {
  uid: string;
  name: string;
  width?: number;
};

type Data = { [key: string]: any };

export interface ITableBase {
  data: Data[];
  columns: Column[];
  renderCell?: (item: Data, columnKey: string) => React.ReactNode;
  isLoading: boolean;
  error: any;
  height?: string;
}

export type DynamicRow = {
  [key: string]: string | number;
};

export interface ITableDynamicProps {
  data: DynamicRow[];
  firstColKey?: string; // 🔹 Aquí defines cómo se llama la primera columna (antes era fijo "calidad")
  titleFirstCol?: string;
  editable?: boolean;
  onDataChange?: (data: DynamicRow[]) => void;
  widthFull?: boolean;
  height?: string;
  paintRowCol?: boolean;
  uppercaseTitle?: boolean;
  width?: string;
  isStickyFirstCol?: boolean;
  isChangeBold?: boolean;
  ///
  dataOriginal?: DynamicRow[];
}

export interface RowData {
  contenedores: string;
  sacos: string;
}

export interface TablaContenedoresProps {
  onChange?: (data: RowData[], isError: boolean) => void;
}
