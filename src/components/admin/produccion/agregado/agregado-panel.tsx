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
  Spinner,
  Switch,
  Textarea,
} from "@fluentui/react-components";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import {
  getByIdAgregadoKey,
} from "@/lib/constants/key-fetch";
import { IAgregado, IAgregadoSend, IAgregadoUpdate } from "@/interface/admin/agregado";
import { AgregadoService } from "@/services/agregado.service";
import { formatearFechaCompleta } from "@/utils/date";
import { 
  CalendarClock20Regular, 
  Edit20Regular, 
  Info20Regular 
} from "@fluentui/react-icons";


const TITULOS_PANEL: Record<IDrawer["mode"], string> = {
  crear: "Nuevo Agregado",
  editar: "Editar Agregado",
  detalle: "Detalle de Agregado",
};


const defaultFormValues: IAgregadoSend = {
  codigo: "",
  nombre: "",
  descripcion: "",
  activo: true,
  creadoPorId: "",
};

export function AgregadoPanel({ open, mode, id, close, onSuccess }: IDrawer) {
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
  } = useForm<IAgregadoSend>({
    defaultValues: defaultFormValues,
  });

  const [dataAgregado, setDataAgregado] = useState<BaseResponse<IAgregado> | null>(null);
  const [loadingAgregado, setLoadingAgregado] = useState(false);
  const [errorAgregado, setErrorAgregado] = useState<string | null>(null);

  const onSubmit: SubmitHandler<IAgregadoSend> = async (data) => {
    if (!user?.id) {
      console.error("Usuario no autenticado o sin ID");
      return;
    }
    const sendAgregado: IAgregadoSend = { ...data, creadoPorId: user.id };
    const sendUpdate: IAgregadoUpdate = { ...data, modificadoPorId: user.id, id: id || "" };

    await asyncAction.execute(async () => {
      const result = id
        ? await AgregadoService.actualizar(sendUpdate)
        : await AgregadoService.crear(sendAgregado);
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
        setDataAgregado(null);
        setErrorAgregado(null);
        return;
      }
      
      if (mode === "editar" || mode === "detalle") {
        if (!id) {
          setErrorAgregado("ID no proporcionado para cargar datos");
          return;
        }
        
        setLoadingAgregado(true);
        setErrorAgregado(null);
        
        try {
          const response = await AgregadoService.obtenerPorId(getByIdAgregadoKey(id));
          setDataAgregado(response);
          reset(response.data);
        } catch (error) {
          setErrorAgregado("Error al cargar los datos");
          console.error("Error loading agregado:", error);
        } finally {
          setLoadingAgregado(false);
        }
      }
    };

    loadData();
  }, [open, mode, id, reset]);

  useEffect(() => {
    if (!open) {
      setDataAgregado(null);
      setLoadingAgregado(false);
      setErrorAgregado(null);
      asyncAction.reset();
    }
  }, [open]);

  const values = watch();

  const contenido = useMemo(() => {
    if (loadingAgregado) {
      return (
        <div className="py-2">
          <Spinner labelPosition="above" label="Cargando datos" />
        </div>
      );
    }

    if (errorAgregado) {
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
                  color: "#495057",
                  minHeight: "80px",
                  resize: "none"
                }}
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
          
          {dataAgregado?.data?.creadoEl && (
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
                  <Input
                    value={formatearFechaCompleta(dataAgregado.data.creadoEl)}
                    readOnly
                    className={styles.inputGrisBase}
                    style={{ 
                      border: `2px solid #e3f2fd`,
                      backgroundColor: "#f3f8ff",
                      color: "#1976d2",
                      fontWeight: "500",
                      fontSize: "14px"
                    }}
                  />
                </div>
                
                {dataAgregado.data.modificadoEl && dataAgregado.data.modificadoEl !== dataAgregado.data.creadoEl && (
                  <div className="flex flex-col gap-2">
                    <Label className="font-medium text-gray-600 flex items-center gap-2">
                      <Edit20Regular className="text-orange-500" />
                      Última Modificación
                    </Label>
                    <Input
                      value={formatearFechaCompleta(dataAgregado.data.modificadoEl)}
                      readOnly
                      className={styles.inputGrisBase}
                      style={{ 
                        border: `2px solid #fff3e0`,
                        backgroundColor: "#fffaf5",
                        color: "#f57c00",
                        fontWeight: "500",
                        fontSize: "14px"
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      );
    }

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
  }, [
    loadingAgregado,
    errorAgregado,
    mode,
    dataAgregado,
    styles,
    values,
    control,
    errors,
  ]);

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

  {(mode === "detalle" || asyncAction.isFromInit || asyncAction.error) && contenido}

      {mode !== "detalle" &&
        (asyncAction.isLoading || asyncAction.isSuccess) && (
          <AsyncActionDisplay
            state={asyncAction.state}
            loadingMessage={
              id ? "Actualizando agregado..." : "Creando nuevo agregado..."
            }
            successMessage={
              id
                ? asyncAction.response?.message ??
                  "Se actualizó correctamente el agregado"
                : asyncAction.response?.message ??
                  "Se creó correctamente el agregado"
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
