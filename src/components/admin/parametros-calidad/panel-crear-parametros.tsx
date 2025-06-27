import { DrawerBase } from "@/components/ui/drawe-base";
import { OrgColors } from "@/config/app.config.server";
import { IDrawer } from "@/interface";
import { useInputStyles } from "@/styles/input.styles";
import { Input, Label, Switch, Textarea } from "@fluentui/react-components";
import { useCallback, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export function PanelCrearParamentros({ isOpen, setIsOpen }: IDrawer) {
  const styles = useInputStyles();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<IParametros>({
    defaultValues: {
      codigo: "",
      descripcion: "",
      nombre: "",
    },
  });

  const onSubmit: SubmitHandler<IParametros> = async (data) => {
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
        title="Nuevo Parámetro"
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
                  message: "El codigo es requerido",
                },
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
              style={{
                height: "10rem",
              }}
            />

            {errors.nombre && (
              <span className="text-red-500">{errors.nombre.message}</span>
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

interface IParametros {
  codigo: string;
  nombre: string;
  codigo_material: string;
  descripcion: string;
}
