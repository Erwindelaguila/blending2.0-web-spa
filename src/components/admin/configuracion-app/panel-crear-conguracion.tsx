import { DrawerBase } from "@/components/ui/drawe-base";
import { AsyncActionDisplay } from "@/components/ui/async-action-display";
import { useAsyncAction } from "@/hooks/use-async-action";
import { OrgColors } from "@/config/app.config.server";
import { IDrawer } from "@/interface";
import { useInputStyles } from "@/styles/input.styles";
import { Input, Label, Switch, Textarea } from "@fluentui/react-components";
import { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface IConfiguracion {
  codigo: string;
  nombre: string;
  valores: string;
  descripcion: string;
}

export function PanelCrearConfiguracionApp({ isOpen, setIsOpen }: IDrawer) {
  const styles = useInputStyles();
  const asyncAction = useAsyncAction();
  const [checked, setChecked] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IConfiguracion>({
    defaultValues: {
      codigo: "",
      nombre: "",
      descripcion: "",
      valores: "",
    },
  });

  const onSubmit: SubmitHandler<IConfiguracion> = async (data) => {
    console.log("Form data submitted:", { ...data, estado: checked });
    await asyncAction.execute(simulateCreateConfiguracion);
  };

  const simulateCreateConfiguracion = async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  };

  const handleClose = () => {
    asyncAction.reset();
    reset();
    setChecked(true);
    setIsOpen(false);
  };

  const handleSuccess = () => {
    handleClose();
  };

  const onChangeSwitch = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setChecked(ev.currentTarget.checked);
    },
    []
  );

  useEffect(() => {
    if (!isOpen) {
      reset();
      setChecked(true);
      asyncAction.reset();
    }
  }, [isOpen, reset, asyncAction]);

  return (
    <DrawerBase
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Nuevo Parámetro del Sistema"
      buttonAction={handleSubmit(onSubmit)}
      position="end"
      zise="medium"
      BtnAccion={!asyncAction.isLoading && !asyncAction.isSuccess}
    >
      {asyncAction.state === "idle" && (
        <div className="py-2 flex flex-col gap-3">
          <div className="flex flex-col justify-start w-full gap-0.5">
            <Label required>Código</Label>
            <Input
              {...register("codigo", {
                required: "El código es requerido",
              })}
              className={styles.inputGrisBase}
            />
            {errors.codigo && (
              <span className="text-red-500">{errors.codigo.message}</span>
            )}
          </div>

          <div className="flex flex-col justify-start w-full gap-0.5">
            <Label required>Nombre</Label>
            <Input
              {...register("nombre", {
                required: "El nombre es requerido",
              })}
              className={styles.inputGrisBase}
            />
            {errors.nombre && (
              <span className="text-red-500">{errors.nombre.message}</span>
            )}
          </div>

          <div className="flex flex-col justify-start w-full gap-0.5">
            <Label>Descripción</Label>
            <Textarea
              {...register("descripcion")}
              size="large"
              className={styles.inputGrisBase}
              style={{ height: "10rem" }}
            />
            {errors.descripcion && (
              <span className="text-red-500">
                {errors.descripcion.message}
              </span>
            )}
          </div>

          <div className="flex flex-col justify-start w-full gap-0.5">
            <Label required>Valores</Label>
            <Textarea
              {...register("valores", {
                required: "El campo valores es requerido",
              })}
              size="large"
              className={styles.inputGrisBase}
              style={{ height: "10rem" }}
            />
            {errors.valores && (
              <span className="text-red-500">{errors.valores.message}</span>
            )}
          </div>

          <div className="flex flex-col justify-start w-full gap-0.5">
            <Label>Estado</Label>
            <Switch
              checked={checked}
              onChange={onChangeSwitch}
              label={checked ? "Activo" : "Inactivo"}
            />
          </div>
        </div>
      )}

      <AsyncActionDisplay
        state={asyncAction.state}
        loadingMessage="Creando parámetro del sistema..."
        successMessage="Se creó correctamente el parámetro del sistema"
        onSuccess={handleSuccess}
      />
    </DrawerBase>
  );
}
