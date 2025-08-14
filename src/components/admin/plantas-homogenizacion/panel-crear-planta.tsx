import { DrawerBase } from "@/components/ui/drawe-base";
import { AsyncActionDisplay } from "@/components/ui/async-action-display";
import { useAsyncAction } from "@/hooks/use-async-action";
import { OrgColors } from "@/config/app.config.server";
import { IDrawer } from "@/interface";
import { useInputStyles } from "@/styles/input.styles";
import { PlantasService } from "@/services/plantas.service";
import { Input, Label, Switch, Textarea, Spinner } from "@fluentui/react-components";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import useSWR from "swr";
import { getAllPlantaKey, fetchGetPlantasId } from "@/lib/constants/key-fetch";
import { IPlantaSend, IPlantaUpdate, IPlantaResponse } from "@/interface/admin/planta";
import { BaseResponse } from "@/interface";

const defaultFormValues: IPlantaSend = { codigo: "", nombre: "", descripcion: "", numeroRuma: 1, activo: true, creadoPorId: "" };

export function PanelCrearPlanta({ open, mode, id, close, onSuccess }: IDrawer) {
  const styles = useInputStyles();
  const asyncAction = useAsyncAction();
  const { user } = useAuth();

  const { register, handleSubmit, reset, watch, control, formState: { errors } } = useForm<IPlantaSend>({ defaultValues: defaultFormValues });

  const { data: dataPlanta, isLoading: loadingPlanta, error: errorPlanta } = useSWR<BaseResponse<IPlantaResponse>>(id ? fetchGetPlantasId(id) : null, PlantasService.obtenerPorId, { revalidateOnFocus: false, revalidateIfStale: true });

  const onSubmit: SubmitHandler<IPlantaSend> = async (data) => {
    if (!user?.id) return;
    const sendCreate: IPlantaSend = { ...data, creadoPorId: user.id };
    const sendUpdate: IPlantaUpdate = { ...data, id: id || "", modificadoPorId: user.id };
    await asyncAction.execute(async () => id ? PlantasService.actualizar(sendUpdate) : PlantasService.crear(sendCreate));
  };

  const closeAction = () => {
    if (asyncAction.isSuccess && onSuccess && asyncAction.response?.data) {
      onSuccess(asyncAction.response.data as any, mode);
    }
    reset({ ...defaultFormValues, creadoPorId: "" });
    close();
    asyncAction.reset();
  };

  useEffect(() => {
    if (mode !== "crear" && dataPlanta?.data) {
      const d = dataPlanta.data;
      reset({ codigo: d.codigo, nombre: d.nombre, descripcion: d.descripcion, numeroRuma: d.numeroRuma, activo: d.activo, creadoPorId: user?.id || "" });
    } else if (mode === "crear" && open) {
      reset({ ...defaultFormValues, creadoPorId: user?.id || "" });
    }
  }, [dataPlanta, reset, mode, open, user?.id]);

  const TITULOS_PANEL: Record<typeof mode, string> = { crear: "Nueva Planta", editar: "Editar Planta", detalle: "Detalle de Planta" };

  const renderContenidoSegunModo = () => {
    const values = watch();
    if (loadingPlanta) return <div className="py-2"><Spinner labelPosition="above" label="Cargando datos" /></div>;
    if (errorPlanta) return <div className="py-2 text-red-500">Ocurrió un error al traer los datos.</div>;
    if (mode === "detalle") return (
      <div className="py-2 flex flex-col gap-3">
        <div><Label>Código</Label><p>{values.codigo || "-"}</p></div>
        <div><Label>Nombre</Label><p>{values.nombre || "-"}</p></div>
        <div><Label>Descripción</Label><p>{values.descripcion || "-"}</p></div>
        <div><Label>Número de Ruma</Label><p>{values.numeroRuma || "-"}</p></div>
        <div><Label>Activo</Label><p>{values.activo ? "Sí" : "No"}</p></div>
      </div>
    );
    return (
      <div className="py-2 flex flex-col gap-3">
        <div className="flex flex-col gap-0.5"><Label required>Código</Label><Controller name="codigo" control={control} rules={{ required: "El código es requerido" }} render={({ field }) => (<Input {...field} className={styles.inputGrisBase} style={{ border: `2px solid ${OrgColors.serotGris}` }} />)} />{errors.codigo && <span className="text-red-500">{errors.codigo.message}</span>}</div>
        <div className="flex flex-col gap-0.5"><Label required>Nombre</Label><Controller name="nombre" control={control} rules={{ required: "El nombre es requerido" }} render={({ field }) => (<Input {...field} className={styles.inputGrisBase} style={{ border: `2px solid ${OrgColors.serotGris}` }} />)} />{errors.nombre && <span className="text-red-500">{errors.nombre.message}</span>}</div>
        <div className="flex flex-col gap-0.5"><Label>Descripción</Label><Textarea {...register("descripcion")} size="large" className={styles.inputGrisBase} style={{ height: "10rem", border: `2px solid ${OrgColors.serotGris}` }} />{errors.descripcion && <span className="text-red-500">{errors.descripcion.message}</span>}</div>
        <div className="flex flex-col gap-0.5"><Label required>Número de Ruma</Label><Controller name="numeroRuma" control={control} rules={{ required: "El número de ruma es requerido", min: { value: 1, message: "Debe ser mayor a 0" } }} render={({ field }) => (<Input value={field.value?.toString() || ""} type="number" min="1" className={styles.inputGrisBase} style={{ border: `2px solid ${OrgColors.serotGris}` }} onChange={(_, data) => { const value = Number(data.value); if (value >= 0) field.onChange(value || 1); }} />)} />{errors.numeroRuma && <span className="text-red-500">{errors.numeroRuma.message}</span>}</div>
        <div className="flex flex-col gap-0.5"><Label>Activo</Label><Controller name="activo" control={control} render={({ field }) => (<Switch checked={field.value} onChange={(e) => field.onChange(e.currentTarget.checked)} label={field.value ? "Sí" : "No"} />)} /></div>
      </div>
    );
  };

  return (
    <DrawerBase open={open} close={closeAction} title={TITULOS_PANEL[mode]} buttonAction={mode !== "detalle" ? handleSubmit(onSubmit) : undefined} BtnAccion={mode !== "detalle" && !asyncAction.isLoading && !asyncAction.isSuccess} btnDetails={mode === "detalle"} drawerTypeModal={mode !== "detalle"} position="end" zise="medium" >
      {mode !== "detalle" && asyncAction.isError && (<AsyncActionDisplay state={asyncAction.state} loadingMessage="" successMessage="" error={asyncAction.error} onErrorDismiss={() => asyncAction.resetError()} />)}
      {(mode === "detalle" || asyncAction.isFromInit || asyncAction.error) && renderContenidoSegunModo()}
      {mode !== "detalle" && (asyncAction.isLoading || asyncAction.isSuccess) && (<AsyncActionDisplay state={asyncAction.state} loadingMessage={id ? "Actualizando planta..." : "Creando nueva planta..."} successMessage={id ? asyncAction.response?.message ?? "Se actualizó correctamente la planta" : asyncAction.response?.message ?? "Se creó correctamente la planta"} onSuccess={() => { closeAction(); }} loadingType="progress" />)}
    </DrawerBase>
  );
}
