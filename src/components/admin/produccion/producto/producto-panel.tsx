import { DrawerBase } from "@/components/ui/drawe-base";
import { AsyncActionDisplay } from "@/components/ui/async-action-display";
import { useAsyncAction } from "@/hooks/use-async-action";
import { OrgColors } from "@/config/app.config.server";
import { ICalidad, ICalidadGet, IDrawer, IProducto } from "@/interface";
import { useInputStyles } from "@/styles/input.styles";
import {
  Checkbox,
  Input,
  Label,
  Spinner,
  Switch,
  Textarea,
} from "@fluentui/react-components";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { CalidadesService } from "@/services/calidades.service";
import useSWR from "swr";
import { CalidadFechApi } from "@/services/calidad-service-api";
import { useEffect } from "react";
import {
  fetchGetCalidadesId,
  getAllCalidadKey,
} from "@/lib/constants/key-fetch";
import { AppCombobox } from "@/components/ui/app-combobox";

const defaultFormValues: ICalidad = {
  codigo: "",
  nombre: "",
  codigoMaterial: "",
  descripcion: "",
  conforme: false,
  activo: true,
};

export function ProductoPanel({ open, mode, id, close }: IDrawer) {
  const styles = useInputStyles();
  const asyncAction = useAsyncAction();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<IProducto>({
    defaultValues: defaultFormValues,
  });

  const {
    data: dataCalidad,
    isLoading: loadingCalidad,
    error: errorCalidad,
  } = useSWR<ICalidadGet>(
    id != undefined ? fetchGetCalidadesId(id) : null,
    CalidadFechApi,
    {
      revalidateOnFocus: false,
      revalidateIfStale: true,
    }
  );

  const onSubmit: SubmitHandler<IProducto> = async (data) => {
    /*
    await asyncAction.execute(
      async () =>
        id ? CalidadesService.editar(id, data) : CalidadesService.crear(data),
      getAllCalidadKey()
    );
    */
  };

  const closeAcction = () => {
    reset(defaultFormValues);
    close();
    asyncAction.reset();
  };

  useEffect(() => {
    if (mode !== "crear" && dataCalidad) {
      reset(dataCalidad);
    } else if (mode === "crear" && open) {
      reset(defaultFormValues);
    }
  }, [dataCalidad, reset, mode, open]);

  const TITULOS_PANEL: Record<typeof mode, string> = {
    crear: "Nuevo Producto",
    editar: "Editar Producto",
    detalle: "Detalle de Producto",
  };

  const comboOptions = ["Cat", "Dog", "Ferret", "Fish", "Hamster", "Snake"];

  const renderContenidoSegunModo = () => {
    const values = watch();

    if (loadingCalidad) {
      return (
        <div className="py-2">
          <Spinner labelPosition="above" label="Cargando datos" />
        </div>
      );
    }

    if (errorCalidad) {
      return (
        <div className="py-2 text-red-500">
          Ocurrió un error al traer los datos.
        </div>
      );
    }

    if (mode === "detalle") {
      return (
        <div className="py-2 flex flex-col gap-3">
          <div>
            <Label>Código</Label>
            <p>{values.codigo}</p>
          </div>
          <div>
            <Label>Nombre</Label>
            <p>{values.nombre}</p>
          </div>
        </div>
      );
    }

    // Crear y editar
    return (
      <div className="py-2 flex flex-col gap-3">
        <div className="flex flex-col justify-start w-full gap-0.5">
          <Label required>Código</Label>
          <Controller
            name="codigo"
            control={control}
            rules={{ required: "El código es requerido" }}
            render={({ field }) => (
              <Input
                {...field}
                className={styles.inputGrisBase}
                style={{ border: `2px solid ${OrgColors.serotGris}` }}
              />
            )}
          />
          {errors.codigo && (
            <span className="text-red-500">{errors.codigo.message}</span>
          )}
        </div>

        <div className="flex flex-col justify-start w-full gap-0.5">
          <Label required>Nombre</Label>
          <Controller
            name="nombre"
            control={control}
            rules={{ required: "El nombre es requerido" }}
            render={({ field }) => (
              <Input
                {...field}
                className={styles.inputGrisBase}
                style={{ border: `2px solid ${OrgColors.serotGris}` }}
              />
            )}
          />

          {errors.nombre && (
            <span className="text-red-500">{errors.nombre.message}</span>
          )}
        </div>

        <div className="flex flex-col justify-start w-full gap-0.5">
          <Controller
            name="calidad_id"
            control={control}
            rules={{ required: "Seleccione una planta" }}
            render={({ field }) => (
              <AppCombobox
                label="Calidades"
                labelRequired={true}
                size="medium"
                options={comboOptions}
                value={field.value}
                grayBorder
                onChange={field.onChange}
                error={errors.calidad_id?.message}
              />
            )}
          />
        </div>

        <div className="flex flex-col justify-start w-full gap-0.5">
          <Controller
            name="calidad_id"
            control={control}
            rules={{ required: "Seleccione una planta" }}
            render={({ field }) => (
              <AppCombobox
                label="Tipo de produccion"
                labelRequired={true}
                size="medium"
                grayBorder
                options={comboOptions}
                value={field.value}
                onChange={field.onChange}
                error={errors.calidad_id?.message}
              />
            )}
          />
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
          <Controller
            name="activo"
            control={control}
            render={({ field }) => (
              <Switch
                checked={field.value}
                onChange={(e) => field.onChange(e.currentTarget.checked)}
                label={field.value ? "Activo" : "Inactivo"}
              />
            )}
          />
        </div>
      </div>
    );
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
      {mode !== "detalle" && asyncAction.isError && (
        <AsyncActionDisplay
          state={asyncAction.state}
          loadingMessage=""
          successMessage=""
          error={asyncAction.error}
          onErrorDismiss={() => asyncAction.resetError()}
        />
      )}

      {(mode === "detalle" || asyncAction.isFromInit || asyncAction.error) &&
        renderContenidoSegunModo()}

      {mode !== "detalle" &&
        (asyncAction.isLoading || asyncAction.isSuccess) && (
          <AsyncActionDisplay
            state={asyncAction.state}
            loadingMessage={
              id ? "Actualizando producto..." : "Creando nueva producto..."
            }
            successMessage={
              id
                ? asyncAction.response?.message ??
                  "Se actualizó correctamente el producto"
                : asyncAction.response?.message ??
                  "Se creó correctamente la producto"
            }
            onSuccess={() => {
              closeAcction();
            }}
            loadingType="progress"
          />
        )}
    </DrawerBase>
  );
}
