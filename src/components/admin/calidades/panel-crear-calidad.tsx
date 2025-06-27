import { DrawerBase } from "@/components/ui/drawe-base";
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
import { useCallback, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export function PanelCrearCalidad({ isOpen, setIsOpen }: IDrawer) {
  const styles = useInputStyles();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
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
  const onChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setChecked(ev.currentTarget.checked);
    },
    [setChecked]
  );

  const [checkedV1, setCheckedV1] = useState<CheckboxProps["checked"]>(true);

  const onSubmit: SubmitHandler<ICalidad> = async (data) => {
    console.log("Form data submitted:", data);
  };

  const sendData = () => {
    handleSubmit(onSubmit)();
  };

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
              {...register("codigo", {
                required: {
                  value: true,
                  message: "El codigo es requerido",
                },
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
                required: {
                  value: true,
                  message: "El nombre es requerido",
                },
              })}
              className={styles.inputGrisBase}
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
                  message: "El codigo de material es requerido",
                },
              })}
              className={styles.inputGrisBase}
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
              style={{ height: "10rem" }}
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
      </DrawerBase>
    </>
  );
}

interface ICalidad {
  codigo: string;
  nombre: string;
  codigo_material: string;
  descripcion: string;
}
