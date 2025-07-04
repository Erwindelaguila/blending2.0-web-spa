import { DrawerBase } from "@/components/ui/drawe-base";
import { AsyncActionDisplay } from "@/components/ui/async-action-display";
import { useAsyncAction } from "@/hooks/use-async-action";
import { useInputStyles } from "@/styles/input.styles";
import { PlantasService } from "@/services/plantas.service";
import { Input, Label, Switch, Textarea } from "@fluentui/react-components";
import { useCallback, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IDrawer } from "@/interface";

interface IPlantaForm {
  codigo: string;
  nombre: string;
  numero_rumas: string;
  descripcion: string;
  estado: boolean;
}

const defaultFormValues: IPlantaForm = {
  codigo: "",
  nombre: "",
  descripcion: "",
  estado: false,
  numero_rumas: "",
};

export function PanelCrearPlanta({ open, mode, id, close }: IDrawer) {
  const styles = useInputStyles();
  const [checked, setChecked] = useState(true);
  const asyncAction = useAsyncAction();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IPlantaForm>({
    defaultValues: { codigo: "", nombre: "", descripcion: "" },
  });

  const onChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(ev.currentTarget.checked);
  }, []);

  const onSubmit: SubmitHandler<IPlantaForm> = async (data) => {
    const plantaData = {
      codigo: Number(data.codigo),
      nombre: data.nombre,
      descripcion: data.descripcion,
      activo: checked,
    };

    /*
    await asyncAction.execute(async () => {
      await PlantasService.crear(plantaData);
    });
    */
  };

  const handleSuccess = () => {
    asyncAction.reset();
    reset();
    setChecked(true);
    setIsOpen(false);
  };

  const handleErrorDismiss = () => {
    asyncAction.reset();
  };

  const TITULOS_PANEL: Record<typeof mode, string> = {
    crear: "Nueva Calidad",
    editar: "Editar Calidad",
    detalle: "Detalle de Calidad",
  };

  const closeAcction = () => {
    reset(defaultFormValues);
    close();
    asyncAction.reset();
  };

  return (
    <DrawerBase
      open={open}
      close={closeAcction}
      title={TITULOS_PANEL[mode]}
      buttonAction={mode !== "detalle" ? handleSubmit(onSubmit) : undefined}
      BtnAccion={
        mode !== "detalle" && !asyncAction.isLoading && !asyncAction.isSuccess
      }
      btnDetails={mode === "detalle"}
      drawerTypeModal={mode !== "detalle"}
      position="end"
      zise="medium"
    >
      {asyncAction.state === "error" && (
        <AsyncActionDisplay
          state={asyncAction.state}
          loadingMessage=""
          successMessage=""
          error={asyncAction.error}
          onErrorDismiss={handleErrorDismiss}
        />
      )}
      {(asyncAction.isFromInit || asyncAction.error) && (
        <div className="py-2 flex flex-col gap-3">
          <div className="flex flex-col justify-start w-full gap-0.5">
            <Label required>Código</Label>
            <Input
              {...register("codigo", { required: "El código es requerido" })}
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
              {...register("nombre", { required: "El nombre es requerido" })}
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
            <Label>Estado</Label>
            <Switch
              checked={checked}
              onChange={onChange}
              label={checked ? "Activo" : "Inactivo"}
            />
          </div>
        </div>
      )}
      {(asyncAction.state === "loading" || asyncAction.state === "success") && (
        <AsyncActionDisplay
          state={asyncAction.state}
          loadingMessage="Creando nueva planta..."
          successMessage="Se creó correctamente la planta"
          onSuccess={handleSuccess}
        />
      )}
    </DrawerBase>
  );
}
