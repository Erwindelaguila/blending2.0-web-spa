import { DrawerBase } from "@/components/ui/drawe-base";
import { AsyncActionDisplay } from "@/components/ui/async-action-display";
import { useAsyncAction } from "@/hooks/use-async-action";
import { IDrawer } from "@/interface";
import { useInputStyles } from "@/styles/input.styles";
import { Input, Label, Switch, Textarea } from "@fluentui/react-components";
import { useCallback, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { ConfiguracionAppService } from '@/services/configuracion-app.service';

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
    const configuracionData = {
      codigo: Number(data.codigo),
      nombre: data.nombre,
      descripcion: data.descripcion,
      valores: data.valores,
      activo: checked,
    };
    await asyncAction.execute(async () => {
      await ConfiguracionAppService.crear(configuracionData);
    });
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
      {asyncAction.state === "error" && (
        <AsyncActionDisplay
          state={asyncAction.state}
          loadingMessage=""
          successMessage=""
          error={asyncAction.error}
          onErrorDismiss={asyncAction.reset}
        />
      )}
      {(asyncAction.state === "idle" || asyncAction.state === "error") && (
        <div className="py-2 flex flex-col gap-3">
          <div className="flex flex-col justify-start w-full gap-0.5">
            <Label required>Código</Label>
            <Input
              {...register("codigo", {
                required: "El código es requerido",
              })}
              className={styles.inputGrisBase}
              placeholder="Ej: 123 o abc (para probar errores)"
            />
            {errors.codigo && asyncAction.state !== "error" && (
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
            {errors.nombre && asyncAction.state !== "error" && (
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
            {errors.descripcion && asyncAction.state !== "error" && (
              <span className="text-red-500">{errors.descripcion.message}</span>
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
            {errors.valores && asyncAction.state !== "error" && (
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
      {(asyncAction.state === "loading" || asyncAction.state === "success") && (
        <AsyncActionDisplay
          state={asyncAction.state}
          loadingMessage="Creando parámetro del sistema..."
          successMessage="Se creó correctamente el parámetro del sistema"
          onSuccess={handleSuccess}
        />
      )}
    </DrawerBase>
  );
}
