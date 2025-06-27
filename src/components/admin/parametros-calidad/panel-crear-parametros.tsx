import { DrawerBase } from "@/components/ui/drawe-base";
import { AsyncActionDisplay } from "@/components/ui/async-action-display";
import { useAsyncAction } from "@/hooks/use-async-action";
import { IDrawer } from "@/interface";
import { useInputStyles } from "@/styles/input.styles";
import { Input, Label, Switch, Textarea } from "@fluentui/react-components";
import { useCallback, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export function PanelCrearParametros({ isOpen, setIsOpen }: IDrawer) {
  const styles = useInputStyles();
  const [checked, setChecked] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IParametros>({
    defaultValues: {
      codigo: "",
      nombre: "",
      descripcion: "",
    },
  });

  const asyncAction = useAsyncAction();

  const onChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(ev.currentTarget.checked);
  }, []);

  const onSubmit: SubmitHandler<IParametros> = async (data) => {
    await asyncAction.execute(() => simulateCreateParametro(data));
  };

  const simulateCreateParametro = async (data: IParametros): Promise<void> => {
    console.log("Formulario enviado:", data);
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

  return (
    <DrawerBase
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Nuevo Parámetro"
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
        loadingMessage="Creando nuevo parámetro..."
        successMessage="Se creó correctamente el parámetro"
        onSuccess={handleSuccess}
      />
    </DrawerBase>
  );
}

interface IParametros {
  codigo: string;
  nombre: string;
  descripcion: string;
}
