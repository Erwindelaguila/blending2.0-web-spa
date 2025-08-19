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
import { IPlantaResponse, IPlantaSend, IPlantaUpdate } from "@/interface/admin/planta";
import { PlantasService } from "@/services/plantas.service";
import { formatearFechaCompleta } from "@/utils/date";
import { 
  CalendarClock20Regular, 
  Edit20Regular, 
  Info20Regular 
} from "@fluentui/react-icons";
import useSWR, { mutate } from "swr";

const defaultFormValues: IPlantaSend = {
  codigo: "",
  nombre: "",
  descripcion: "",
  numeroRuma: 0,
  activo: true,
  creadoPorId: "",
};

export function PlantaPanel({ open, mode, id, close, onSuccess }: IDrawer) {
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
  } = useForm<IPlantaSend>({ defaultValues: defaultFormValues });

  const [isDataReady, setIsDataReady] = useState(false);

  // SWR para obtener datos cuando es edición o detalle
  const shouldFetch = open && (mode === "editar" || mode === "detalle") && id;
  const swrKey = shouldFetch ? `planta-${id}` : null;
  const { data: plantaData, isLoading: isLoadingPlanta } = useSWR<BaseResponse<IPlantaResponse>>(
    swrKey,
    () => PlantasService.obtenerPorId(id!),
    { 
      revalidateOnFocus: false,
      onSuccess: (data) => {
        if (data?.data) {
          const planta = data.data;
          setValue("codigo", planta.codigo);
          setValue("nombre", planta.nombre);
          setValue("descripcion", planta.descripcion);
          setValue("numeroRuma", planta.numeroRuma);
          setValue("activo", planta.activo);
          setIsDataReady(true);
        }
      }
    }
  );

  const plantaDetail = plantaData?.data;

  useEffect(() => {
    if (!open) {
      setIsDataReady(false);
      reset(defaultFormValues);
      asyncAction.reset();
    }
  }, [open, reset, asyncAction]);

  useEffect(() => {
    if (mode === "crear" && open) {
      setIsDataReady(true);
    }
  }, [mode, open]);

    const onSubmit: SubmitHandler<IPlantaSend> = async (data) => {
    if (!user?.id) {
      console.error("Usuario no autenticado o sin ID");
      return;
    }

    const plantaData: IPlantaSend = {
      ...data,
      creadoPorId: user.id,
    };

    await asyncAction.execute(async () => {
      if (mode === "crear") {
        const result = await PlantasService.crear(plantaData);
        return result;
      } else if (mode === "editar" && id) {
        const updateData: IPlantaUpdate = {
          ...data,
          id,
          modificadoPorId: user.id,
        };
        const result = await PlantasService.actualizar(updateData);
        return result;
      }
      throw new Error("Modo inválido");
    });
  };

  const closeAcction = () => {
    if (asyncAction.isSuccess && onSuccess && asyncAction.response?.data) {
      onSuccess(asyncAction.response.data as any, mode);
    }
    close();
  };

  const renderContenidoSegunModo = () => {
    const isViewing = mode === "detalle";
    const isCreating = mode === "crear";
    
    if (!isDataReady && (mode === "editar" || mode === "detalle")) {
      return (
        <div className="flex justify-center items-center h-64">
          <Spinner size="large" label="Cargando información de la planta..." />
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Código */}
          <div className="space-y-2">
            <Label htmlFor="codigo" className="text-sm font-medium text-gray-700">
              Código *
            </Label>
            <Input
              id="codigo"
              {...register("codigo", { 
                required: "El código es requerido",
                minLength: { value: 2, message: "Mínimo 2 caracteres" }
              })}
              readOnly={isViewing}
              className={styles.inputGrisBase}
              placeholder="Ingrese el código de la planta"
            />
            {errors.codigo && (
              <span className="text-sm text-red-600">{errors.codigo.message}</span>
            )}
          </div>

          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="nombre" className="text-sm font-medium text-gray-700">
              Nombre *
            </Label>
            <Input
              id="nombre"
              {...register("nombre", { 
                required: "El nombre es requerido",
                minLength: { value: 3, message: "Mínimo 3 caracteres" }
              })}
              readOnly={isViewing}
              className={styles.inputGrisBase}
              placeholder="Ingrese el nombre de la planta"
            />
            {errors.nombre && (
              <span className="text-sm text-red-600">{errors.nombre.message}</span>
            )}
          </div>

          {/* Número de Ruma */}
          <div className="space-y-2">
            <Label htmlFor="numeroRuma" className="text-sm font-medium text-gray-700">
              Número de Ruma *
            </Label>
            <Input
              id="numeroRuma"
              type="number"
              {...register("numeroRuma", { 
                required: "El número de ruma es requerido",
                min: { value: 1, message: "Debe ser mayor a 0" }
              })}
              readOnly={isViewing}
              className={styles.inputGrisBase}
              placeholder="Ingrese el número de ruma"
            />
            {errors.numeroRuma && (
              <span className="text-sm text-red-600">{errors.numeroRuma.message}</span>
            )}
          </div>

          {/* Estado */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Estado</Label>
            <div className="flex items-center space-x-2">
              <Controller
                name="activo"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onChange={(_, data) => field.onChange(data.checked)}
                    disabled={isViewing}
                  />
                )}
              />
              <span className="text-sm text-gray-600">
                {watch("activo") ? "Activo" : "Inactivo"}
              </span>
            </div>
          </div>
        </div>

        {/* Descripción */}
        <div className="space-y-2">
          <Label htmlFor="descripcion" className="text-sm font-medium text-gray-700">
            Descripción
          </Label>
          <Textarea
            id="descripcion"
            {...register("descripcion")}
            readOnly={isViewing}
            className={styles.inputGrisBase}
            placeholder="Ingrese una descripción opcional"
            rows={3}
          />
        </div>

        {/* Información de Auditoría - Solo en modo detalle */}
        {mode === "detalle" && plantaDetail && (
          <div className="border-t pt-6 space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Info20Regular className="text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">Información de Auditoría</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Fecha de Creación */}
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <CalendarClock20Regular style={{ color: OrgColors.azulOscuro }} />
                  <Label className="text-sm font-medium text-gray-700">Fecha de Creación</Label>
                </div>
                <Input
                  value={formatearFechaCompleta(plantaDetail.creadoEl)}
                  readOnly
                  className={styles.inputGrisBase}
                />
              </div>

              {/* Creado Por */}
              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-700">Creado Por</Label>
                <Input
                  value={plantaDetail.creadoPorId || "Sistema"}
                  readOnly
                  className={styles.inputGrisBase}
                />
              </div>

              {/* Fecha de Modificación */}
              {plantaDetail.modificadoEl && (
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Edit20Regular style={{ color: OrgColors.serotAmarillo }} />
                    <Label className="text-sm font-medium text-gray-700">Última Modificación</Label>
                  </div>
                  <Input
                    value={formatearFechaCompleta(plantaDetail.modificadoEl)}
                    readOnly
                    className={styles.inputGrisBase}
                  />
                </div>
              )}

              {/* Modificado Por */}
              {plantaDetail.modificadoPorId && (
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-700">Modificado Por</Label>
                  <Input
                    value={plantaDetail.modificadoPorId || "Sistema"}
                    readOnly
                    className={styles.inputGrisBase}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Botones de acción */}
        {!isViewing && (
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={close}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={asyncAction.isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {asyncAction.isLoading ? (
                <div className="flex items-center space-x-2">
                  <Spinner size="tiny" />
                  <span>{isCreating ? "Creando..." : "Actualizando..."}</span>
                </div>
              ) : (
                isCreating ? "Crear Planta" : "Actualizar Planta"
              )}
            </button>
          </div>
        )}

        {/* Estado de la acción asíncrona */}
        {asyncAction.isLoading && (
          <AsyncActionDisplay
            state={asyncAction.state}
            loadingMessage={isCreating ? "Creando planta..." : "Actualizando planta..."}
            successMessage=""
          />
        )}

        {asyncAction.error && (
          <AsyncActionDisplay
            state={asyncAction.state}
            loadingMessage=""
            successMessage=""
            error={asyncAction.error}
            onErrorDismiss={asyncAction.reset}
          />
        )}

        {asyncAction.isSuccess && (
          <AsyncActionDisplay
            state={asyncAction.state}
            loadingMessage=""
            successMessage={isCreating ? "Planta creada exitosamente" : "Planta actualizada exitosamente"}
            onSuccess={closeAcction}
          />
        )}
      </form>
    );
  };

  const TITULOS_PANEL = {
    crear: "Nueva Planta",
    editar: "Editar Planta", 
    detalle: "Detalle de Planta"
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

      {renderContenidoSegunModo()}
    </DrawerBase>
  );
}
