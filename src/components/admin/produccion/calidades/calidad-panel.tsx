import { DrawerBase } from "@/components/ui/drawe-base";
import { AsyncActionDisplay } from "@/components/ui/async-action-display";
import { useAsyncAction } from "@/hooks/use-async-action";
import { OrgColors } from "@/config/app.config.server";
import { IDrawer } from "@/interface/components/drawer";
import { useInputStyles } from "@/styles/input.styles";
import { Checkbox, Input, Label, Spinner, Switch, Textarea } from "@fluentui/react-components";
import { CalendarClock20Regular, Edit20Regular, Info20Regular } from "@fluentui/react-icons";
import { formatearFechaCompleta } from "@/utils/date";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import useSWR from "swr";
import { useEffect } from "react";
import { fetchGetCalidadesId } from "@/lib/constants/key-fetch";
import { CalidadesService } from "@/services/calidades.service";
import { useAuth } from "@/hooks/use-auth";
import { BaseResponse } from "@/interface";
import {
  ICalidadResponse,
  ICalidadSend,
  ICalidadUpdate,
} from "@/interface/admin/calidad";

const defaultFormValues: ICalidadSend = {
  codigo: "",
  nombre: "",
  codigoMaterial: "",
  descripcion: "",
  conforme: false,
  activo: true,
  creadoPorId: "",
};

export function CalidadPanel({ open, mode, id, close, onSuccess }: IDrawer) {
  const styles = useInputStyles();
  const asyncAction = useAsyncAction();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<ICalidadSend>({
    defaultValues: defaultFormValues,
  });

  const {
    data: dataCalidad,
    isLoading: loadingCalidad,
    error: errorCalidad,
  } = useSWR<BaseResponse<ICalidadResponse>>(
    id != undefined ? fetchGetCalidadesId(id) : null,
    CalidadesService.obtenerPorId,
    {
      revalidateOnFocus: false,
      revalidateIfStale: true,
    }
  );

  const onSubmit: SubmitHandler<ICalidadSend> = async (data) => {
    if (!user?.id) {
      console.error("Usuario no autenticado o sin ID");
      return;
    }
    const sendCreate: ICalidadSend = { ...data, creadoPorId: user.id };
  const sendUpdate: ICalidadUpdate = { ...data, id: id || "", modificadoPorId: user.id };

    await asyncAction.execute(
      async () =>
        id
          ? await CalidadesService.actualizar(sendUpdate)
          : await CalidadesService.crear(sendCreate)
    );
  };

  const closeAcction = () => {
    if (asyncAction.isSuccess && onSuccess && asyncAction.response?.data) {
      onSuccess(asyncAction.response.data as any, mode);
    }
    reset(defaultFormValues);
    close();
    asyncAction.reset();
  };

  useEffect(() => {
    if (mode !== "crear" && dataCalidad) {
      reset({ ...(dataCalidad.data as any), creadoPorId: "" });
    } else if (mode === "crear" && open) {
      reset(defaultFormValues);
    }
  }, [dataCalidad, reset, mode, open]);

  const TITULOS_PANEL: Record<typeof mode, string> = {
    crear: "Nueva Calidad",
    editar: "Editar Calidad",
    detalle: "Detalle de Calidad",
  };

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
        <div className="py-4 flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-2">
              <Label className="font-semibold text-gray-700">Código</Label>
              <Input value={values.codigo || ""} readOnly className={`${styles.inputGrisBase} font-medium`} style={{ border: `2px solid ${OrgColors.serotGris}`, backgroundColor: "#f8f9fa", color: "#495057" }} />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="font-semibold text-gray-700">Nombre</Label>
              <Input value={values.nombre || ""} readOnly className={styles.inputGrisBase} style={{ border: `2px solid ${OrgColors.serotGris}`, backgroundColor: "#f8f9fa", color: "#495057" }} />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="font-semibold text-gray-700">Código de Material</Label>
              <Input value={values.codigoMaterial || ""} readOnly className={styles.inputGrisBase} style={{ border: `2px solid ${OrgColors.serotGris}`, backgroundColor: "#f8f9fa", color: "#495057" }} />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="font-semibold text-gray-700">Descripción</Label>
              <Textarea value={values.descripcion || "Sin descripción"} readOnly className={styles.inputGrisBase} style={{ border: `2px solid ${OrgColors.serotGris}`, backgroundColor: "#f8f9fa", color: "#495057", minHeight: "80px", resize: "none" }} />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="font-semibold text-gray-700">Conforme</Label>
              <div className="flex items-center">
                <Input value={values.conforme ? "Sí" : "No"} readOnly className={styles.inputGrisBase} style={{ border: `2px solid ${values.conforme ? "#28a745" : "#dc3545"}`, backgroundColor: values.conforme ? "#d4edda" : "#f8d7da", color: values.conforme ? "#155724" : "#721c24", fontWeight: "500", width: "100px", textAlign: "center" }} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="font-semibold text-gray-700">Estado</Label>
              <div className="flex items-center">
                <Input value={values.activo ? "Activo" : "Inactivo"} readOnly className={styles.inputGrisBase} style={{ border: `2px solid ${values.activo ? "#28a745" : "#dc3545"}`, backgroundColor: values.activo ? "#d4edda" : "#f8d7da", color: values.activo ? "#155724" : "#721c24", fontWeight: "500", width: "100px", textAlign: "center" }} />
              </div>
            </div>
          </div>

          {dataCalidad?.data && (
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Info20Regular className="text-blue-500" />
                <h4 className="font-semibold text-gray-700 text-lg">Información de Registro</h4>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {(dataCalidad.data as any).creadoEl && (
                  <div className="flex flex-col gap-2">
                    <Label className="font-medium text-gray-600 flex items-center gap-2">
                      <CalendarClock20Regular className="text-blue-500" />
                      Fecha de Creación
                    </Label>
                    <Input value={formatearFechaCompleta((dataCalidad.data as any).creadoEl)} readOnly className={styles.inputGrisBase} style={{ border: `2px solid #e3f2fd`, backgroundColor: "#f3f8ff", color: "#1976d2", fontWeight: "500", fontSize: "14px" }} />
                  </div>
                )}
                {(dataCalidad.data as any).modificadoEl && (dataCalidad.data as any).modificadoEl !== (dataCalidad.data as any).creadoEl && (
                  <div className="flex flex-col gap-2">
                    <Label className="font-medium text-gray-600 flex items-center gap-2">
                      <Edit20Regular className="text-orange-500" />
                      Última Modificación
                    </Label>
                    <Input value={formatearFechaCompleta((dataCalidad.data as any).modificadoEl)} readOnly className={styles.inputGrisBase} style={{ border: `2px solid #fff3e0`, backgroundColor: "#fffaf5", color: "#f57c00", fontWeight: "500", fontSize: "14px" }} />
                  </div>
                )}
              </div>
            </div>
          )}
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
                value={field.value ?? ""}
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
                value={field.value ?? ""}
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
          <Label required>Código de Material</Label>
          <Controller
            name="codigoMaterial"
            control={control}
            rules={{ required: "El código de material es requerido" }}
            render={({ field }) => (
              <Input
                value={field.value ?? ""}
                onChange={(_, data) => field.onChange(data.value)}
                className={styles.inputGrisBase}
                style={{ border: `2px solid ${OrgColors.serotGris}` }}
              />
            )}
          />
          {errors.codigoMaterial && (
            <span className="text-red-500">
              {errors.codigoMaterial.message}
            </span>
          )}
        </div>

        <div className="flex flex-col justify-start w-full gap-0.5">
          <Label>Descripción</Label>
          <Controller
            name="descripcion"
            control={control}
            render={({ field }) => (
              <Textarea
                value={field.value ?? ""}
                onChange={(_, data) => field.onChange(data.value)}
                size="large"
                className={styles.inputGrisBase}
                style={{
                  height: "10rem",
                  border: `2px solid ${OrgColors.serotGris}`,
                }}
              />
            )}
          />
          {errors.descripcion && (
            <span className="text-red-500">{errors.descripcion.message}</span>
          )}
        </div>

        <div className="flex flex-col justify-start w-full gap-0.5">
          <Controller
            name="conforme"
            control={control}
            render={({ field }) => (
              <Checkbox
                size="large"
                checked={!!field.value}
                onChange={(_, data) => field.onChange(!!data.checked)}
                label={field.value ? "Conforme" : "No conforme"}
              />
            )}
          />
        </div>

        <div className="flex flex-col justify-start w-full gap-0.5">
          <Label>Estado</Label>
          <Controller
            name="activo"
            control={control}
            render={({ field }) => (
              <Switch
                checked={!!field.value}
                onChange={(_, data) => field.onChange(!!data.checked)}
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
              id ? "Actualizando calidad..." : "Creando nueva calidad..."
            }
            successMessage={
              id
                ? asyncAction.response?.message ??
                  "Se actualizó correctamente la calidad"
                : asyncAction.response?.message ??
                  "Se creó correctamente la calidad"
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
