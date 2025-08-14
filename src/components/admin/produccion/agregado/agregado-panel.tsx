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
import { useEffect, useState } from "react";
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

export function AgregadoPanel({ open, mode, id, close, onSuccess }: IDrawer) {
  const styles = useInputStyles();
  const asyncAction = useAsyncAction();
  const { user } = useAuth();

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

  // Cargar datos directamente sin cache cuando sea necesario
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

  // useEffect 1: Cargar datos cuando se abre el panel en modo editar/detalle
  useEffect(() => {
    const loadData = async () => {
      if (!open) return;
      
      if (mode === "crear") {
        // Modo crear: resetear a valores por defecto
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
        
        // Cargar datos directamente sin cache
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

  // useEffect 2: Limpiar estado cuando se cierra el panel
  useEffect(() => {
    if (!open) {
      setDataAgregado(null);
      setLoadingAgregado(false);
      setErrorAgregado(null);
      asyncAction.reset();
    }
  }, [open]);

  const TITULOS_PANEL: Record<typeof mode, string> = {
    crear: "Nuevo Agregado",
    editar: "Editar Agregado",
    detalle: "Detalle de Agregado",
  };

  const renderContenidoSegunModo = () => {
    const values = watch();

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
