import { DrawerBase } from "@/components/ui/drawe-base";
import { OrgColors } from "@/config/app.config.server";
import { IDrawer } from "@/interface";
import {
  Checkbox,
  CheckboxProps,
  Input,
  Label,
  Switch,
  Textarea,
} from "@fluentui/react-components";
import { useCallback, useState } from "react";

export function PanelCrearCalidad({ isOpen, setIsOpen }: IDrawer) {
  const sendData = () => {};

  const [checked, setChecked] = useState(true);
  const onChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setChecked(ev.currentTarget.checked);
    },
    [setChecked]
  );

  const [checkedV1, setCheckedV1] = useState<CheckboxProps["checked"]>(true);

  return (
    <>
      <DrawerBase
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Nueva Calidad"
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
            <Label required>Código de Material</Label>
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
            <Checkbox
              size="large"
              checked={checked}
              onChange={(ev, data) => setCheckedV1(data.checked)}
              label={checkedV1 ? "Conforme" : "No conforme"}
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
