import { DrawerBase } from "@/components/ui/drawe-base";
import { OrgColors } from "@/config/app.config.server";
import { IDrawer } from "@/interface";
import { Input, Label, Switch, Textarea } from "@fluentui/react-components";
import { useCallback, useState } from "react";

export function PanelCrearConfiguracionApp({ isOpen, setIsOpen }: IDrawer) {
  const sendData = () => {};

  const [checked, setChecked] = useState(true);
  const onChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setChecked(ev.currentTarget.checked);
    },
    [setChecked]
  );

  return (
    <>
      <DrawerBase
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Nuevo Parámetro del Sistema"
        buttonAction={sendData}
        position="end"
        zise="medium"
      >
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
            <Label required>Descripción</Label>
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
            <Label required>Valores</Label>
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
      </DrawerBase>
    </>
  );
}
