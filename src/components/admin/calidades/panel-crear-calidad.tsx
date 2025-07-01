import { DrawerBase } from "@/components/ui/drawe-base";
import { AsyncActionDisplay } from "@/components/ui/async-action-display";
import { useAsyncAction } from "@/hooks/use-async-action";
import { OrgColors } from "@/config/app.config.server";
import { IDrawer } from "@/interface";
import { useInputStyles } from "@/styles/input.styles";
import {
  Checkbox,
  Input,
  Label,
  Switch,
  Textarea,
} from "@fluentui/react-components";
import { useCallback, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { CalidadesService } from "@/services/calidades.service";
import type { ICalidadResponse } from "@/services/calidades.service";

/**
 * Interfaz para los datos del formulario de calidad
 */
interface ICalidad {
  codigo: string;
  nombre: string;
  codigoMaterial: string;
  descripcion: string;
  conforme: boolean;
  activo: boolean;
}

/**
 * Props del componente PanelCrearCalidad
 */
interface IPanelCrearCalidadProps extends IDrawer {
  /** Calidad a editar (null para modo creación) */
  calidadAEditar?: ICalidadResponse | null;
  /** Callback ejecutado al cerrar el panel */
  onClose?: () => void;
}

/**
 * Valores por defecto del formulario
 */
const defaultFormValues: ICalidad = {
  codigo: "",
  nombre: "",
  codigoMaterial: "",
  descripcion: "",
  conforme: true,
  activo: true,
};

/**
 * Componente para crear o editar una calidad
 * 
 * Este componente maneja tanto la creación de nuevas calidades como la edición de existentes.
 * @param props - Props del componente
 * @returns 
 */
export function PanelCrearCalidad({
  isOpen,
  setIsOpen,
  calidadAEditar,
  onClose,
}: IPanelCrearCalidadProps) {
  const styles = useInputStyles();
  const asyncAction = useAsyncAction();

  // Configuración del formulario con react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ICalidad>({
    defaultValues: defaultFormValues,
  });

  // Observar valores para componentes controlados
  const watchedConforme = watch("conforme");
  const watchedActivo = watch("activo");

 
  useEffect(() => {
    if (isOpen) {
      if (calidadAEditar) {
        // Modo edición: llenar formulario con datos existentes
        const formData: ICalidad = {
          codigo: calidadAEditar.codigo ?? "",
          nombre: calidadAEditar.nombre ?? "",
          codigoMaterial: calidadAEditar.codigoMaterial ?? "",
          descripcion: calidadAEditar.descripcion ?? "",
          conforme: !!calidadAEditar.conforme,
          activo: !!calidadAEditar.activo,
        };
        reset(formData);
      } else {
        // Modo creación: valores por defecto
        reset(defaultFormValues);
      }
    }
  }, [isOpen, calidadAEditar, reset]);

  // Manejador para el switch de estado activo
  const handleActiveChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setValue("activo", ev.currentTarget.checked, { shouldDirty: true });
    },
    [setValue]
  );

  // Manejador para el checkbox de conforme
  const handleConformeChange = useCallback(
    (ev: any, data: any) => {
      setValue("conforme", data.checked, { shouldDirty: true });
    },
    [setValue]
  );

  // Manejador de envío del formulario
  const onSubmit: SubmitHandler<ICalidad> = async (data) => {
    await asyncAction.execute(async () => {
      if (calidadAEditar) {
        await CalidadesService.editar(calidadAEditar.id, data);
      } else {
        await CalidadesService.crear(data);
      }
    });
  };

  // Función para cerrar el modal y resetear el formulario
  const handleClose = () => {
    asyncAction.reset();
    reset(defaultFormValues);
    setIsOpen(false);
    onClose?.();
  };

  // Función para manejar el éxito y cerrar el modal
  const handleSuccess = () => {
    handleClose();
  };

  // Función para limpiar errores
  const handleErrorDismiss = () => {
    asyncAction.reset();
  };

  return (
    <DrawerBase
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={calidadAEditar ? "Editar Calidad" : "Nueva Calidad"}
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
                required: "El código es requerido",
              })}
              className={styles.inputGrisBase}
              style={{ border: `2px solid ${OrgColors.serotGris}` }}
              defaultValue={calidadAEditar?.codigo ?? ""}
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
              style={{ border: `2px solid ${OrgColors.serotGris}` }}
              defaultValue={calidadAEditar?.nombre ?? ""}
            />
            {errors.nombre && asyncAction.state !== "error" && (
              <span className="text-red-500">{errors.nombre.message}</span>
            )}
          </div>

          <div className="flex flex-col justify-start w-full gap-0.5">
            <Label required>Código de Material</Label>
            <Input
              {...register("codigoMaterial", {
                required: "El código de material es requerido",
              })}
              className={styles.inputGrisBase}
              style={{ border: `2px solid ${OrgColors.serotGris}` }}
              defaultValue={calidadAEditar?.codigoMaterial ?? ""}
            />
            {errors.codigoMaterial && asyncAction.state !== "error" && (
              <span className="text-red-500">{errors.codigoMaterial.message}</span>
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
              defaultValue={calidadAEditar?.descripcion ?? ""}
            />
            {errors.descripcion && asyncAction.state !== "error" && (
              <span className="text-red-500">{errors.descripcion.message}</span>
            )}
          </div>

          <div className="flex flex-col justify-start w-full gap-0.5">
            <Checkbox
              size="large"
              checked={watchedConforme}
              onChange={handleConformeChange}
              label={watchedConforme ? "Conforme" : "No conforme"}
            />
          </div>

          <div className="flex flex-col justify-start w-full gap-0.5">
            <Label>Activo</Label>
            <Switch
              checked={watchedActivo}
              onChange={handleActiveChange}
              label={watchedActivo ? "Sí" : "No"}
            />
          </div>
        </div>
      )}

      {(asyncAction.state === "loading" || asyncAction.state === "success") && (
        <AsyncActionDisplay
          state={asyncAction.state}
          loadingMessage={calidadAEditar ? "Actualizando calidad..." : "Creando nueva calidad..."}
          successMessage={calidadAEditar ? "Se actualizó correctamente la calidad" : "Se creó correctamente la calidad"}
          onSuccess={handleSuccess}
          loadingType="progress"
        />
      )}
    </DrawerBase>
  );
}