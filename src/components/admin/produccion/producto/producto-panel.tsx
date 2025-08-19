import { DrawerBase } from "@/components/ui/drawe-base";
import { AsyncActionDisplay } from "@/components/ui/async-action-display";
import { useAsyncAction } from "@/hooks/use-async-action";
import { useAuth } from "@/hooks/use-auth";
import { OrgColors } from "@/config/app.config.server";
import { BaseResponse, IDrawer } from "@/interface";
import { useInputStyles } from "@/styles/input.styles";
import { Input, Label, Spinner, Switch, Textarea } from "@fluentui/react-components";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { getByIdProductoKey, getAllProductoKey, getByIdTipoProduccionKey, getByIdCalidadKey } from "@/lib/constants/key-fetch";
import { IProductoResponse, IProductoSend, IProductoUpdate } from "@/interface/admin/producto";
import { ProductoService } from "@/services/producto.service";
import { formatearFechaCompleta } from "@/utils/date";
import { CalendarClock20Regular, Edit20Regular, Info20Regular } from "@fluentui/react-icons";
import { AppCombobox } from "@/components/ui/app-combobox";
import useSWR from "swr";
import { CalidadesService } from "@/services/calidades.service";
import { TipoProduccionService } from "@/services/tipo-produccion.service";

const defaultFormValues: IProductoSend = { codigo: "", nombre: "", descripcion: "", activo: true, calidad_id: "", tipo_produccion_id: "", creadoPorId: "" };

export function ProductoPanel({ open, mode, id, close, onSuccess }: IDrawer) {
  const styles = useInputStyles();
  const asyncAction = useAsyncAction();
  const { user } = useAuth();

  const { register, handleSubmit, reset, watch, control, formState: { errors }, } = useForm<IProductoSend>({ defaultValues: defaultFormValues });

  // Carga manual del detalle (misma lógica que AgregadoPanel)
  const [dataProducto, setDataProducto] = useState<BaseResponse<IProductoResponse> | null>(null);
  const [loadingProducto, setLoadingProducto] = useState(false);
  const [errorProducto, setErrorProducto] = useState<string | null>(null);

  const { data: calidadesData } = useSWR("combo-calidades", () => CalidadesService.listar(1, 100));
  const { data: tiposData } = useSWR("combo-tipos", () => TipoProduccionService.listar(1, 100));

  const calidadId = (watch().calidad_id || (dataProducto?.data as any)?.calidad_id || (dataProducto?.data as any)?.CalidadId || (dataProducto?.data as any)?.calidadId || "").toString();
  const tipoId = (watch().tipo_produccion_id || (dataProducto?.data as any)?.tipo_produccion_id || (dataProducto?.data as any)?.TipoProduccionId || (dataProducto?.data as any)?.tipoProduccionId || "").toString();
  const { data: calidadDet } = useSWR(calidadId ? getByIdCalidadKey(calidadId) : null, (url: string) => CalidadesService.obtenerPorId(url));
  const { data: tipoDet } = useSWR(tipoId ? getByIdTipoProduccionKey(tipoId) : null, (url: string) => TipoProduccionService.obtenerPorId(url));

  const calidadOptions = (calidadesData?.data?.data || calidadesData?.data?.items || []).map((c: any) => ({ value: c.id?.toString() || "", label: c.codigo || c.Codigo || "" }));
  const tipoOptions = (tiposData?.data?.data || tiposData?.data?.items || []).map((t: any) => ({ value: t.id?.toString() || "", label: t.codigo || t.Codigo || "" }));

  const onSubmit: SubmitHandler<IProductoSend> = async (data) => {
    if (!user?.id) { console.error("Usuario no autenticado o sin ID"); return; }
    const payloadCreate: any = { codigo: data.codigo, nombre: data.nombre, descripcion: data.descripcion, activo: data.activo, CalidadId: data.calidad_id, TipoProduccionId: data.tipo_produccion_id, creadoPorId: user.id };
    const payloadUpdate: any = { id: id || "", codigo: data.codigo, nombre: data.nombre, descripcion: data.descripcion, activo: data.activo, CalidadId: data.calidad_id, TipoProduccionId: data.tipo_produccion_id, modificadoPorId: user.id };
    await asyncAction.execute(async () => id ? await ProductoService.actualizar(payloadUpdate) : await ProductoService.crear(payloadCreate));
  };

  const closeAcction = () => {
    if (asyncAction.isSuccess && onSuccess && asyncAction.response?.data) { onSuccess(asyncAction.response.data as any, mode); }
    reset(defaultFormValues);
    close();
    asyncAction.reset();
  };

  // Cargar datos al abrir (editar/detalle) igual que en Agregado
  useEffect(() => {
    const load = async () => {
      if (!open) return;
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
          const resp = await ProductoService.obtenerPorIdById(id);
          setDataProducto(resp);
          const dto: any = resp?.data || {};
          // Normalizar valores para que todos los inputs sean controlados desde el inicio
          const safe: IProductoSend = {
            codigo: dto.codigo ?? "",
            nombre: dto.nombre ?? "",
            descripcion: dto.descripcion ?? "",
            activo: dto.activo ?? true,
            calidad_id: (dto.calidad_id?.toString?.() || dto.calidad_id || dto.CalidadId || "") as string,
            tipo_produccion_id: (dto.tipo_produccion_id?.toString?.() || dto.tipo_produccion_id || dto.TipoProduccionId || "") as string,
            creadoPorId: dto.creadoPorId || dto.CreadoPorId || "",
          };
          reset(safe);
        } catch (e) {
          console.error("Error loading producto:", e);
          setErrorProducto("Error al cargar los datos");
        } finally {
          setLoadingProducto(false);
        }
      }
    };
    load();
  }, [open, mode, id, reset]);

  // Limpiar al cerrar
  useEffect(() => {
    if (!open) {
      setDataProducto(null);
      setLoadingProducto(false);
      setErrorProducto(null);
      asyncAction.reset();
    }
  }, [open]);

  const TITULOS_PANEL: Record<typeof mode, string> = { crear: "Nuevo Producto", editar: "Editar Producto", detalle: "Detalle de Producto" };

  const renderContenidoSegunModo = () => {
    const values = watch();
  if (loadingProducto) { return (<div className="py-2"><Spinner labelPosition="above" label="Cargando datos" /></div>); }
  if (errorProducto) { return (<div className="py-2 text-red-500">Ocurrió un error al traer los datos.</div>); }
    if (mode === "detalle") {
      return (
        <div className="py-4 space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label className="font-semibold text-gray-700">Código</Label>
              <Input value={values.codigo || ""} readOnly className={styles.inputGrisBase} style={{ border: `2px solid ${OrgColors.serotGris}`, backgroundColor: "#f8f9fa", color: "#495057", fontWeight: "500" }} />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="font-semibold text-gray-700">Nombre</Label>
              <Input value={values.nombre || ""} readOnly className={styles.inputGrisBase} style={{ border: `2px solid ${OrgColors.serotGris}`, backgroundColor: "#f8f9fa", color: "#495057", fontWeight: "500" }} />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="font-semibold text-gray-700">Calidad</Label>
              <Input value={calidadOptions.find((c: any) => c.value === values.calidad_id)?.label || (calidadDet?.data as any)?.codigo || values.calidad_id || ""} readOnly className={styles.inputGrisBase} style={{ border: `2px solid ${OrgColors.serotGris}`, backgroundColor: "#f8f9fa", color: "#495057", fontWeight: "500" }} />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="font-semibold text-gray-700">Tipo de Producción</Label>
              <Input value={tipoOptions.find((t: any) => t.value === values.tipo_produccion_id)?.label || (tipoDet?.data as any)?.codigo || values.tipo_produccion_id || ""} readOnly className={styles.inputGrisBase} style={{ border: `2px solid ${OrgColors.serotGris}`, backgroundColor: "#f8f9fa", color: "#495057", fontWeight: "500" }} />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="font-semibold text-gray-700">Descripción</Label>
              <Textarea value={values.descripcion || "Sin descripción"} readOnly className={styles.inputGrisBase} style={{ border: `2px solid ${OrgColors.serotGris}`, backgroundColor: "#f8f9fa", color: "#495057", minHeight: "80px", resize: "none" }} />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="font-semibold text-gray-700">Estado</Label>
              <div className="flex items-center">
                <Input value={values.activo ? "Activo" : "Inactivo"} readOnly className={styles.inputGrisBase} style={{ border: `2px solid ${values.activo ? "#28a745" : "#dc3545"}`, backgroundColor: values.activo ? "#d4edda" : "#f8d7da", color: values.activo ? "#155724" : "#721c24", fontWeight: "500", width: "100px", textAlign: "center" }} />
              </div>
            </div>
          </div>
          {(() => {
            const creationDate: any = (dataProducto?.data as any)?.fechaCreacion ?? (values as any)?.fechaCreacion;
            const modifiedDate: any = (dataProducto?.data as any)?.modificadoEl ?? (values as any)?.modificadoEl;
            if (!creationDate) return null;
            return (
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
                    <Input value={formatearFechaCompleta(creationDate)} readOnly className={styles.inputGrisBase} style={{ border: `2px solid #e3f2fd`, backgroundColor: "#f3f8ff", color: "#1976d2", fontWeight: "500", fontSize: "14px" }} />
                  </div>
                  {modifiedDate && modifiedDate !== creationDate && (
                    <div className="flex flex-col gap-2">
                      <Label className="font-medium text-gray-600 flex items-center gap-2">
                        <Edit20Regular className="text-orange-500" />
                        Última Modificación
                      </Label>
                      <Input value={formatearFechaCompleta(modifiedDate)} readOnly className={styles.inputGrisBase} style={{ border: `2px solid #fff3e0`, backgroundColor: "#fffaf5", color: "#f57c00", fontWeight: "500", fontSize: "14px" }} />
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      );
    }
    return (
      <div className="py-2 flex flex-col gap-3">
        <div className="flex flex-col justify-start w-full gap-0.5"><Label required>Código</Label><Controller name="codigo" control={control} rules={{ required: "El código es requerido" }} render={({ field }) => (<Input {...field} className={styles.inputGrisBase} style={{ border: `2px solid ${OrgColors.serotGris}` }} />)} />{errors.codigo && (<span className="text-red-500">{errors.codigo.message}</span>)}</div>
        <div className="flex flex-col justify-start w-full gap-0.5"><Label required>Nombre</Label><Controller name="nombre" control={control} rules={{ required: "El nombre es requerido" }} render={({ field }) => (<Input {...field} className={styles.inputGrisBase} style={{ border: `2px solid ${OrgColors.serotGris}` }} />)} />{errors.nombre && (<span className="text-red-500">{errors.nombre.message}</span>)}</div>
        <div className="flex flex-col justify-start w-full gap-0.5"><Controller name="calidad_id" control={control} rules={{ required: "Seleccione una calidad" }} render={({ field }) => (<AppCombobox label="Calidad" labelRequired size="medium" options={calidadOptions} value={field.value} grayBorder onChange={field.onChange} error={errors.calidad_id?.message} />)} /></div>
        <div className="flex flex-col justify-start w-full gap-0.5"><Controller name="tipo_produccion_id" control={control} rules={{ required: "Seleccione un tipo" }} render={({ field }) => (<AppCombobox label="Tipo de Producción" labelRequired size="medium" options={tipoOptions} value={field.value} grayBorder onChange={field.onChange} error={errors.tipo_produccion_id?.message} />)} /></div>
        <div className="flex flex-col justify-start w-full gap-0.5"><Label>Descripción</Label><Textarea {...register("descripcion")} size="large" className={styles.inputGrisBase} style={{ height: "10rem", border: `2px solid ${OrgColors.serotGris}` }} />{errors.descripcion && (<span className="text-red-500">{errors.descripcion.message}</span>)}</div>
  <div className="flex flex-col justify-start w-full gap-0.5"><Label>Estado</Label><Controller name="activo" control={control} render={({ field }) => (<Switch checked={Boolean(field.value)} onChange={(e) => field.onChange(e.currentTarget.checked)} label={Boolean(field.value) ? "Activo" : "Inactivo"} />)} /></div>
      </div>
    );
  };

  return (
    <DrawerBase open={open} close={closeAcction} title={TITULOS_PANEL[mode]} buttonAction={mode !== "detalle" ? handleSubmit(onSubmit) : undefined} BtnAccion={mode !== "detalle" && !asyncAction.isLoading && !asyncAction.isSuccess} btnDetails={mode === "detalle"} drawerTypeModal={mode !== "detalle"} position="end" zise="medium">
      {mode !== "detalle" && asyncAction.isError && (
        <AsyncActionDisplay state={asyncAction.state} loadingMessage="" successMessage="" error={asyncAction.error} onErrorDismiss={() => asyncAction.resetError()} />
      )}
      {(mode === "detalle" || asyncAction.isFromInit || asyncAction.error) && renderContenidoSegunModo()}
      {mode !== "detalle" && (asyncAction.isLoading || asyncAction.isSuccess) && (
        <AsyncActionDisplay state={asyncAction.state} loadingMessage={id ? "Actualizando producto..." : "Creando nuevo producto..."} successMessage={id ? asyncAction.response?.message ?? "Se actualizó correctamente el producto" : asyncAction.response?.message ?? "Se creó correctamente el producto"} onSuccess={() => { closeAcction(); }} loadingType="progress" />
      )}
    </DrawerBase>
  );
}
