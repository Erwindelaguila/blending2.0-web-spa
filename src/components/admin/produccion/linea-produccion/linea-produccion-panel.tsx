"use client";
import { DrawerBase } from "@/components/ui/drawe-base";
import { AsyncActionDisplay } from "@/components/ui/async-action-display";
import { useAsyncAction } from "@/hooks/use-async-action";
import { useAuth } from "@/hooks/use-auth";
import { OrgColors } from "@/config/app.config.server";
import { BaseResponse, IDrawer } from "@/interface";
import { useInputStyles } from "@/styles/input.styles";
import {
  Input,
  Label,
  Switch,
  Textarea,
  Spinner,
} from "@fluentui/react-components";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import useSWR from "swr";
import { useEffect } from "react";
import { getByIdLineaProduccionKey } from "@/lib/constants/key-fetch";
import {
  ILineaProduccion,
  ILineaProduccionSend,
  ILineaProduccionUpdate,
} from "@/interface/admin/linea-produccion";
import { LineaProduccionService } from "@/services/linea-produccion.service";

const defaultFormValues: ILineaProduccionSend = {
  codigo: "",
  nombre: "",
  descripcion: "",
  activo: true,
  creadoPorId: "",
};

export function LineaProduccionPanel({
  open,
  mode,
  id,
  close,
  onSuccess,
}: IDrawer) {
  const styles = useInputStyles();
  const asyncAction = useAsyncAction();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<ILineaProduccionSend>({
    defaultValues: defaultFormValues,
  });

  const {
    data: dataLinea,
    isLoading: loadingLinea,
    error: errorLinea,
  } = useSWR<BaseResponse<ILineaProduccion>>(
    id != undefined ? getByIdLineaProduccionKey(id) : null,
    LineaProduccionService.obtenerPorId,
    { revalidateOnFocus: false, revalidateIfStale: true }
  );

  const onSubmit: SubmitHandler<ILineaProduccionSend> = async (data) => {
    if (!user?.id) return;
    const sendCreate: ILineaProduccionSend = { ...data, creadoPorId: user.id };
    const sendUpdate: ILineaProduccionUpdate = {
      ...data,
      id: id || "",
      modificadoPorId: user.id,
    };
    await asyncAction.execute(
      async () =>
        id
          ? LineaProduccionService.actualizar(sendUpdate)
          : LineaProduccionService.crear(sendCreate)
    );
  };

  const closeAction = () => {
    if (asyncAction.isSuccess && onSuccess && asyncAction.response?.data) {
      onSuccess(asyncAction.response.data as any, mode);
    }
    reset(defaultFormValues);
    close();
    asyncAction.reset();
  };

  useEffect(() => {
    if (mode !== "crear" && dataLinea?.data) {
      const { data } = dataLinea;
      reset({
        codigo: data.codigo,
        nombre: data.nombre,
        descripcion: data.descripcion,
        activo: data.activo,
        creadoPorId: user?.id || "",
      });
    } else if (mode === "crear" && open) {
      reset({ ...defaultFormValues, creadoPorId: user?.id || "" });
    }
  }, [dataLinea, reset, mode, open, user?.id]);

  const TITULOS_PANEL: Record<typeof mode, string> = {
    crear: "Nueva Línea de Producción",
    editar: "Editar Línea de Producción",
    detalle: "Detalle de Línea de Producción",
  };

  const renderContenidoSegunModo = () => {
    const values = watch();

    if (loadingLinea) {
      return (
        <div className="py-2">
          <Spinner labelPosition="above" label="Cargando datos" />
        </div>
      );
    }

    if (errorLinea) {
      return <div className="py-2 text-red-500">Error al cargar los datos.</div>;
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
          <div>
            <Label>Descripción</Label>
            <p>{values.descripcion || "-"}</p>
          </div>
          <div>
            <Label>Activo</Label>
            <p>{values.activo ? "Sí" : "No"}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="py-2 flex flex-col gap-3">
        <div className="flex flex-col gap-0.5">
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
        <div className="flex flex-col gap-0.5">
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
        <div className="flex flex-col gap-0.5">
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
        <div className="flex flex-col gap-0.5">
          <Label>Activo</Label>
          <Controller
            name="activo"
            control={control}
            render={({ field }) => (
              <Switch
                checked={field.value}
                onChange={(e) => field.onChange(e.currentTarget.checked)}
                label={field.value ? "Sí" : "No"}
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
      close={closeAction}
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
              id
                ? "Actualizando línea de producción..."
                : "Creando nueva línea de producción..."
            }
            successMessage={
              id
                ? asyncAction.response?.message ??
                  "Se actualizó correctamente"
                : asyncAction.response?.message ?? "Se creó correctamente"
            }
            onSuccess={() => {
              closeAction();
            }}
            loadingType="progress"
          />
        )}
    </DrawerBase>
  );
}
