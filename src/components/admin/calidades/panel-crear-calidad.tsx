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

interface ICalidad {
  codigo: string;
  nombre: string;
  codigo_material: string;
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
      codigo_material: "",
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

  const simulateCreateCalidad = async (): Promise<void> => {
    // Simula llamada API para crear calidad
    await new Promise((resolve) => {
      setTimeout(() => resolve(void 0), 2000);
    });
  };

  const onSubmit: SubmitHandler<ICalidad> = async (data) => {
    console.log("Form data submitted:", data);
    await asyncAction.execute(simulateCreateCalidad);
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

  return (
    <>
      <DrawerBase
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Nueva Calidad"
        buttonAction={handleSubmit(onSubmit)}
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
                  required: {
                    value: true,
                    message: "El código es requerido",
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
                  required: {
                    value: true,
                    message: "El nombre es requerido",
                  },
                })}
                className={styles.inputGrisBase}
                style={{ border: `2px solid ${OrgColors.serotGris}` }}
              />
              {errors.nombre && (
                <span className="text-red-500">{errors.nombre.message}</span>
              )}
            </div>

            <div className="flex flex-col justify-start w-full gap-0.5">
              <Label required>Código de Material</Label>
              <Input
                {...register("codigo_material", {
                  required: {
                    value: true,
                    message: "El código de material es requerido",
                  },
                })}
                className={styles.inputGrisBase}
                style={{ border: `2px solid ${OrgColors.serotGris}` }}
              />
              {errors.codigo_material && (
                <span className="text-red-500">
                  {errors.codigo_material.message}
                </span>
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
