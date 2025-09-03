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
  width?: string;
}

export type DynamicRow = {
  [key: string]: string | number;
};

export interface ITableDynamicProps {
  data: DynamicRow[];
  firstColKey?: string;
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
  dataOriginal?: DynamicRow[];
  numericValidation?: {
    enabled: boolean;
    mode?: 'integer' | 'decimal' | 'auto';
    integerMaxDigits?: number;
    decimalIntegerMaxDigits?: number;
    decimalDigits?: number;
    padOnBlur?: boolean;
    allowLeadingDot?: boolean;
    columns?: string[]; 
  };
}

export interface RowData {
  contenedores: string;
  sacos: string;
}

export interface TablaContenedoresProps {
  onChange?: (data: RowData[], isError: boolean) => void;
}
