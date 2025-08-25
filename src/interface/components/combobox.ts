export interface IComboboxApp {
  options: string[];
  value: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  disabledOptions?: string[];
  label?: string;
  labelRequired: boolean;
  error?: string;
  size?: sizeCombobox;
  errorInput?: boolean;
  grayBorder?: boolean;
}

type sizeCombobox = "small" | "medium" | "large";