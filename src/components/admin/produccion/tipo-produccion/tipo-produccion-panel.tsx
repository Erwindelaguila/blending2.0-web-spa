import { DrawerBase } from "@/components/ui/drawe-base";
import { AsyncActionDisplay } from "@/components/ui/async-action-display";
import { useAsyncAction } from "@/hooks/use-async-action";
import { OrgColors } from "@/config/app.config.server";
import { IDrawer } from "@/interface/components/drawer";
import { useInputStyles } from "@/styles/input.styles";
import { Input, Label, Spinner, Switch, Textarea } from "@fluentui/react-components";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import useSWR from "swr";
import { useState, useMemo, useEffect, useCallback } from "react";
import { getByIdTipoProduccionKey } from "@/lib/constants/key-fetch";
import { TipoProduccionService } from "@/services/tipo-produccion.service";
import { useAuth } from "@/hooks/use-auth";
import { BaseResponse } from "@/interface";
import { ITipoProduccionResponse, ITipoProduccionRequest } from "@/interface/admin/tipo-produccion";
import { AppCombobox } from "@/components/ui/app-combobox";
import { LineaProduccionService } from "@/services/linea-produccion.service";
import { AgregadoService } from "@/services/agregado.service";
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
  LineaProduccionId: "",
  AgregadoId: "",
};

export function TipoProduccionPanel({ open, mode, id, close, onSuccess }: IDrawer) {
  const styles = useInputStyles();
  const asyncAction = useAsyncAction();
  const { user } = useAuth();

  // Estados para controlar la interacción manual del usuario
  const [usuarioInteractuoLinea, setUsuarioInteractuoLinea] = useState(false);
  const [usuarioInteractuoAgregado, setUsuarioInteractuoAgregado] = useState(false);
  const [usuarioBorroLinea, setUsuarioBorroLinea] = useState(false);
  const [usuarioBorroAgregado, setUsuarioBorroAgregado] = useState(false);

  const {
    register,
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

  const { data: lineasData, isLoading: lineasLoading } = useSWR(
    "combo-lineas-produccion",
    () => LineaProduccionService.listar(1, 500, { estado: 1 })
  );
  const { data: agregadosData, isLoading: agregadosLoading } = useSWR(
    "combo-agregados",
    () => AgregadoService.listar(1, 500, { estado: 1 })
  );

  // Obtener TODOS los datos (activos e inactivos) para lookup de códigos
  const { data: lineasCompletas } = useSWR(
    "lookup-lineas-completas",
    () => LineaProduccionService.listar(1, 500)
  );
  const { data: agregadosCompletos } = useSWR(
    "lookup-agregados-completos", 
    () => AgregadoService.listar(1, 500)
  );

  const lineaOptions = useMemo(() => {
    const list = ((lineasData as any)?.data?.data || []) as any[];
    const activos = list.filter((l: any) => l?.activo !== false);
    return activos.map((l: any) => ({ value: String(l.id ?? ""), label: l.codigo ?? "" }));
  }, [lineasData]);

  const agregadoOptions = useMemo(() => {
    const list = ((agregadosData as any)?.data?.data || []) as any[];
    const activos = list.filter((a: any) => a?.activo !== false);
    return activos.map((a: any) => ({ 
      value: String(a.id ?? ""), 
      label: a.codigo ?? a.nombre ?? "" 
    }));
  }, [agregadosData]);

  // Mapas completos para lookup de códigos (incluye activos e inactivos)
  const lineasCompletasMap = useMemo(() => {
    const list = ((lineasCompletas as any)?.data?.data || []) as any[];
    return Object.fromEntries(list.map((l: any) => [String(l.id), l.codigo]));
  }, [lineasCompletas]);

  const agregadosCompletosMap = useMemo(() => {
    const list = ((agregadosCompletos as any)?.data?.data || []) as any[];
    const map = Object.fromEntries(list.map((a: any) => [String(a.id), a.codigo]));
    return map;
  }, [agregadosCompletos]);

  // Opciones extendidas para modo editar (incluye el seleccionado aunque esté inactivo)
  const lineaOptionsExtendidas = useMemo(() => {
    const valores = watch();
    const lineaSeleccionadaId = valores?.LineaProduccionId;
    
    // Siempre empezar con las opciones activas
    let opciones = [...lineaOptions];
    
    // Solo agregar el elemento inactivo si:
    // 1. Hay un ID seleccionado
    // 2. El usuario NO ha interactuado manualmente Y NO lo ha borrado
    // 3. No está en las opciones activas
    if (lineaSeleccionadaId && 
        !usuarioInteractuoLinea && 
        !usuarioBorroLinea && 
        !opciones.find(o => o.value === lineaSeleccionadaId)) {
      const codigoLinea = lineasCompletasMap[lineaSeleccionadaId];
      if (codigoLinea) {
        opciones.push({
          value: lineaSeleccionadaId,
          label: `${codigoLinea} (Inactivo)`
        });
      }
    }
    
    return opciones;
  }, [lineaOptions, lineasCompletasMap, usuarioInteractuoLinea, usuarioBorroLinea, watch()]);

  const agregadoOptionsExtendidas = useMemo(() => {
    const valores = watch();
    const agregadoSeleccionadoId = valores?.AgregadoId;
    
    // Siempre empezar con las opciones activas
    let opciones = [...agregadoOptions];
    
    // Solo agregar el elemento inactivo si:
    // 1. Hay un ID seleccionado
    // 2. El usuario NO ha interactuado manualmente Y NO lo ha borrado
    // 3. No está en las opciones activas
    if (agregadoSeleccionadoId && 
        !usuarioInteractuoAgregado && 
        !usuarioBorroAgregado && 
        !opciones.find(o => o.value === agregadoSeleccionadoId)) {
      const codigoAgregado = agregadosCompletosMap[agregadoSeleccionadoId];
      if (codigoAgregado) {
        opciones.push({
          value: agregadoSeleccionadoId,
          label: `${codigoAgregado} (Inactivo)`
        });
      }
    }
    
    return opciones;
  }, [agregadoOptions, agregadosCompletosMap, usuarioInteractuoAgregado, usuarioBorroAgregado, watch()]);

  // Obtener código de línea basado en ID seleccionado
  const getLineaCodigo = useCallback((lineaId: string) => {
    if (!lineaId) return "";
    // Primero buscar en activos (para combobox)
    const linea = lineaOptions.find(l => l.value === lineaId);
    if (linea) return linea.label;
    // Si no está en activos, buscar en el mapa completo
    return lineasCompletasMap[lineaId] || "No encontrado";
  }, [lineaOptions, lineasCompletasMap]);

  // Obtener código de agregado basado en ID seleccionado  
  const getAgregadoCodigo = useCallback((agregadoId: string) => {
    if (!agregadoId) return "";
    // Primero buscar en activos (para combobox)
    const agregado = agregadoOptions.find(a => a.value === agregadoId);
    if (agregado) return agregado.label;
    // Si no está en activos, buscar en el mapa completo
    return agregadosCompletosMap[agregadoId] || "No encontrado";
  }, [agregadoOptions, agregadosCompletosMap]);

  const onSubmit: SubmitHandler<ITipoProduccionRequest> = async (data) => {
    if (!user?.id) {
      console.error("Usuario no autenticado o sin ID");
      return;
    }
  const payloadCreate: ITipoProduccionRequest = { ...data };
  const payloadUpdate: any = { ...data, id: id || "" };

    await asyncAction.execute(async () => {
      const result = id
        ? await TipoProduccionService.actualizar(payloadUpdate as any)
        : await TipoProduccionService.crear(payloadCreate as any);
      return result;
    });
  };

  const closeAcction = () => {
    if (asyncAction.isSuccess && onSuccess && asyncAction.response?.data) {
      onSuccess(asyncAction.response.data as any, mode);
    }
    reset(defaultFormValues);
    // Resetear todos los estados de interacción
    setUsuarioInteractuoLinea(false);
    setUsuarioInteractuoAgregado(false);
    setUsuarioBorroLinea(false);
    setUsuarioBorroAgregado(false);
    close();
    asyncAction.reset();
  };

  useEffect(() => {
    const loadData = async () => {
      if (!open) return;
      
      // Resetear todos los estados de interacción al abrir el panel
      setUsuarioInteractuoLinea(false);
      setUsuarioInteractuoAgregado(false);
      setUsuarioBorroLinea(false);
      setUsuarioBorroAgregado(false);
      
      if (mode === "crear") {
        reset(defaultFormValues);
        setDataTipo(null);
        setErrorTipo(null);
        return;
      }
      if (!id) {
        setErrorTipo("ID no proporcionado para cargar datos");
        return;
      }
      if (lineasLoading || agregadosLoading) {
        return;
      }
      setLoadingTipo(true);
      setErrorTipo(null);
      try {
        const response = await TipoProduccionService.obtenerPorId(getByIdTipoProduccionKey(id));
        setDataTipo(response);
        if (response.data) {
          // Sin normalizar: aceptar cualquier casing del backend para los FKs
          reset({
            codigo: response.data.codigo,
            nombre: response.data.nombre,
            descripcion: response.data.descripcion ?? "",
            activo: !!response.data.activo,
            LineaProduccionId: String(
              response.data.LineaProduccionId ?? response.data.lineaProduccionId ?? ""
            ),
            AgregadoId: String(
              response.data.AgregadoId ?? response.data.agregadoId ?? ""
            ),
          });
        }
      } catch (error) {
        setErrorTipo("Error al cargar los datos");
        console.error("Error loading tipo produccion:", error);
      } finally {
        setLoadingTipo(false);
      }
    };
    loadData();
  }, [open, mode, id, reset, lineasLoading, agregadosLoading]);

  useEffect(() => {
    if (!open) {
      setDataTipo(null);
      setLoadingTipo(false);
      setErrorTipo(null);
      asyncAction.reset();
    }
  }, [open]);

  const values = watch();
  const contenido = useMemo(() => {
    if (loadingTipo || lineasLoading || agregadosLoading) {
      return (
        <div className="py-2">
          <Spinner labelPosition="above" label="Cargando datos" />
        </div>
      );
    }
    if (errorTipo) {
      return <div className="py-2 text-red-500">Ocurrió un error al traer los datos.</div>;
    }
    if (mode === "detalle") {
      return (
        <div className="py-4 space-y-6">
          {/* Información básica */}
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
                value={getLineaCodigo(values.LineaProduccionId || "")}
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
                value={getAgregadoCodigo(values.AgregadoId || "")}
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
            name="LineaProduccionId"
            control={control}
            rules={{ required: "Seleccione una línea" }}
            render={({ field }) => (
              <AppCombobox
                label="Línea Producción"
                labelRequired
                size="medium"
                options={lineaOptionsExtendidas}
                value={field.value}
                grayBorder
                onChange={(value) => {
                  setUsuarioInteractuoLinea(true);
                  if (!value || value === "") {
                    setUsuarioBorroLinea(true);
                  }
                  field.onChange(value);
                }}
                error={errors.LineaProduccionId?.message}
              />
            )}
          />
        </div>

        <div className="flex flex-col justify-start w-full gap-0.5">
          <Controller
            name="AgregadoId"
            control={control}
            rules={{ required: "Seleccione un agregado" }}
            render={({ field }) => (
              <AppCombobox
                label="Agregado"
                labelRequired
                size="medium"
                options={agregadoOptionsExtendidas}
                value={field.value}
                grayBorder
                onChange={(value) => {
                  setUsuarioInteractuoAgregado(true);
                  if (!value || value === "") {
                    setUsuarioBorroAgregado(true);
                  }
                  field.onChange(value);
                }}
                error={errors.AgregadoId?.message}
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
            style={{ height: "10rem", border: `2px solid ${OrgColors.serotGris}` }}
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
  }, [loadingTipo, lineasLoading, agregadosLoading, errorTipo, mode, values, styles, control, register, errors, lineaOptionsExtendidas, agregadoOptionsExtendidas, getLineaCodigo, getAgregadoCodigo, lineasCompletasMap, agregadosCompletosMap, usuarioInteractuoLinea, usuarioInteractuoAgregado, usuarioBorroLinea, usuarioBorroAgregado]);

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
          onErrorDismiss={() => asyncAction.resetError()}
        />
      )}
      {(mode === "detalle" || asyncAction.isFromInit || asyncAction.error) && contenido}
      {mode !== "detalle" && (asyncAction.isLoading || asyncAction.isSuccess) && (
        <AsyncActionDisplay
          state={asyncAction.state}
          loadingMessage={id ? "Actualizando tipo de producción..." : "Creando nuevo tipo de producción..."}
          successMessage={
            id
              ? asyncAction.response?.message ?? "Se actualizó correctamente"
              : asyncAction.response?.message ?? "Se creó correctamente"
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
