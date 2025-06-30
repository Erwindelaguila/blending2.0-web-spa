import { DrawerBase } from "@/components/ui/drawe-base";
import { AsyncActionDisplay } from "@/components/ui/async-action-display";
import { useAsyncAction } from "@/hooks/use-async-action";
import { OrgColors } from "@/config/app.config.server";
import { IDrawer } from "@/interface";
import { useInputStyles } from "@/styles/input.styles";
import {
  Checkbox,
  CheckboxProps,
  Input,
  Label,
  Switch,
  Textarea,
} from "@fluentui/react-components";
import { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { CalidadesService } from "@/services/calidades.service";

interface ICalidad {
  codigo: string;
  nombre: string;
  descripcion: string;
}

export function PanelCrearCalidad({ isOpen, setIsOpen }: IDrawer) {
  const styles = useInputStyles();
  const asyncAction = useAsyncAction();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ICalidad>({
    defaultValues: {
      codigo: "",
      descripcion: "",
      nombre: "",
    },
  });

  const [checked, setChecked] = useState(true);
  const [checkedV1, setCheckedV1] = useState<CheckboxProps["checked"]>(true);

  const onChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setChecked(ev.currentTarget.checked);
    },
    [setChecked]
  );

  const onSubmit: SubmitHandler<ICalidad> = async (data) => {
    const calidadData = {
      codigo: Number(data.codigo),
      nombre: data.nombre,
      descripcion: data.descripcion,
      activo: checked,
    };
    await asyncAction.execute(async () => {
      await CalidadesService.crear(calidadData);
    });
  };

  const handleClose = () => {
    asyncAction.reset();
    reset();
    setChecked(true);
    setCheckedV1(true);
    setIsOpen(false);
  };

  const handleSuccess = () => {
    handleClose();
  };

  const handleErrorDismiss = () => {
    asyncAction.reset();
  };

  return (
    <DrawerBase
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Nueva Calidad"
      buttonAction={handleSubmit(onSubmit)}
      position="end"
      BtnAccion={!asyncAction.isLoading && !asyncAction.isSuccess}
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
      {(asyncAction.state === "idle" || asyncAction.state === "error") && (
        <div className="py-2 flex flex-col gap-3">
          <div className="flex flex-col justify-start w-full gap-0.5">
            <Label required>Código</Label>
            <Input
              {...register("codigo", {
                required: {
                  value: true,
                  message: "El código es requerido",
                },
              })}
              className={styles.inputGrisBase}
              style={{ border: `2px solid ${OrgColors.serotGris}` }}
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
                required: {
                  value: true,
                  message: "El nombre es requerido",
                },
              })}
              className={styles.inputGrisBase}
              style={{ border: `2px solid ${OrgColors.serotGris}` }}
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
              style={{
                height: "10rem",
                border: `2px solid ${OrgColors.serotGris}`,
              }}
            />
            {errors.descripcion && asyncAction.state !== "error" && (
              <span className="text-red-500">{errors.descripcion.message}</span>
            )}
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
      {(asyncAction.state === "loading" || asyncAction.state === "success") && (
        <AsyncActionDisplay
          state={asyncAction.state}
          loadingMessage="Creando nueva calidad..."
          successMessage="Se creó correctamente la calidad"
          onSuccess={handleSuccess}
        />
      )}
    </DrawerBase>
  );
}
