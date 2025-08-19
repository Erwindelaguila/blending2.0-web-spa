import { DrawerBase } from "@/components/ui/drawe-base";
import { AsyncActionDisplay } from "@/components/ui/async-action-display";
import { useAsyncAction } from "@/hooks/use-async-action";
import { useAuth } from "@/hooks/use-auth";
import { OrgColors } from "@/config/app.config.server";
import { BaseResponse, IDrawer } from "@/interface";
import { useInputStyles } from "@/styles/input.styles";
import { Input, Label, Switch, Textarea, Spinner } from "@fluentui/react-components";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { IParametroResponse, IParametroSend, IParametroUpdate } from "@/interface/admin/parametro";
import { ParametrosService } from "@/services/parametros.service";
import { getByIdParametroKey } from "@/lib/constants/key-fetch";
import { CalendarClock20Regular, Edit20Regular, Info20Regular } from "@fluentui/react-icons";
import { formatearFechaCompleta } from "@/utils/date";

const defaultFormValues: IParametroSend = {
  codigo: "",
  nombre: "",
  descripcion: "",
  activo: true,
  creadoPorId: "",
};

export function ParametroPanel({ open, mode, id, close, onSuccess }: IDrawer) {
  const styles = useInputStyles();
  const asyncAction = useAsyncAction();
  const { user } = useAuth();

  const {
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<IParametroSend>({
    defaultValues: defaultFormValues,
  });

  const [dataParametro, setDataParametro] = useState<BaseResponse<IParametroResponse> | null>(null);
  const [loadingParametro, setLoadingParametro] = useState(false);
  const [errorParametro, setErrorParametro] = useState<string | null>(null);

  const onSubmit: SubmitHandler<IParametroSend> = async (data) => {
    if (!user?.id) {
      console.error("Usuario no autenticado o sin ID");
      return;
    }
    const sendCreate: IParametroSend = { ...data, creadoPorId: user.id };
    const sendUpdate: IParametroUpdate = { ...data, id: id || "", modificadoPorId: user.id };

    await asyncAction.execute(async () => {
      const result = id
        ? await ParametrosService.actualizar(sendUpdate)
        : await ParametrosService.crear(sendCreate);
      return result;
    });
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
    const loadData = async () => {
      if (!open) return;

      if (mode === "crear") {
        reset(defaultFormValues);
        setDataParametro(null);
        setErrorParametro(null);
        return;
      }

      if (mode === "editar" || mode === "detalle") {
        if (!id) {
          setErrorParametro("ID no proporcionado para cargar datos");
          return;
        }

        setLoadingParametro(true);
        setErrorParametro(null);

        try {
          const response = await ParametrosService.obtenerPorId(getByIdParametroKey(id));
          setDataParametro(response);
          reset(response.data);
        } catch (error) {
          setErrorParametro("Error al cargar los datos");
          console.error("Error loading parámetro:", error);
        } finally {
          setLoadingParametro(false);
        }
      }
    };

    loadData();
  }, [open, mode, id, reset]);

  useEffect(() => {
    if (!open) {
      setDataParametro(null);
      setLoadingParametro(false);
      setErrorParametro(null);
      asyncAction.reset();
    }
  }, [open]);

  const values = watch();

  const renderContenidoSegunModo = () => {
    if (loadingParametro) {
      return (
        <div className="py-4 flex justify-center">
          <Spinner size="medium" label="Cargando datos del parámetro..." />
        </div>
      );
    }

    if (errorParametro) {
      return (
        <div className="py-2 text-red-500">
          Ocurrió un error al traer los datos.
        </div>
      );
    }

    if (mode === "detalle") {
      return (
        <div className="py-4 flex flex-col gap-6">
          {/* Información principal */}
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-2">
              <Label className="font-semibold text-gray-700">Código</Label>
              <Input
                value={values.codigo || ""}
                readOnly
                className={`${styles.inputGrisBase} font-medium`}
                style={{ 
                  border: `2px solid ${OrgColors.serotGris}`,
                  backgroundColor: "#f8f9fa",
                  color: "#495057"
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="font-semibold text-gray-700">Nombre</Label>
              <Input
                value={values.nombre || ""}
                readOnly
                className={styles.inputGrisBase}
                style={{ 
                  border: `2px solid ${OrgColors.serotGris}`,
                  backgroundColor: "#f8f9fa",
                  color: "#495057"
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="font-semibold text-gray-700">Descripción</Label>
              <Textarea
                value={values.descripcion || "Sin descripción"}
                readOnly
                className={styles.inputGrisBase}
                style={{ 
                  border: `2px solid ${OrgColors.serotGris}`,
                  backgroundColor: "#f8f9fa",
                  color: "#495057"
                }}
                rows={3}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="font-semibold text-gray-700">Estado</Label>
              <div className="flex items-center">
                <Input
                  value={values.activo ? "Activo" : "Inactivo"}
                  readOnly
                  className={styles.inputGrisBase}
                  style={{ 
                    border: `2px solid ${values.activo ? "#28a745" : "#dc3545"}`,
                    backgroundColor: values.activo ? "#d4edda" : "#f8d7da",
                    color: values.activo ? "#155724" : "#721c24",
                    fontWeight: "500",
                    width: "100px",
                    textAlign: "center"
                  }}
                />
              </div>
            </div>
          </div>

          {/* Información de auditoría */}
          {dataParametro?.data && (
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Info20Regular className="text-blue-500" />
                <h4 className="font-semibold text-gray-700 text-lg">Información de Registro</h4>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="font-medium text-gray-600 flex items-center gap-2">
                    <CalendarClock20Regular className="text-blue-500" />
                    Fecha de Creación
                  </Label>
                  <Input value={formatearFechaCompleta(dataParametro.data.creadoEl)} readOnly className={styles.inputGrisBase} style={{ border: `2px solid #e3f2fd`, backgroundColor: "#f3f8ff", color: "#1976d2", fontWeight: "500", fontSize: "14px" }} />
                </div>
                {dataParametro.data.modificadoEl && dataParametro.data.modificadoEl !== dataParametro.data.creadoEl && (
                  <div className="flex flex-col gap-2">
                    <Label className="font-medium text-gray-600 flex items-center gap-2">
                      <Edit20Regular className="text-orange-500" />
                      Última Modificación
                    </Label>
                    <Input value={formatearFechaCompleta(dataParametro.data.modificadoEl)} readOnly className={styles.inputGrisBase} style={{ border: `2px solid #fff3e0`, backgroundColor: "#fffaf5", color: "#f57c00", fontWeight: "500", fontSize: "14px" }} />
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
                className={styles.inputGrisBase}
                style={{ border: `2px solid ${OrgColors.serotGris}` }}
              />
            )}
          />
          {errors.codigo && (
            <span className="text-red-500 text-sm">{errors.codigo.message}</span>
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
            <span className="text-red-500 text-sm">{errors.nombre.message}</span>
          )}
        </div>

        <div className="flex flex-col justify-start w-full gap-0.5">
          <Label>Descripción</Label>
          <Controller
            name="descripcion"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                className={styles.inputGrisBase}
                style={{ border: `2px solid ${OrgColors.serotGris}` }}
                rows={3}
              />
            )}
          />
        </div>

        <div className="flex flex-col justify-start w-full gap-0.5">
          <Label>Estado</Label>
          <Controller
            name="activo"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Switch
                checked={value}
                onChange={(e, data) => onChange(data.checked)}
                label={value ? "Activo" : "Inactivo"}
              />
            )}
          />
        </div>
      </div>
    );
  };

  const TITULOS_PANEL: Record<typeof mode, string> = {
    crear: "Nuevo Parámetro",
    editar: "Editar Parámetro",
    detalle: "Detalle de Parámetro",
  };

  return (
    <DrawerBase
      open={open}
      close={closeAcction}
      title={TITULOS_PANEL[mode]}
      buttonAction={mode !== "detalle" ? handleSubmit(onSubmit) : undefined}
      BtnAccion={mode !== "detalle" && !asyncAction.isLoading && !asyncAction.isSuccess}
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
          onErrorDismiss={() => asyncAction.resetError?.() ?? asyncAction.reset()}
        />
      )}

      {(mode === "detalle" || (asyncAction as any).isFromInit || asyncAction.error) && renderContenidoSegunModo()}

      {mode !== "detalle" && (asyncAction.isLoading || asyncAction.isSuccess) && (
        <AsyncActionDisplay
          state={asyncAction.state}
          loadingMessage={id ? "Actualizando parámetro..." : "Creando nuevo parámetro..."}
          successMessage={
            id
              ? asyncAction.response?.message ?? "Se actualizó correctamente el parámetro"
              : asyncAction.response?.message ?? "Se creó correctamente el parámetro"
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
