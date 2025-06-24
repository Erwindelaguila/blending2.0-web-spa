import { DrawerBase } from "@/components/ui/drawe-base";
import { OrgColors } from "@/config/app.config.server";
import { IDrawer } from "@/interface";
import {
  Button,
  Field,
  Input,
  Label,
  ProgressBar,
  Switch,
  Textarea,
} from "@fluentui/react-components";
import { useCallback, useState } from "react";

export function PanelCrearPlantas({ isOpen, setIsOpen }: IDrawer) {
  const [checked, setChecked] = useState(true);
  const onChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setChecked(ev.currentTarget.checked);
    },
    [setChecked]
  );

  const [level, setLevel] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(true); //redux

  const sendData = () => {
    setIsLoading(false);
    setLevel(1);

    setTimeout(() => {
      setLevel(2);
    }, 2000);
  };

  const renderCamp = () => {
    return (
      <>
        <div className="py-2 flex flex-col gap-3">
          <div className="flex flex-col justify-start w-full gap-0.5">
            <Label required>Codigo</Label>
            <Input
              style={{
                width: "100%",
                border: ` 2px solid ${OrgColors.serotGris}`,
              }}
            />
          </div>

          <div className="flex flex-col justify-start w-full gap-0.5">
            <Label required>Nombre</Label>
            <Input
              style={{
                width: "100%",
                border: ` 2px solid ${OrgColors.serotGris}`,
              }}
            />
          </div>

          <div className="flex flex-col justify-start w-full gap-0.5">
            <Label>Descripción</Label>
            <Textarea
              size="large"
              style={{
                width: "100%",
                border: ` 2px solid ${OrgColors.serotGris}`,
                height: "10rem",
              }}
            />
          </div>

          <div className="flex flex-col justify-start w-full gap-0.5">
            <Label>Estado</Label>
            <Switch
              checked={checked}
              onChange={onChange}
              label={checked ? "Activo" : "Inactivo"}
            />
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <DrawerBase
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Nueva Planta de Homogenización"
        buttonAction={sendData}
        position="end"
        zise="medium"
        BtnAccion={isLoading}
      >
        <>
          {level === 0 && (
            <>
              <div className="py-2 flex flex-col gap-3">
                <div className="flex flex-col justify-start w-full gap-0.5">
                  <Label required>Codigo</Label>
                  <Input
                    style={{
                      width: "100%",
                      border: ` 2px solid ${OrgColors.serotGris}`,
                    }}
                  />
                </div>

                <div className="flex flex-col justify-start w-full gap-0.5">
                  <Label required>Nombre</Label>
                  <Input
                    style={{
                      width: "100%",
                      border: ` 2px solid ${OrgColors.serotGris}`,
                    }}
                  />
                </div>

                <div className="flex flex-col justify-start w-full gap-0.5">
                  <Label>Descripción</Label>
                  <Textarea
                    size="large"
                    style={{
                      width: "100%",
                      border: ` 2px solid ${OrgColors.serotGris}`,
                      height: "10rem",
                    }}
                  />
                </div>

                <div className="flex flex-col justify-start w-full gap-0.5">
                  <Label>Estado</Label>
                  <Switch
                    checked={checked}
                    onChange={onChange}
                    label={checked ? "Activo" : "Inactivo"}
                  />
                </div>
              </div>
            </>
          )}
          {level === 1 && (
            <>
              <Field
                validationMessage="Creando plantas de homogenizacion"
                validationState="none"
              >
                <ProgressBar />
              </Field>
            </>
          )}

          {level === 2 && (
            <>
              <div>Se creo correctamente la planta de homogenización</div>

              <Button
                onClick={() => {
                  setTimeout(() => {
                    setIsOpen(false);
                  }, 100); // Simula un pequeño delay para resetear el estado

                  setLevel(0);
                  setIsLoading(true);
                }}
              >
                Aceptar
              </Button>
            </>
          )}
        </>
      </DrawerBase>
    </>
  );
}
