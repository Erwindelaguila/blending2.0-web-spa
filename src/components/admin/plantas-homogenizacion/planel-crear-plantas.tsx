import { DrawerBase } from "@/components/ui/drawe-base";
import { AsyncActionDisplay } from "@/components/ui/async-action-display";
import { useAsyncAction } from "@/hooks/use-async-action";
import { OrgColors } from "@/config/app.config.server";
import { IDrawer } from "@/interface";
import { useInputStyles } from "@/styles/input.styles";
import { Input, Label, Switch, Textarea } from "@fluentui/react-components";
import { useCallback, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export function PanelCrearPlantas({ isOpen, setIsOpen }: IDrawer) {
  const styles = useInputStyles();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IPlantas>({
    defaultValues: {
      codigo: "",
      nombre: "",
      descripcion: "",
    },
  });

  const [checked, setChecked] = useState(true);
  const asyncAction = useAsyncAction();

  const onChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(ev.currentTarget.checked);
  }, []);

  const onSubmit: SubmitHandler<IPlantas> = async (data) => {
    console.log("Datos enviados:", data);

    await asyncAction.execute(() => simulateCreatePlanta(data));
  };

  const simulateCreatePlanta = async (data: IPlantas): Promise<void> => {
    console.log("Enviando planta:", {
      ...data,
      estado: checked ? "Activo" : "Inactivo",
    });
    await new Promise((resolve) => setTimeout(resolve, 2000));
  };

  const handleClose = () => {
    asyncAction.reset();
    reset();
    setChecked(true);
    setIsOpen(false);
  };

  const handleSuccess = () => {
    handleSubmit(onSubmit)();
  };

  return (
    <DrawerBase
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Nueva Planta de Homogenización"
      buttonAction={handleSuccess}
      position="end"
      zise="medium"
      BtnAccion={!asyncAction.isLoading && !asyncAction.isSuccess}
      drawerType="alert"
    >
      {asyncAction.state === "idle" && (
        <div className="py-2 flex flex-col gap-3">
          <div className="flex flex-col justify-start w-full gap-0.5">
            <Label required>Código</Label>
            <Input
              {...register("codigo", {
                required: "El código es requerido",
                pattern: {
                  value: /^\d+$/,
                  message: "El código debe contener solo números",
                },
              })}
              className={styles.inputGrisBase}
              style={{ border: `2px solid ${OrgColors.serotGris}` }}
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
              style={{ border: `2px solid ${OrgColors.serotGris}` }}
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
              style={{
                height: "10rem",
                border: `2px solid ${OrgColors.serotGris}`,
              }}
            />
            {errors.descripcion && (
              <span className="text-red-500">{errors.descripcion.message}</span>
            )}
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

      <AsyncActionDisplay
        state={asyncAction.state}
        loadingMessage="Creando planta de homogenización..."
        successMessage="Se creó correctamente la planta de homogenización"
        onSuccess={handleSuccess}
      />
    </DrawerBase>
  );
}

interface IPlantas {
  codigo: string;
  nombre: string;
  descripcion: string;
}
