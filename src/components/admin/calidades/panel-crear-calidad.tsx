import { DrawerBase } from "@/components/ui/drawe-base";
import { AsyncActionDisplay } from "@/components/ui/async-action-display";
import { useAsyncAction } from "@/hooks/use-async-action";
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
  const [checked, setChecked] = useState(true);
  const [checkedV1, setCheckedV1] = useState<CheckboxProps["checked"]>(true);
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    codigoMaterial: '',
    descripcion: '',
  });

  const asyncAction = useAsyncAction();

  const onChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setChecked(ev.currentTarget.checked);
    },
    [setChecked]
  );

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const simulateCreateCalidad = async (): Promise<void> => {
    // Simula llamada API para crear calidad
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(void 0);
      }, 2000);
    });
  };

  const handleSubmit = async () => {
    await asyncAction.execute(simulateCreateCalidad);
  };

  const handleClose = () => {
    asyncAction.reset();
    setFormData({ codigo: '', nombre: '', codigoMaterial: '', descripcion: '' });
    setChecked(true);
    setCheckedV1(true);
    setIsOpen(false);
  };

  const handleSuccess = () => {
    handleClose();
  };

  return (
    <>
      <DrawerBase
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Nueva Calidad"
        buttonAction={handleSubmit}
        position="end"
        zise="medium"
        BtnAccion={!asyncAction.isLoading && !asyncAction.isSuccess}
      >
        {/* Mostrar formulario solo si no está en estado de loading o success */}
        {asyncAction.state === 'idle' && (
          <div className="py-2 flex flex-col gap-3">
            <div className="flex flex-col justify-start w-full gap-0.5">
              <Label required>Codigo</Label>
              <Input
                value={formData.codigo}
                onChange={(_, data) => handleInputChange('codigo', data.value)}
                style={{
                  width: "100%",
                  border: ` 2px solid ${OrgColors.serotGris}`,
                }}
              />
            </div>

            <div className="flex flex-col justify-start w-full gap-0.5">
              <Label required>Nombre</Label>
              <Input
                value={formData.nombre}
                onChange={(_, data) => handleInputChange('nombre', data.value)}
                style={{
                  width: "100%",
                  border: ` 2px solid ${OrgColors.serotGris}`,
                }}
              />
            </div>

            <div className="flex flex-col justify-start w-full gap-0.5">
              <Label required>Código de Material</Label>
              <Input
                value={formData.codigoMaterial}
                onChange={(_, data) => handleInputChange('codigoMaterial', data.value)}
                style={{
                  width: "100%",
                  border: ` 2px solid ${OrgColors.serotGris}`,
                }}
              />
            </div>

            <div className="flex flex-col justify-start w-full gap-0.5">
              <Label>Descripción</Label>
              <Textarea
                value={formData.descripcion}
                onChange={(_, data) => handleInputChange('descripcion', data.value)}
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
                checked={checkedV1}
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
        )}

        {/* Componente reutilizable para manejar estados async */}
        <AsyncActionDisplay
          state={asyncAction.state}
          loadingMessage="Creando nueva calidad..."
          successMessage="Se creó correctamente la calidad"
          onSuccess={handleSuccess}
        />
      </DrawerBase>
    </>
  );
}
