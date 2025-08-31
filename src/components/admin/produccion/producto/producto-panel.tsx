import { DrawerBase } from "@/components/ui/drawe-base";
import { AsyncActionDisplay } from "@/components/ui/async-action-display";
import { useAsyncAction } from "@/hooks/use-async-action";
import { OrgColors } from "@/config/app.config.server";
import { BaseResponse, IDrawer } from "@/interface";
import { useInputStyles } from "@/styles/input.styles";
import { Input, Label, Spinner, Switch, Textarea } from "@fluentui/react-components";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { IProductoResponse, IProductoRequest, IProductoUpdate } from "@/interface/admin/producto";
import { ProductoService } from "@/services/producto.service";
import { getByIdProductoKey } from "@/lib/constants/key-fetch";
import { formatearFechaCompleta } from "@/utils/date";
import { CalendarClock20Regular, Edit20Regular, Info20Regular } from "@fluentui/react-icons";
import { AppCombobox } from "@/components/ui/app-combobox";
import { CalidadesService } from "@/services/calidades.service";
import { TipoProduccionService } from "@/services/tipo-produccion.service";

const TITULOS_PANEL: Record<IDrawer["mode"], string> = {
  crear: "Nuevo Producto",
  editar: "Editar Producto",
  detalle: "Detalle de Producto",
};

type ProductoForm = {
  codigo: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  calidad_id: string;
  tipo_produccion_id: string;
};

const defaultFormValues: ProductoForm = { 
  codigo: "", 
  nombre: "", 
  descripcion: "", 
  activo: true, 
  calidad_id: "", 
  tipo_produccion_id: "" 
};

export function ProductoPanel({ open, mode, id, close, onSuccess }: IDrawer) {
  const styles = useInputStyles();
  const asyncAction = useAsyncAction();

  const { register, handleSubmit, reset, watch, control, formState: { errors }, } = useForm<ProductoForm>({ defaultValues: defaultFormValues });

  const [dataProducto, setDataProducto] = useState<BaseResponse<IProductoResponse> | null>(null);
  const [loadingProducto, setLoadingProducto] = useState(false);
  const [errorProducto, setErrorProducto] = useState<string | null>(null);

  const [calidadOptions, setCalidadOptions] = useState<{ value: string; label: string }[]>([]);
  const [tipoOptions, setTipoOptions] = useState<{ value: string; label: string }[]>([]);
  const calidadesLoadedRef = useRef(false);
  const tiposLoadedRef = useRef(false);
  const [loadingCalidades, setLoadingCalidades] = useState(false);
  const [loadingTipos, setLoadingTipos] = useState(false);

  const fetchCalidadesIfNeeded = useCallback(async () => {
    if (calidadesLoadedRef.current || loadingCalidades) return;
    setLoadingCalidades(true);
    try {
      const res = await CalidadesService.obtenerActivos();
      const fetched = (res?.data ?? []).map((c: any) => ({ value: String(c.id), label: String(c.codigo) }));
      setCalidadOptions(prev => {
        const dto: any = dataProducto?.data;
        const currentId = dto?.calidadId ?? dto?.calidad?.id;
        const currentCodigo = dto?.calidadCodigo ?? dto?.calidad?.codigo;
        const base = currentId && !fetched.find(f => f.value === String(currentId))
          ? [{ value: String(currentId), label: String(currentCodigo) }, ...fetched]
          : fetched;
        return base;
      });
      calidadesLoadedRef.current = true;
    } catch {
    } finally {
      setLoadingCalidades(false);
    }
  }, [dataProducto, loadingCalidades]);

  const fetchTiposIfNeeded = useCallback(async () => {
    if (tiposLoadedRef.current || loadingTipos) return;
    setLoadingTipos(true);
    try {
      const res = await TipoProduccionService.obtenerActivos();
      const fetched = (res?.data ?? []).map((t: any) => ({ value: String(t.id), label: String(t.codigo) }));
      setTipoOptions(prev => {
        const dto: any = dataProducto?.data;
        const currentId = dto?.tipoProduccionId ?? dto?.tipoProduccion?.id;
        const currentCodigo = dto?.tipoProduccionCodigo ?? dto?.tipoProduccion?.codigo;
        const base = currentId && !fetched.find(f => f.value === String(currentId))
          ? [{ value: String(currentId), label: String(currentCodigo) }, ...fetched]
          : fetched;
        return base;
      });
      tiposLoadedRef.current = true;
    } catch {
      // silencioso
    } finally {
      setLoadingTipos(false);
    }
  }, [dataProducto, loadingTipos]);

  useEffect(() => {
    if ((mode === 'editar' || mode === 'detalle') && dataProducto?.data) {
      const data = dataProducto.data as any;
      const calidadId = data.calidadId ?? data.calidad?.id;
      const calidadCodigo = data.calidadCodigo ?? data.calidad?.codigo;
      if (calidadId && calidadCodigo) {
        setCalidadOptions([{ value: String(calidadId), label: String(calidadCodigo) }]);
      }
      const tipoId = data.tipoProduccionId ?? data.tipoProduccion?.id;
      const tipoCodigo = data.tipoProduccionCodigo ?? data.tipoProduccion?.codigo;
      if (tipoId && tipoCodigo) {
        setTipoOptions([{ value: String(tipoId), label: String(tipoCodigo) }]);
      }
    }
  }, [mode, dataProducto]);

  const getCalidadCodigo = useCallback((id: string) => {
    if (!id) return "";
    return calidadOptions.find((c) => c.value === id)?.label || "";
  }, [calidadOptions]);
  
  const getTipoCodigo = useCallback((id: string) => {
    if (!id) return "";
    return tipoOptions.find((t) => t.value === id)?.label || "";
  }, [tipoOptions]);

  const onSubmit: SubmitHandler<ProductoForm> = async (data) => {
    const payloadCreate: IProductoRequest = {
      codigo: data.codigo,
      nombre: data.nombre,
      descripcion: data.descripcion,
      activo: data.activo,
      CalidadId: data.calidad_id,
      TipoProduccionId: data.tipo_produccion_id,
    };
    const payloadUpdate: IProductoUpdate = {
      id: id || "",
      ...payloadCreate,
    };
    await asyncAction.execute(async () => id ? await ProductoService.actualizar(payloadUpdate) : await ProductoService.crear(payloadCreate));
  };

  const closeAcction = useCallback(() => {
    if (asyncAction.isSuccess && onSuccess && asyncAction.response?.data) { onSuccess(asyncAction.response.data as any, mode); }
    reset(defaultFormValues);
    setCalidadOptions([]);
    setTipoOptions([]);
    calidadesLoadedRef.current = false;
    tiposLoadedRef.current = false;
    close();
    asyncAction.reset();
  }, [asyncAction.isSuccess, onSuccess, mode, reset, close]);

  useEffect(() => {
    const loadData = async () => {
      if (!open) return;
      
     calidadesLoadedRef.current = false;
      tiposLoadedRef.current = false;
      setCalidadOptions([]);
      setTipoOptions([]);
      
      if (mode === "crear") {
        reset(defaultFormValues);
        setDataProducto(null);
        setErrorProducto(null);
        return;
      }
      if ((mode === "editar" || mode === "detalle") && id) {
        setLoadingProducto(true);
        setErrorProducto(null);
        
        try {
          const response = await ProductoService.obtenerPorId(getByIdProductoKey(id));
          setDataProducto(response);
          
          if (response.data) {
            const dto: any = response?.data || {};
            const calidadId = dto.calidad_id || dto.CalidadId || dto.calidadId || dto.calidad?.id;
            const tipoId = dto.tipo_produccion_id || dto.TipoProduccionId || dto.tipoProduccionId || dto.tipoProduccion?.id;
            
            const safe: ProductoForm = {
              codigo: String(dto.codigo ?? ""),
              nombre: String(dto.nombre ?? ""),
              descripcion: String(dto.descripcion ?? ""),
              activo: Boolean(dto.activo ?? true),
              calidad_id: String(calidadId ?? ""),
              tipo_produccion_id: String(tipoId ?? ""),
            };
            reset(safe);
          }
        } catch (error) {
          setErrorProducto("Error al cargar los datos");
          console.error("Error loading producto:", error);
        } finally {
          setLoadingProducto(false);
        }
      }
    };
    
    loadData();
  }, [open, mode, id, reset]);

  useEffect(() => {
    if (!open) {
      setDataProducto(null);
      setLoadingProducto(false);
      setErrorProducto(null);
      setCalidadOptions([]);
      setTipoOptions([]);
      calidadesLoadedRef.current = false;
      tiposLoadedRef.current = false;
      asyncAction.reset();
    }
  }, [open]);

  const values = watch();
  const calidadOptionsWithSelected = useMemo(() => {
    const inList = calidadOptions.some(o => o.value === values.calidad_id);
    if (values.calidad_id && !inList) {
      const label = getCalidadCodigo(values.calidad_id) || (dataProducto?.data ? (dataProducto.data as any)?.calidadCodigo : "");
      return [...calidadOptions, { value: values.calidad_id, label }];
    }
    return calidadOptions;
  }, [calidadOptions, values.calidad_id, getCalidadCodigo, dataProducto]);
  const tipoOptionsWithSelected = useMemo(() => {
    const inList = tipoOptions.some(o => o.value === values.tipo_produccion_id);
    if (values.tipo_produccion_id && !inList) {
      const label = getTipoCodigo(values.tipo_produccion_id) || (dataProducto?.data ? (dataProducto.data as any)?.tipoProduccionCodigo : "");
      return [...tipoOptions, { value: values.tipo_produccion_id, label }];
    }
    return tipoOptions;
  }, [tipoOptions, values.tipo_produccion_id, getTipoCodigo, dataProducto]);

  const renderContent = () => {
    if (loadingProducto) { 
      return (
        <div className="py-2">
          <Spinner labelPosition="above" label="Cargando datos" />
        </div>
      ); 
    }

    if (errorProducto) { 
      return <div className="py-2 text-red-500">Ocurrió un error al traer los datos.</div>; 
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
              <Label className="font-semibold text-gray-700">Calidad</Label>
              <Input 
                value={dataProducto?.data?.calidad?.codigo || "No encontrado"}
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
              <Label className="font-semibold text-gray-700">Tipo de Producción</Label>
              <Input 
                value={dataProducto?.data?.tipoProduccion?.codigo || "No encontrado"}
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

            {dataProducto?.data && (
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
                      value={dataProducto.data.creadoEl ? formatearFechaCompleta(dataProducto.data.creadoEl) : ""}
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
                  
                  {dataProducto.data.modificadoEl && dataProducto.data.modificadoEl !== dataProducto.data.creadoEl && (
                    <div className="flex flex-col gap-2">
                      <Label className="font-medium text-gray-600 flex items-center gap-2">
                        <Edit20Regular className="text-orange-500" />
                        Última Modificación
                      </Label>
                      <Input 
                        value={dataProducto.data.modificadoEl ? formatearFechaCompleta(dataProducto.data.modificadoEl) : ""}
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
    // Formulario para crear/editar
    return (
      <div className="py-2 flex flex-col gap-3">
        {/* Código */}
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

        {/* Nombre */}
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

        {/* Calidad */}
        <div className="flex flex-col justify-start w-full gap-0.5">
          <Controller
            name="calidad_id"
            control={control}
            rules={{ required: "Seleccione una calidad" }}
            render={({ field }) => (
              <AppCombobox
                label="Calidad"
                labelRequired
                size="medium"
                options={calidadOptionsWithSelected}
                value={field.value}
                grayBorder
                onChange={field.onChange}
                error={errors.calidad_id?.message}
                placeholder={loadingCalidades ? 'Cargando calidades...' : 'Seleccione una calidad'}
                onTriggerLoad={() => { if (!calidadesLoadedRef.current) fetchCalidadesIfNeeded(); }}
              />
            )}
          />
        </div>

        {/* Tipo de Producción */}
        <div className="flex flex-col justify-start w-full gap-0.5">
          <Controller
            name="tipo_produccion_id"
            control={control}
            rules={{ required: "Seleccione un tipo" }}
            render={({ field }) => (
              <AppCombobox
                label="Tipo de Producción"
                labelRequired
                size="medium"
                options={tipoOptionsWithSelected}
                value={field.value}
                grayBorder
                onChange={field.onChange}
                error={errors.tipo_produccion_id?.message}
                placeholder={loadingTipos ? 'Cargando tipos...' : 'Seleccione un tipo de producción'}
                onTriggerLoad={() => { if (!tiposLoadedRef.current) fetchTiposIfNeeded(); }}
              />
            )}
          />
        </div>

        {/* Descripción */}
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

        {/* Estado */}
        <div className="flex flex-col justify-start w-full gap-0.5">
          <Label>Estado</Label>
          <Controller
            name="activo"
            control={control}
            render={({ field }) => (
              <Switch
                checked={Boolean(field.value)}
                onChange={(e) => field.onChange(e.currentTarget.checked)}
                label={Boolean(field.value) ? "Activo" : "Inactivo"}
              />
            )}
          />
        </div>
      </div>
    );
  };

  return (
    <DrawerBase open={open} close={closeAcction} title={TITULOS_PANEL[mode]} buttonAction={mode !== "detalle" ? handleSubmit(onSubmit) : undefined} BtnAccion={mode !== "detalle" && !asyncAction.isLoading && !asyncAction.isSuccess} btnDetails={mode === "detalle"} drawerTypeModal={mode !== "detalle"} position="end" zise="medium">
      {mode !== "detalle" && asyncAction.isError && (
        <AsyncActionDisplay state={asyncAction.state} loadingMessage="" successMessage="" error={asyncAction.error} onErrorDismiss={() => asyncAction.resetError()} />
      )}
      {(mode === "detalle" || asyncAction.isFromInit || asyncAction.error) && renderContent()}
      {mode !== "detalle" && (asyncAction.isLoading || asyncAction.isSuccess) && (
        <AsyncActionDisplay state={asyncAction.state} loadingMessage={id ? "Actualizando producto..." : "Creando nuevo producto..."} successMessage={id ? asyncAction.response?.message ?? "Se actualizó correctamente el producto" : asyncAction.response?.message ?? "Se creó correctamente el producto"} onSuccess={() => { closeAcction(); }} loadingType="progress" />
      )}
    </DrawerBase>
  );
}
