import { DrawerBase } from "@/components/ui/drawe-base";
import { AsyncActionDisplay } from "@/components/ui/async-action-display";
import { useAsyncAction } from "@/hooks/use-async-action";
import { OrgColors } from "@/config/app.config.server";
import { IDrawer } from "@/interface/components/drawer";
import { useInputStyles } from "@/styles/input.styles";
import { Input, Label, Spinner, Switch, Textarea } from "@fluentui/react-components";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import useSWR from "swr";
import { useEffect } from "react";
import { getByIdAgregadoKey, getByIdLineaProduccionKey, getByIdTipoProduccionKey } from "@/lib/constants/key-fetch";
import { TipoProduccionService } from "@/services/tipo-produccion.service";
import { useAuth } from "@/hooks/use-auth";
import { BaseResponse } from "@/interface";
import { ITipoProduccionResponse, ITipoProduccionSend, ITipoProduccionUpdate } from "@/interface/admin/tipo-produccion";
import { AppCombobox } from "@/components/ui/app-combobox";
import { LineaProduccionService } from "@/services/linea-produccion.service";
import { AgregadoService } from "@/services/agregado.service";
import { formatearFechaCompleta } from "@/utils/date";
import { 
  CalendarClock20Regular, 
  Edit20Regular, 
  Info20Regular 
} from "@fluentui/react-icons";

const defaultFormValues: ITipoProduccionSend = { codigo: "", nombre: "", descripcion: "", activo: true, linea_produccion_id: "", agregado_id: "", creadoPorId: "" };

export function TipoProduccionPanel({ open, mode, id, close, onSuccess }: IDrawer) {
  const styles = useInputStyles();
  const asyncAction = useAsyncAction();
  const { user } = useAuth();

  const { register, handleSubmit, reset, watch, control, formState: { errors }, } = useForm<ITipoProduccionSend>({ defaultValues: defaultFormValues });

  const { data: dataTipo, isLoading: loadingTipo, error: errorTipo } = useSWR<BaseResponse<ITipoProduccionResponse>>(id != undefined ? getByIdTipoProduccionKey(id) : null, TipoProduccionService.obtenerPorId, { revalidateOnFocus: false, revalidateIfStale: true });

  const { data: lineasData } = useSWR("combo-lineas-produccion", () => LineaProduccionService.listar(1, 100));
  const { data: agregadosData } = useSWR("combo-agregados", () => AgregadoService.listar(1, 100));
  // Fallbacks: cargar detalle de línea/agregado cuando hay id y label falta
  const lineaId = (watch().linea_produccion_id
    || (dataTipo?.data as any)?.linea_produccion_id
    || (dataTipo?.data as any)?.lineaProduccionId
    || (dataTipo?.data as any)?.LineaProduccionId
    || (dataTipo?.data as any)?.LineaProduccion?.Id
    || "").toString();
  const agregadoId = (watch().agregado_id
    || (dataTipo?.data as any)?.agregado_id
    || (dataTipo?.data as any)?.agregadoId
    || (dataTipo?.data as any)?.AgregadoId
    || (dataTipo?.data as any)?.Agregado?.Id
    || "").toString();
  const { data: lineaDet } = useSWR(lineaId ? getByIdLineaProduccionKey(lineaId) : null, (url: string) => LineaProduccionService.obtenerPorId(url));
  const { data: agregadoDet } = useSWR(agregadoId ? getByIdAgregadoKey(agregadoId) : null, (url: string) => AgregadoService.obtenerPorId(url));

  const lineaOptions = (lineasData?.data?.data || lineasData?.data?.items || []).map((l: any) => ({ 
    value: l.id?.toString() || "", 
    label: l.codigo || l.Codigo || "" 
  }));
  const agregadoOptions = (agregadosData?.data?.data || agregadosData?.data?.items || []).map((a: any) => ({ 
    value: a.id?.toString() || "", 
    label: a.codigo || a.Codigo || "" 
  }));

  const onSubmit: SubmitHandler<ITipoProduccionSend> = async (data) => {
    if (!user?.id) { console.error("Usuario no autenticado o sin ID"); return; }
    // Mapear a nombres esperados por backend (sin underscores, PascalCase)
    const payloadCreate: any = {
      codigo: data.codigo,
      nombre: data.nombre,
      descripcion: data.descripcion,
      activo: data.activo,
      LineaProduccionId: data.linea_produccion_id, // backend espera este nombre
      AgregadoId: data.agregado_id,
      creadoPorId: user.id,
    };
    const payloadUpdate: any = {
      id: id || "",
      codigo: data.codigo,
      nombre: data.nombre,
      descripcion: data.descripcion,
      activo: data.activo,
      LineaProduccionId: data.linea_produccion_id,
      AgregadoId: data.agregado_id,
      modificadoPorId: user.id,
    };
    await asyncAction.execute(async () => id ? await TipoProduccionService.actualizar(payloadUpdate) : await TipoProduccionService.crear(payloadCreate));
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
    if (mode !== "crear" && dataTipo) {
      const dto: any = dataTipo.data as any;
      // Garantizar que los IDs sean strings para que las búsquedas de label funcionen
      const safe = {
        ...dto,
        id: dto.id?.toString?.() || dto.id,
        linea_produccion_id: dto.linea_produccion_id?.toString?.() || dto.linea_produccion_id || "",
        agregado_id: dto.agregado_id?.toString?.() || dto.agregado_id || "",
        fechaCreacion: dto.fechaCreacion || dto.CreadoEl || dto.creadoEl || dto.CreadoAt,
        modificadoEl: (dto.modificadoEl || dto.ModificadoEl || dto.modificadoAt) as any,
      };
      reset({ ...safe, creadoPorId: dto.creadoPorId || dto.CreadoPorId || "" });
    } else if (mode === "crear" && open) {
      reset(defaultFormValues);
    }
  }, [dataTipo, reset, mode, open]);

  const TITULOS_PANEL: Record<typeof mode, string> = { crear: "Nuevo Tipo de Producción", editar: "Editar Tipo de Producción", detalle: "Detalle de Tipo de Producción" };

  const renderContenidoSegunModo = () => {
    const values = watch();
    if (loadingTipo) { return (<div className="py-2"><Spinner labelPosition="above" label="Cargando datos" /></div>); }
    if (errorTipo) { return (<div className="py-2 text-red-500">Ocurrió un error al traer los datos.</div>); }
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
                value={
                  lineaOptions.find((l: any) => l.value === values.linea_produccion_id)?.label
                  || (dataTipo?.data as any)?.LineaProduccion?.Codigo
                  || (lineaDet?.data as any)?.codigo
                  || (dataTipo?.data as any)?.lineaProduccion?.codigo
                  || values.linea_produccion_id
                  || ""
                }
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
                value={
                  agregadoOptions.find((a: any) => a.value === values.agregado_id)?.label
                  || (dataTipo?.data as any)?.Agregado?.Codigo
                  || (agregadoDet?.data as any)?.codigo
                  || (dataTipo?.data as any)?.agregado?.codigo
                  || values.agregado_id
                  || ""
                }
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
          
          {/* Información de auditoría */}
          {(() => {
            const creationDate: any = (dataTipo?.data as any)?.fechaCreacion ?? (values as any)?.fechaCreacion;
            const modifiedDate: any = (dataTipo?.data as any)?.modificadoEl ?? (values as any)?.modificadoEl;
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
                  <Input
                    value={formatearFechaCompleta(creationDate)}
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
                
                {modifiedDate && modifiedDate !== creationDate && (
                  <div className="flex flex-col gap-2">
                    <Label className="font-medium text-gray-600 flex items-center gap-2">
                      <Edit20Regular className="text-orange-500" />
                      Última Modificación
                    </Label>
                    <Input
                      value={formatearFechaCompleta(modifiedDate)}
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
            );
          })()}
        </div>
      );
    }
    return (<div className="py-2 flex flex-col gap-3">
      <div className="flex flex-col justify-start w-full gap-0.5"><Label required>Código</Label><Controller name="codigo" control={control} rules={{ required: "El código es requerido" }} render={({ field }) => (<Input {...field} className={styles.inputGrisBase} style={{ border: `2px solid ${OrgColors.serotGris}` }} />)} />{errors.codigo && (<span className="text-red-500">{errors.codigo.message}</span>)}</div>
      <div className="flex flex-col justify-start w-full gap-0.5"><Label required>Nombre</Label><Controller name="nombre" control={control} rules={{ required: "El nombre es requerido" }} render={({ field }) => (<Input {...field} className={styles.inputGrisBase} style={{ border: `2px solid ${OrgColors.serotGris}` }} />)} />{errors.nombre && (<span className="text-red-500">{errors.nombre.message}</span>)}</div>
      <div className="flex flex-col justify-start w-full gap-0.5"><Controller name="linea_produccion_id" control={control} rules={{ required: "Seleccione una línea" }} render={({ field }) => (<AppCombobox label="Línea Producción" labelRequired size="medium" options={lineaOptions} value={field.value} grayBorder onChange={field.onChange} error={errors.linea_produccion_id?.message} />)} /></div>
      <div className="flex flex-col justify-start w-full gap-0.5"><Controller name="agregado_id" control={control} rules={{ required: "Seleccione un agregado" }} render={({ field }) => (<AppCombobox label="Agregado" labelRequired size="medium" options={agregadoOptions} value={field.value} grayBorder onChange={field.onChange} error={errors.agregado_id?.message} />)} /></div>
      <div className="flex flex-col justify-start w-full gap-0.5"><Label>Descripción</Label><Textarea {...register("descripcion")} size="large" className={styles.inputGrisBase} style={{ height: "10rem", border: `2px solid ${OrgColors.serotGris}` }} />{errors.descripcion && (<span className="text-red-500">{errors.descripcion.message}</span>)}</div>
      <div className="flex flex-col justify-start w-full gap-0.5"><Label>Estado</Label><Controller name="activo" control={control} render={({ field }) => (<Switch checked={field.value} onChange={(e) => field.onChange(e.currentTarget.checked)} label={field.value ? "Activo" : "Inactivo"} />)} /></div>
    </div>);
  };

  return (<DrawerBase open={open} close={closeAcction} title={TITULOS_PANEL[mode]} buttonAction={mode !== "detalle" ? handleSubmit(onSubmit) : undefined} BtnAccion={mode !== "detalle" && !asyncAction.isLoading && !asyncAction.isSuccess} btnDetails={mode === "detalle"} drawerTypeModal={mode !== "detalle"} position="end" zise="medium">{mode !== "detalle" && asyncAction.isError && (<AsyncActionDisplay state={asyncAction.state} loadingMessage="" successMessage="" error={asyncAction.error} onErrorDismiss={() => asyncAction.resetError()} />)}{(mode === "detalle" || asyncAction.isFromInit || asyncAction.error) && renderContenidoSegunModo()}{mode !== "detalle" && (asyncAction.isLoading || asyncAction.isSuccess) && (<AsyncActionDisplay state={asyncAction.state} loadingMessage={id ? "Actualizando tipo de producción..." : "Creando nuevo tipo de producción..."} successMessage={id ? asyncAction.response?.message ?? "Se actualizó correctamente" : asyncAction.response?.message ?? "Se creó correctamente"} onSuccess={() => { closeAcction(); }} loadingType="progress" />)}</DrawerBase>);
}
