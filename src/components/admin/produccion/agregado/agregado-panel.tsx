import { DrawerBase } from "@/components/ui/drawe-base";
import { AsyncActionDisplay } from "@/components/ui/async-action-display";
import { useAsyncAction } from "@/hooks/use-async-action";
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
import useSWR from "swr";
import { useEffect } from "react";
import {
  getAllAgregadoKey,
  getByIdAgregadoKey,
} from "@/lib/constants/key-fetch";
import { IAgregado, IAgregadoSend, IAgregadoUpdate } from "@/interface/admin/agregado";
import { AgregadoService } from "@/services/agregado.service";


const defaultFormValues: IAgregadoSend = {
  codigo: "",
  nombre: "",
  descripcion: "",
  activo: true,
  creadoPorId: "",
};

export function AgregadoPanel({ open, mode, id, close }: IDrawer) {
  const styles = useInputStyles();
  const asyncAction = useAsyncAction();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<IAgregadoSend>({
    defaultValues: defaultFormValues,
  });

  const {
    data: dataCalidad,
    isLoading: loadingCalidad,
    error: errorCalidad,
  } = useSWR<BaseResponse<IAgregado>>(
    id != undefined ? getByIdAgregadoKey(id) : null,
    AgregadoService.obtenerPorId,
    {
      revalidateOnFocus: false,
      revalidateIfStale: true,
    }
  );

  const onSubmit: SubmitHandler<IAgregadoSend> = async (data) => {

    const sendAgregado: IAgregadoSend = {
      ...data,
      creadoPorId: "a6f3d290-43a0-4b3f-a8e9-6d9a4c8d7d11", 
    }
  
    const sendUpdate: IAgregadoUpdate={
      ...data,
      modificadoPorId: "f13298c2-7e1a-4b88-90fa-cf6136b4098e", 
      id: id || "",
    }

    await asyncAction.execute(
      async () =>
        id ? AgregadoService.actualizar(sendUpdate) : AgregadoService.crear(sendAgregado),
      getAllAgregadoKey()
    );
    
  };

  const closeAcction = () => {
    reset(defaultFormValues);
    close();
    asyncAction.reset();
  };

  useEffect(() => {
    if (mode !== "crear" && dataCalidad) {
      reset(dataCalidad.data);
    } else if (mode === "crear" && open) {
      reset(defaultFormValues);
    }
  }, [dataCalidad, reset, mode, open]);

  const TITULOS_PANEL: Record<typeof mode, string> = {
    crear: "Nuevo Agregado",
    editar: "Editar Agregado",
    detalle: "Detalle de Agregado",
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
        <div className="py-2 flex flex-col gap-3">
          <div>
            <Label>Código</Label>
            <p>{values.codigo}</p>
          </div>
          <div>
            <Label>Nombre</Label>
            <p>{values.nombre}</p>
          </div>
          <div>
            <Label>Descripción</Label>
            <p>{values.descripcion || "-"}</p>
          </div>
          <div>
            <Label>Activo</Label>
            <p>{values.activo ? "Sí" : "No"}</p>
          </div>
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
