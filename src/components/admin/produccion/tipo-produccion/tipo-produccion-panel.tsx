import { DrawerBase } from "@/components/ui/drawe-base";
import { AsyncActionDisplay } from "@/components/ui/async-action-display";
import { useAsyncAction } from "@/hooks/use-async-action";
import { OrgColors } from "@/config/app.config.server";
import { IDrawer } from "@/interface/components/drawer";
import { useInputStyles } from "@/styles/input.styles";
import { Input, Label, Spinner, Switch, Textarea } from "@fluentui/react-components";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { getByIdTipoProduccionKey } from "@/lib/constants/key-fetch";
import { TipoProduccionService } from "@/services/tipo-produccion.service";
import { LineaProduccionService } from "@/services/linea-produccion.service";
import { AgregadoService } from "@/services/agregado.service";
import { BaseResponse } from "@/interface";
import { ITipoProduccionResponse, ITipoProduccionRequest } from "@/interface/admin/tipo-produccion";
import { AppCombobox } from "@/components/ui/app-combobox";
import { formatearFechaCompleta } from "@/utils/date";
import { 
  CalendarClock20Regular, 
  Edit20Regular, 
  Info20Regular 
} from "@fluentui/react-icons";

const TITULOS_PANEL: Record<IDrawer["mode"], string> = {
  crear: "Nuevo Tipo de Producción",
  editar: "Editar Tipo de Producción",
  detalle: "Detalle de Tipo de Producción",
};

const defaultFormValues: ITipoProduccionRequest = {
  codigo: "",
  nombre: "",
  descripcion: "",
  activo: true,
  lineaProduccionId: "",
  agregadoId: "",
};

export function TipoProduccionPanel({ open, mode, id, close, onSuccess }: IDrawer) {
  const styles = useInputStyles();
  const asyncAction = useAsyncAction();

  const {
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<ITipoProduccionRequest>({
    defaultValues: defaultFormValues,
  });

  const [dataTipo, setDataTipo] = useState<BaseResponse<ITipoProduccionResponse> | null>(null);
  const [loadingTipo, setLoadingTipo] = useState(false);
  const [errorTipo, setErrorTipo] = useState<string | null>(null);

  const [lineaOptions, setLineaOptions] = useState<{ value: string; label: string }[]>([]);
  const [agregadoOptions, setAgregadoOptions] = useState<{ value: string; label: string }[]>([]);
  const lineasLoadedRef = useRef(false);
  const agregadosLoadedRef = useRef(false);
  const [loadingLineas, setLoadingLineas] = useState(false);
  const [loadingAgregados, setLoadingAgregados] = useState(false);

  const fetchLineasIfNeeded = useCallback(async () => {
    if (lineasLoadedRef.current || loadingLineas) return;
    setLoadingLineas(true);
    try {
      const res = await LineaProduccionService.obtenerActivos();
      const fetched = (res?.data ?? []).map((l: any) => ({ value: String(l.id), label: String(l.codigo) }));
      setLineaOptions(prev => {
        const currentId = dataTipo?.data?.lineaProduccion?.id;
        const currentCodigo = dataTipo?.data?.lineaProduccion?.codigo;
        const base = currentId && !fetched.find(f => f.value === String(currentId))
          ? [{ value: String(currentId), label: String(currentCodigo) }, ...fetched]
          : fetched;
        return base;
      });
      lineasLoadedRef.current = true;
    } catch {
    } finally {
      setLoadingLineas(false);
    }
  }, [dataTipo, loadingLineas]);

  const fetchAgregadosIfNeeded = useCallback(async () => {
    if (agregadosLoadedRef.current || loadingAgregados) return;
    setLoadingAgregados(true);
    try {
      const res = await AgregadoService.obtenerActivos();
      const fetched = (res?.data ?? []).map((a: any) => ({ value: String(a.id), label: String(a.codigo) }));
      setAgregadoOptions(prev => {
        const currentId = dataTipo?.data?.agregado?.id;
        const currentCodigo = dataTipo?.data?.agregado?.codigo;
        const base = currentId && !fetched.find(f => f.value === String(currentId))
          ? [{ value: String(currentId), label: String(currentCodigo) }, ...fetched]
          : fetched;
        return base;
      });
      agregadosLoadedRef.current = true;
    } catch {
    } finally {
      setLoadingAgregados(false);
    }
  }, [dataTipo, loadingAgregados]);

  useEffect(() => {
    if ((mode === 'editar' || mode === 'detalle') && dataTipo?.data) {
      if (dataTipo.data.lineaProduccion) {
        setLineaOptions([{ value: String(dataTipo.data.lineaProduccion.id), label: String(dataTipo.data.lineaProduccion.codigo) }]);
      }
      if (dataTipo.data.agregado) {
        setAgregadoOptions([{ value: String(dataTipo.data.agregado.id), label: String(dataTipo.data.agregado.codigo) }]);
      }
    }
  }, [mode, dataTipo]);

  const onSubmit: SubmitHandler<ITipoProduccionRequest> = async (data) => {
    const payloadCreate: ITipoProduccionRequest = { ...data };
    const payloadUpdate: any = { ...data, id: id || "" };

    await asyncAction.execute(async () => {
      try {
        const result = id
          ? await TipoProduccionService.actualizar(payloadUpdate as any)
          : await TipoProduccionService.crear(payloadCreate as any);
        return result;
      } catch (error: any) {
        if (error?.response?.status === 409 && error?.response?.data?.code === 'ENTITY_IN_USE') {
          const conflictMessage = error.response.data.message || 
            "No se puede realizar la acción. El elemento está siendo usado por registros activos.";
          throw new Error(conflictMessage);
        }
        throw error;
      }
    });
  };

  const closeAcction = useCallback(() => {
    if (asyncAction.isSuccess && onSuccess && asyncAction.response?.data) {
      onSuccess(asyncAction.response.data as any, mode);
    }
    reset(defaultFormValues);

    setLineaOptions([]);
  setAgregadoOptions([]);
  lineasLoadedRef.current = false;
  agregadosLoadedRef.current = false;
    close();
    asyncAction.reset();
  }, [asyncAction.isSuccess, onSuccess, mode, reset, close]);

  useEffect(() => {
    const loadData = async () => {
      if (!open) return;
      
  lineasLoadedRef.current = false;
  agregadosLoadedRef.current = false;
  setLineaOptions([]);
  setAgregadoOptions([]);
      
      if (mode === "crear") {
        reset(defaultFormValues);
        setDataTipo(null);
        setErrorTipo(null);
        return;
      }
      
      if (mode === "editar" || mode === "detalle") {
        if (!id) {
          setErrorTipo("ID no proporcionado para cargar datos");
          return;
        }
        
        setLoadingTipo(true);
        setErrorTipo(null);
        
        try {
          const response = await TipoProduccionService.obtenerPorId(getByIdTipoProduccionKey(id));
          setDataTipo(response);
          
          if (response.data) {
            reset({
              codigo: response.data.codigo,
              nombre: response.data.nombre,
              descripcion: response.data.descripcion ?? "",
              activo: !!response.data.activo,
              lineaProduccionId: String(response.data.lineaProduccion.id),
              agregadoId: String(response.data.agregado.id),
            });
          }
        } catch (error) {
          setErrorTipo("Error al cargar los datos");
          console.error("Error loading tipo produccion:", error);
        } finally {
          setLoadingTipo(false);
        }
      }
    };
    
    loadData();
  }, [open, mode, id, reset]);

  useEffect(() => {
    if (!open) {
      setDataTipo(null);
      setLoadingTipo(false);
      setErrorTipo(null);
      setLineaOptions([]);
      setAgregadoOptions([]);
      lineasLoadedRef.current = false;
      agregadosLoadedRef.current = false;
      asyncAction.reset();
    }
  }, [open]);

  const values = watch();

  const renderContent = () => {
    if (loadingTipo) {
      return (
        <div className="py-2">
          <Spinner labelPosition="above" label="Cargando datos" />
        </div>
      );
    }

    if (errorTipo) {
      return (
        <div className="py-2 text-red-500">
          Ocurrió un error al traer los datos.
        </div>
      );
    }

    if (mode === "detalle") {
      return (
        <div className="py-4 space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label className="font-semibold text-gray-700">Código</Label>
              <Input
                value={values.codigo || ""}
                readOnly
                className={styles.inputGrisBase}
                style={{ 
                  border: `2px solid ${OrgColors.serotGris}`,
                  backgroundColor: "#f8f9fa",
                  color: "#495057",
                  fontWeight: "500"
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
                  color: "#495057",
                  fontWeight: "500"
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="font-semibold text-gray-700">Línea de Producción</Label>
              <Input
                value={dataTipo?.data?.lineaProduccion?.codigo || "No encontrado"}
                readOnly
                className={styles.inputGrisBase}
                style={{ 
                  border: `2px solid ${OrgColors.serotGris}`,
                  backgroundColor: "#f8f9fa",
                  color: "#495057",
                  fontWeight: "500"
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="font-semibold text-gray-700">Agregado</Label>
              <Input
                value={dataTipo?.data?.agregado?.codigo || "No encontrado"}
                readOnly
                className={styles.inputGrisBase}
                style={{ 
                  border: `2px solid ${OrgColors.serotGris}`,
                  backgroundColor: "#f8f9fa",
                  color: "#495057",
                  fontWeight: "500"
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

            {dataTipo?.data?.creadoEl && (
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
                      value={formatearFechaCompleta(dataTipo.data.creadoEl)}
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
                  
                  {dataTipo.data.modificadoEl && dataTipo.data.modificadoEl !== dataTipo.data.creadoEl && (
                    <div className="flex flex-col gap-2">
                      <Label className="font-medium text-gray-600 flex items-center gap-2">
                        <Edit20Regular className="text-orange-500" />
                        Última Modificación
                      </Label>
                      <Input
                        value={formatearFechaCompleta(dataTipo.data.modificadoEl)}
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
          <Controller
            name="lineaProduccionId"
            control={control}
            rules={{ required: "Seleccione una línea" }}
            render={({ field }) => (
              <AppCombobox
                label="Línea Producción"
                labelRequired
                size="medium"
                options={lineaOptions}
                value={field.value}
                grayBorder
                onChange={field.onChange}
                error={errors.lineaProduccionId?.message}
                placeholder={loadingLineas ? 'Cargando líneas...' : 'Seleccione línea de producción'}
                onTriggerLoad={() => { if (!lineasLoadedRef.current) fetchLineasIfNeeded(); }}
              />
            )}
          />
        </div>

        <div className="flex flex-col justify-start w-full gap-0.5">
          <Controller
            name="agregadoId"
            control={control}
            rules={{ required: "Seleccione un agregado" }}
            render={({ field }) => (
              <AppCombobox
                label="Agregado"
                labelRequired
                size="medium"
                options={agregadoOptions}
                value={field.value}
                grayBorder
                onChange={field.onChange}
                error={errors.agregadoId?.message}
                placeholder={loadingAgregados ? 'Cargando agregados...' : 'Seleccione agregado'}
                onTriggerLoad={() => { if (!agregadosLoadedRef.current) fetchAgregadosIfNeeded(); }}
              />
            )}
          />
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
                checked={field.value}
                onChange={(e, data) => field.onChange(data.checked)}
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
      title={TITULOS_PANEL[mode]}
      close={closeAcction}
      drawerTypeModal={mode !== "detalle"}
      BtnAccion={mode !== "detalle" && !asyncAction.isLoading && !asyncAction.isSuccess}
      btnDetails={mode === "detalle"}
      buttonAction={mode !== 'detalle' ? handleSubmit(onSubmit) : undefined}
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

      {(mode === "detalle" || asyncAction.isFromInit || asyncAction.error) && renderContent()}

      {mode !== "detalle" &&
        (asyncAction.isLoading || asyncAction.isSuccess) && (
          <AsyncActionDisplay
            state={asyncAction.state}
            loadingMessage={
              id ? "Actualizando tipo de producción..." : "Creando nuevo tipo de producción..."
            }
            successMessage={
              id
                ? asyncAction.response?.message ?? "Se actualizó correctamente el tipo de producción"
                : asyncAction.response?.message ?? "Se creó correctamente el tipo de producción"
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
