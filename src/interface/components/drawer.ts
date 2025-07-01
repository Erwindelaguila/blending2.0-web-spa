"use client";

import { ReactNode } from "react";

type ziseDrawer = "small" | "medium" | "large" | "full";
type positionDrawer = "start" | "end" | "bottom";

type draweType = "alert" | "modal" | "non-modal";

export interface IDrawerBase {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  children: ReactNode;
  buttonAction?: () => void;
  buttonText?: string;
  zise?: ziseDrawer;
  position?: positionDrawer;
  BtnAccion?: boolean;
  drawerType: draweType;
  isButtonScape?: boolean;
}

export interface IDrawer {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  drawerType: draweType;
}

