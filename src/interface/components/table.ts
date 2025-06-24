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
