type typeDialog = "alert" | "info";

export interface IModalBase {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  requiereAction?: boolean;
  buttonAction?: () => void;
  buttonText?: string;
  children?: React.ReactNode;
  type: typeDialog;
  closeOnOutsideClick?: boolean; // Nueva propiedad para controlar el cierre
}
