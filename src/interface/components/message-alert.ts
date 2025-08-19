export interface ErrorAlertContent {
  descripcion: string;
  typeError: typeError;
}

type typeError = "info" | "warning" | "error" | "success";