import { DrawerBase } from "@/components/ui/drawe-base";
import { AsyncActionDisplay } from "@/components/ui/async-action-display";
import { useAsyncAction } from "@/hooks/use-async-action";
import { OrgColors } from "@/config/app.config.server";
import { IParametro, IParametroGet, IDrawer } from "@/interface";
import { useInputStyles } from "@/styles/input.styles";
import { ParametrosService } from "@/services/parametros.service";
import { Input, Label, Switch, Textarea, Spinner } from "@fluentui/react-components";
import { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import useSWR from "swr";
import { ParametroFechApi } from "@/services/parametro-service-api";
import { fetchGetParametrosId, getAllParametroKey } from "@/lib/constants/key-fetch";

const defaultFormValues: IParametro = {
  codigo: "",
  nombre: "",
  descripcion: "",
  activo: false,
};

export function PanelCrearParametros({ open, mode, id, close }: IDrawer) {
  const styles = useInputStyles();
  const asyncAction = useAsyncAction();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<IParametro>({
    defaultValues: defaultFormValues,
  });

  const {
    data: dataParametro,
    isLoading: loadingParametro,
    error: errorParametro,
  } = useSWR<IParametroGet>(
    id != undefined ? fetchGetParametrosId(id) : null,
    ParametroFechApi,
    {
      revalidateOnFocus: false,
      revalidateIfStale: true,
    }
  );

  const onSubmit: SubmitHandler<IParametro> = async (data) => {
    await asyncAction.execute(
      async () =>
        id ? ParametrosService.editar(id, data) : ParametrosService.crear(data),
      getAllParametroKey
    );
  };

  const closeAction = () => {
    reset(defaultFormValues);
    close();
    asyncAction.reset();
  };

  useEffect(() => {
    if (mode !== "crear" && dataParametro) {
      reset(dataParametro);
    } else if (mode === "crear" && open) {
      reset(defaultFormValues);
    }
  }, [dataParametro, reset, mode, open]);

  const TITULOS_PANEL: Record<typeof mode, string> = {
    crear: "Nuevo Parámetro",
    editar: "Editar Parámetro",
    detalle: "Detalle de Parámetro",
  };

  const renderContenidoSegunModo = () => {
    const values = watch();

    if (loadingParametro) {
      return (
        <div className="py-2">
          <Spinner labelPosition="above" label="Cargando datos" />
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
          <Label>Activo</Label>
          <Controller
            name="activo"
            control={control}
            render={({ field }) => (
              <Switch
                checked={field.value}
                onChange={(e) => field.onChange(e.currentTarget.checked)}
                label={field.value ? "Sí" : "No"}
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
      close={closeAction}
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
              id ? "Actualizando parámetro..." : "Creando nuevo parámetro..."
            }
            successMessage={
              id
                ? asyncAction.response?.message ??
                  "Se actualizó correctamente el parámetro"
                : asyncAction.response?.message ??
                  "Se creó correctamente el parámetro"
            }
            onSuccess={() => {
              closeAction();
            }}
            loadingType="progress"
          />
        )}
    </DrawerBase>
  );
}