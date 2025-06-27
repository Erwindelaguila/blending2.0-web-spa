import { DrawerBase } from "@/components/ui/drawe-base";
import { OrgColors } from "@/config/app.config.server";
import { IDrawer } from "@/interface";
import { useInputStyles } from "@/styles/input.styles";
import {
  Button,
  Field,
  Input,
  Label,
  ProgressBar,
  Switch,
  Textarea,
} from "@fluentui/react-components";
import { useCallback, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export function PanelCrearPlantas({ isOpen, setIsOpen }: IDrawer) {
  const styles = useInputStyles();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<IPlantas>({
    defaultValues: {
      codigo: "",
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

  const [level, setLevel] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(true); //redux

  const onSubmit: SubmitHandler<IPlantas> = async (data) => {
    console.log("Form data submitted:", data);
  };

  const sendData = () => {
    setIsLoading(false);
    setLevel(1);

    handleSubmit(onSubmit)();

    setTimeout(() => {
      setLevel(2);
    }, 2000);
  };

  return (
    <>
      <DrawerBase
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Nueva Planta de Homogenización"
        buttonAction={sendData}
        position="end"
        zise="medium"
        BtnAccion={isLoading}
      >
        <>
          {level === 0 && (
            <>
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
                    <span className="text-red-500">
                      {errors.codigo.message}
                    </span>
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
                    <span className="text-red-500">
                      {errors.nombre.message}
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
                    }}
                  />
                  {errors.descripcion && (
                    <span className="text-red-500">
                      {errors.descripcion.message}
                    </span>
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
            </>
          )}
          {level === 1 && (
            <>
              <Field
                validationMessage="Creando plantas de homogenizacion"
                validationState="none"
              >
                <ProgressBar />
              </Field>
            </>
          )}

          {level === 2 && (
            <>
              <div>Se creo correctamente la planta de homogenización</div>

              <Button
                onClick={() => {
                  setTimeout(() => {
                    setIsOpen(false);
                  }, 100); // Simula un pequeño delay para resetear el estado

                  setLevel(0);
                  setIsLoading(true);
                }}
              >
                Aceptar
              </Button>
            </>
          )}
        </>
      </DrawerBase>
    </>
  );
}

interface IPlantas {
  codigo: string;
  nombre: string;
  descripcion: string;
}
