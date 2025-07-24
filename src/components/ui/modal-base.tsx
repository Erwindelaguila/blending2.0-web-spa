"use client";
import * as React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogActions,
  Button,
} from "@fluentui/react-components";
import { IModalBase } from "@/interface/components/modal";
import { useButtonsStyles } from "@/styles/button.styles";

export const ModalBase = ({
  open,
  setOpen,
  requiereAction = true,
  buttonText = "Accion",
  children,
  type = "info",
  closeOnOutsideClick = true, // Por defecto permite cerrar haciendo clic fuera
  buttonAction,
}: IModalBase) => {
  const style = useButtonsStyles();
  const renderTitle = () => {
    switch (type) {
      case "alert":
        return "Alerta";
      case "info":
        return "Informacion";
      default:
        return "Dialog Title";
    }
  };
  return (
    <Dialog 
      open={open} 
      onOpenChange={closeOnOutsideClick ? (event, data) => setOpen(data.open) : undefined}
    >
      <DialogSurface >
        <DialogBody>
          <DialogTitle>{renderTitle()}</DialogTitle>
          <DialogContent>{children}</DialogContent>
          <DialogActions>
            {requiereAction && (
              <>
                <Button size="medium" onClick={buttonAction} className={style.buttonShortRojoBase}>{buttonText}</Button>
                <Button 
                  appearance="secondary" 
                  onClick={() => setOpen(false)}
                >
                  Cancelar
                </Button>
              </>
            )}
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};
