import { DrawerBase } from "@/components/ui/drawe-base";
import { AsyncActionDisplay } from "@/components/ui/async-action-display";
import { useAsyncAction } from "@/hooks/use-async-action";
import { OrgColors } from "@/config/app.config.server";
import { IDrawer } from "@/interface";
import { Input, Label, Switch, Textarea } from "@fluentui/react-components";
import { useCallback, useState } from "react";

export function PanelCrearConfiguracionApp({ isOpen, setIsOpen }: IDrawer) {
  const [checked, setChecked] = useState(true);
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    valores: '',
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

  const simulateCreateConfiguracion = async (): Promise<void> => {
    // Simula llamada API para crear configuración
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(void 0);
      }, 2000);
    });
  };

  const handleSubmit = async () => {
    await asyncAction.execute(simulateCreateConfiguracion);
  };

  const handleClose = () => {
    asyncAction.reset();
    setFormData({ codigo: '', nombre: '', descripcion: '', valores: '' });
    setChecked(true);
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
        title="Nuevo Parámetro del Sistema"
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
              <Label required>Descripción</Label>
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
              <Label required>Valores</Label>
              <Textarea
                value={formData.valores}
                onChange={(_, data) => handleInputChange('valores', data.value)}
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
        )}

        {/* Componente reutilizable para manejar estados async */}
        <AsyncActionDisplay
          state={asyncAction.state}
          loadingMessage="Creando parámetro del sistema..."
          successMessage="Se creó correctamente el parámetro del sistema"
          onSuccess={handleSuccess}
        />
      </DrawerBase>
    </>
  );
}
