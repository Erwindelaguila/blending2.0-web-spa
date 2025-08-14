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
import { getByIdTipoProduccionKey } from "@/lib/constants/key-fetch";
import { TipoProduccionService } from "@/services/tipo-produccion.service";
import { useAuth } from "@/hooks/use-auth";
import { BaseResponse } from "@/interface";
import { ITipoProduccionResponse, ITipoProduccionSend, ITipoProduccionUpdate } from "@/interface/admin/tipo-produccion";
import { AppCombobox } from "@/components/ui/app-combobox";
import { LineaProduccionService } from "@/services/linea-produccion.service";
import { AgregadoService } from "@/services/agregado.service";

const defaultFormValues: ITipoProduccionSend = { codigo: "", nombre: "", descripcion: "", activo: true, linea_produccion_id: "", agregado_id: "", creadoPorId: "" };

export function TipoProduccionPanel({ open, mode, id, close, onSuccess }: IDrawer) {
  const styles = useInputStyles();
  const asyncAction = useAsyncAction();
  const { user } = useAuth();

  const { register, handleSubmit, reset, watch, control, formState: { errors }, } = useForm<ITipoProduccionSend>({ defaultValues: defaultFormValues });

  const { data: dataTipo, isLoading: loadingTipo, error: errorTipo } = useSWR<BaseResponse<ITipoProduccionResponse>>(id != undefined ? getByIdTipoProduccionKey(id) : null, TipoProduccionService.obtenerPorId, { revalidateOnFocus: false, revalidateIfStale: true });

  const { data: lineasData } = useSWR("combo-lineas-produccion", () => LineaProduccionService.listar(1, 100));
  const { data: agregadosData } = useSWR("combo-agregados", () => AgregadoService.listar(1, 100));

  const lineaOptions = (lineasData?.data?.items || []).map(l => ({ value: l.id.toString(), label: l.codigo }));
  const agregadoOptions = (agregadosData?.data?.items || []).map(a => ({ value: a.id.toString(), label: a.codigo }));

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
      id: id ? Number(id) : 0,
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

  useEffect(() => { if (mode !== "crear" && dataTipo) { reset({ ...(dataTipo.data as any), creadoPorId: "" }); } else if (mode === "crear" && open) { reset(defaultFormValues); } }, [dataTipo, reset, mode, open]);

  const TITULOS_PANEL: Record<typeof mode, string> = { crear: "Nuevo Tipo de Producción", editar: "Editar Tipo de Producción", detalle: "Detalle de Tipo de Producción" };

  const renderContenidoSegunModo = () => {
    const values = watch();
    if (loadingTipo) { return (<div className="py-2"><Spinner labelPosition="above" label="Cargando datos" /></div>); }
    if (errorTipo) { return (<div className="py-2 text-red-500">Ocurrió un error al traer los datos.</div>); }
    if (mode === "detalle") { return (<div className="py-2 flex flex-col gap-3">
      <div><Label>Código</Label><p>{values.codigo}</p></div>
      <div><Label>Nombre</Label><p>{values.nombre}</p></div>
      <div><Label>Línea Producción</Label><p>{values.linea_produccion_id}</p></div>
      <div><Label>Agregado</Label><p>{values.agregado_id}</p></div>
      <div><Label>Descripción</Label><p>{values.descripcion || "-"}</p></div>
      <div><Label>Activo</Label><p>{values.activo ? "Sí" : "No"}</p></div>
    </div>); }
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
