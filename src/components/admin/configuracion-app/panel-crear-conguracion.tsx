import { DrawerBase } from "@/components/ui/drawe-base";
import { OrgColors } from "@/config/app.config.server";
import { IDrawer } from "@/interface";
import { useInputStyles } from "@/styles/input.styles";
import { Input, Label, Switch, Textarea } from "@fluentui/react-components";
import { useCallback, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export function PanelCrearConfiguracionApp({ isOpen, setIsOpen }: IDrawer) {
  const styles = useInputStyles();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<IConfiguracion>({
    defaultValues: {
      codigo: "",
      valores: "",
      descripcion: "",
      nombre: "",
    },
  });

  const onSubmit: SubmitHandler<IConfiguracion> = async (data) => {
      console.log("Form data submitted:", data);
    };
  


  const sendData = () => {
    handleSubmit(onSubmit)();
  };

  const [checked, setChecked] = useState(true);
  const onChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setChecked(ev.currentTarget.checked);
    },
    [setChecked]
  );

  return (
    <>
      <DrawerBase
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Nuevo Parámetro del Sistema"
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
            <Label required>Descripción</Label>
            <Textarea
              {...register("descripcion")}
              size="large"
              className={styles.inputGrisBase}
              style={{
                height: "10rem",
              }}
            />
            {errors.descripcion && (
              <span className="text-red-500">{errors.descripcion.message}</span>
            )}
          </div>

          <div className="flex flex-col justify-start w-full gap-0.5">
            <Label required>Valores</Label>
            <Textarea
              {...register("valores", {
                required: {
                  value: true,
                  message: "El valores es requerido",
                },
              })}
              size="large"
              className={styles.inputGrisBase}
              style={{
                height: "10rem",
              }}
            />
            {errors.valores && (
              <span className="text-red-500">{errors.valores.message}</span>
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
      </DrawerBase>
    </>
  );
}

interface IConfiguracion {
  codigo: string;
  nombre: string;
  valores: string;
  descripcion: string;
}
