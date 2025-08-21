"use client";

import { ReactNode } from "react";

type ziseDrawer = "small" | "medium" | "large" | "full";
type positionDrawer = "start" | "end" | "bottom";

export interface IDrawerBase {
  open: boolean;
  close: () => void;
  title: string;
  children: ReactNode;
  buttonAction?: () => void;
  buttonText?: string;
  zise?: ziseDrawer;
  position?: positionDrawer;
  BtnAccion?: boolean;
  drawerTypeModal: boolean;
  btnDetails?: boolean;
}

type mode = "crear" | "editar" | "detalle";

export interface IDrawer {
  open: boolean;
  close: () => void;
  mode: mode;
  id?: string;
  onSuccess?: (item: any, mode: mode) => void; // ahora retorna el item creado/actualizado y el modo
}
