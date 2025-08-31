"use client";

import { DrawerBase } from "@/components/ui/drawe-base";
import { AsyncActionDisplay } from "@/components/ui/async-action-display";
import { useAsyncAction } from "@/hooks/use-async-action";
import { useInputStyles } from "@/styles/input.styles";
import { OrgColors } from "@/config/app.config.server";
import { BaseResponse } from "@/interface/api/base-response";
import { Input, Label, Switch, Textarea, Spinner, Tooltip } from "@fluentui/react-components";
import { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { AppParamService } from '@/services/app-param.service';
import { IAppParam, IAppParamCreateRequest, IAppParamUpdateRequest } from '@/interface/admin/app-param';
import { mutate } from 'swr';

interface IAppParamForm {
  paramKey: string;
  value: string;
  description: string;
}

interface IAppParamPanelProps {
  open: boolean;
  close: () => void;
  editData?: IAppParam | null;
  onSuccess?: () => void;
}

export function AppParamPanel({
  open,
  close,
  editData,
  onSuccess,
}: IAppParamPanelProps) {
  const styles = useInputStyles();
  const asyncAction = useAsyncAction();
  const [isActive, setIsActive] = useState(true);
  
  const [dataAppParam, setDataAppParam] = useState<BaseResponse<IAppParam> | null>(null);
  const [loadingAppParam, setLoadingAppParam] = useState(false);
  const [errorAppParam, setErrorAppParam] = useState<string | null>(null);

  const isEdit = Boolean(editData);
  const title = isEdit ? "Editar Configuración de la Aplicación" : "Nueva Configuración de la Aplicación";

  const fieldValidations = dataAppParam?.data ? {
    key: {
      disabled: dataAppParam.data.isInternal,
      required: true,
      tooltip: dataAppParam.data.isInternal ? "Este parámetro del sistema no puede modificar su clave" : ""
    },
    value: {
      disabled: false,
      required: true
    },
    description: {
      disabled: false,
      required: false
    },
    isActive: {
      disabled: dataAppParam.data.isDisableable,
      tooltip: dataAppParam.data.isDisableable ? "Este parámetro no puede ser desactivado" : ""
    }
  } : {
    key: { disabled: false, required: true, tooltip: "" },
    value: { disabled: false, required: true },
    description: { disabled: false, required: false },
    isActive: { disabled: false, tooltip: "" }
  };

  const { reset, setError, clearErrors, formState: { errors } } = useForm<IAppParamForm>({
    defaultValues: { paramKey: "", value: "", description: "" }
  });

  const [formValues, setFormValues] = useState<IAppParamForm>({ 
    paramKey: "", 
    value: "", 
    description: "" 
  });

  const updateForm = (data: Partial<IAppParamForm>) => {
    setFormValues(prev => ({ ...prev, ...data }));
  };

  useEffect(() => {
    const loadData = async () => {
      if (!open) return;
      
      if (!isEdit) {
        const empty = { paramKey: "", value: "", description: "" };
        reset(empty);
        setFormValues(empty);
        setDataAppParam(null);
        setErrorAppParam(null);
        setIsActive(true);
        return;
      }
      
      if (isEdit && editData) {
        setLoadingAppParam(true);
        setErrorAppParam(null);
        
        try {
          const response = await AppParamService.obtenerPorKey(editData.key);
          setDataAppParam(response);
          if (response.data) {
            const loaded = {
              paramKey: response.data.key,
              value: response.data.value,
              description: response.data.description || "",
            };
            reset(loaded);
            setFormValues(loaded);
            setIsActive(response.data.isActive);
          }
        } catch (error) {
          setErrorAppParam("Error al cargar los datos");
          console.error("Error loading app param:", error);
        } finally {
          setLoadingAppParam(false);
        }
      }
    };

    loadData();
  }, [open, isEdit, editData, reset]);

  useEffect(() => {
    if (!open) {
      setDataAppParam(null);
      setLoadingAppParam(false);
      setErrorAppParam(null);
      asyncAction.reset();
    }
  }, [open, asyncAction]);

  const onSubmit = async () => {
    clearErrors();
    let invalid = false;
    
    if (!formValues.paramKey.trim()) { 
      setError("paramKey" as any, { type: "required", message: "El código es requerido" }); 
      invalid = true; 
    } else if (formValues.paramKey.length > 100) { 
      setError("paramKey" as any, { type: "maxLength", message: "El código no puede exceder 100 caracteres" }); 
      invalid = true; 
    }
    
    if (!formValues.value.trim()) { 
      setError("value" as any, { type: "required", message: "El valor es requerido" }); 
      invalid = true; 
    } else if (formValues.value.length > 250) { 
      setError("value" as any, { type: "maxLength", message: "El valor no puede exceder 250 caracteres" }); 
      invalid = true; 
    }
    
    if (formValues.description.length > 150) { 
      setError("description" as any, { type: "maxLength", message: "La descripción no puede exceder 150 caracteres" }); 
      invalid = true; 
    }
    
    if (invalid) return;

    try {
      if (isEdit && dataAppParam?.data && editData) {
        const updateData: any = {
          value: formValues.value.trim(),
          description: formValues.description.trim() || undefined,
          isActive,
        };
        
        const originalKey = editData.key;
        const newKey = formValues.paramKey.trim();
        if (newKey !== originalKey) {
          updateData.key = newKey; 
        }
        
        await asyncAction.execute(async () => AppParamService.actualizar(originalKey, updateData));
      } else {
        const createData: IAppParamCreateRequest = {
          key: formValues.paramKey.trim(),
          value: formValues.value.trim(),
          description: formValues.description.trim() || undefined,
          isActive: isActive,
        };
        await asyncAction.execute(async () => AppParamService.crear(createData));
      }
    } catch (error) {
      console.error('Error en operación AppParam:', error);
    }
  };

  const handleClose = () => {
    if (asyncAction.isSuccess && onSuccess) {
      onSuccess();
    }
    asyncAction.reset();
    reset();
    setFormValues({ paramKey: "", value: "", description: "" });
    setIsActive(true);
    close();
  };

  const onChangeSwitch = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
    setIsActive(ev.currentTarget.checked);
  }, []);

  return (
    <DrawerBase
      open={open}
      close={handleClose}
      title={title}
      buttonAction={!asyncAction.isLoading && !asyncAction.isSuccess ? onSubmit : undefined}
      position="end"
      zise="medium"
      BtnAccion={!asyncAction.isLoading && !asyncAction.isSuccess}
      drawerTypeModal={true}
    >
      {asyncAction.state === "error" && (
        <AsyncActionDisplay
          state={asyncAction.state}
          loadingMessage=""
          successMessage=""
          error={asyncAction.error}
          onErrorDismiss={asyncAction.reset}
        />
      )}
      
      {loadingAppParam ? (
        <div className="py-6 text-center">
          <Spinner labelPosition="above" label="Cargando datos..." />
        </div>
      ) : (asyncAction.state === "init" || asyncAction.state === "error") && (!isEdit || dataAppParam) ? (
        <div className="py-2 flex flex-col gap-3">
          {/* Código */}
          <div className="flex flex-col justify-start w-full gap-0.5">
            <Label required={fieldValidations.key.required}>Código</Label>
            {fieldValidations.key.tooltip ? (
              <Tooltip content={fieldValidations.key.tooltip} relationship="label">
                <Input
                  value={formValues.paramKey}
                  onChange={(_, data) => {
                    const v = data.value;
                    updateForm({ paramKey: v });
                    if (!v) {
                      setError("paramKey" as any, { type: "required", message: "El código es requerido" });
                    } else {
                      clearErrors("paramKey" as any);
                    }
                    if (v.length > 100) {
                      setError("paramKey" as any, { type: "maxLength", message: "El código no puede exceder 100 caracteres" });
                    }
                  }}
                  className={styles.inputGrisBase}
                  style={{ border: `2px solid ${OrgColors.serotGris}` }}
                  disabled={fieldValidations.key.disabled}
                />
              </Tooltip>
            ) : (
              <Input
                value={formValues.paramKey}
                onChange={(_, data) => {
                  const v = data.value;
                  updateForm({ paramKey: v });
                  if (!v) {
                    setError("paramKey" as any, { type: "required", message: "El código es requerido" });
                  } else {
                    clearErrors("paramKey" as any);
                  }
                  if (v.length > 100) {
                    setError("paramKey" as any, { type: "maxLength", message: "El código no puede exceder 100 caracteres" });
                  }
                }}
                className={styles.inputGrisBase}
                style={{ border: `2px solid ${OrgColors.serotGris}` }}
                disabled={fieldValidations.key.disabled}
              />
            )}
            {errors.paramKey && (
              <span className="text-red-500">{errors.paramKey.message}</span>
            )}
          </div>

          {/* Valor */}
          <div className="flex flex-col justify-start w-full gap-0.5">
            <Label required={fieldValidations.value.required}>Valor</Label>
            <Input
              value={formValues.value}
              onChange={(_, data) => {
                const v = data.value;
                updateForm({ value: v });
                if (!v) {
                  setError("value" as any, { type: "required", message: "El valor es requerido" });
                } else {
                  clearErrors("value" as any);
                }
                if (v.length > 250) {
                  setError("value" as any, { type: "maxLength", message: "El valor no puede exceder 250 caracteres" });
                }
              }}
              className={styles.inputGrisBase}
              style={{ border: `2px solid ${OrgColors.serotGris}` }}
              disabled={fieldValidations.value.disabled}
            />
            {errors.value && (
              <span className="text-red-500">{errors.value.message}</span>
            )}
          </div>

          {/* Descripción */}
          <div className="flex flex-col justify-start w-full gap-0.5">
            <Label>Descripción</Label>
            <Textarea
              value={formValues.description}
              onChange={(_, data) => {
                const v = data.value;
                updateForm({ description: v });
                if (v.length > 150) {
                  setError("description" as any, { type: "maxLength", message: "La descripción no puede exceder 150 caracteres" });
                } else {
                  clearErrors("description" as any);
                }
              }}
              size="large"
              className={styles.inputGrisBase}
              style={{ height: "10rem", border: `2px solid ${OrgColors.serotGris}` }}
              disabled={fieldValidations.description.disabled}
            />
            {errors.description && (
              <span className="text-red-500">{errors.description.message}</span>
            )}
          </div>

          {/* Estado */}
          <div className="flex flex-col justify-start w-full gap-0.5">
            <Label>Estado</Label>
            {fieldValidations.isActive.tooltip ? (
              <Tooltip content={fieldValidations.isActive.tooltip} relationship="label">
                <Switch
                  checked={isActive}
                  onChange={onChangeSwitch}
                  label={isActive ? "Activo" : "Inactivo"}
                  disabled={fieldValidations.isActive.disabled}
                />
              </Tooltip>
            ) : (
              <Switch
                checked={isActive}
                onChange={onChangeSwitch}
                label={isActive ? "Activo" : "Inactivo"}
                disabled={fieldValidations.isActive.disabled}
              />
            )}
          </div>
        </div>
      ) : null}

      {!loadingAppParam && (asyncAction.isLoading || asyncAction.isSuccess) && (
        <AsyncActionDisplay
          state={asyncAction.state}
          loadingMessage={`${isEdit ? 'Actualizando' : 'Creando'} configuración de la aplicación...`}
          successMessage={`Configuración de la aplicación ${isEdit ? 'actualizada' : 'creada'} exitosamente`}
          error={null}
          onSuccess={() => {
            handleClose();
          }}
          loadingType="progress"
        />
      )}
    </DrawerBase>
  );
}
