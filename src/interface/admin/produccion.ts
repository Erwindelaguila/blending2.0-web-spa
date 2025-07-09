import { TabProps, TabValue } from "@fluentui/react-components";
import { ReactNode } from "react";

export interface ITabConfigProduccion {
  id: string;
  value: TabValue;
  label: string;
  icon: TabProps["icon"];
  content: ReactNode;
}


export interface IBaseProduccion {
  codigo: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
}
