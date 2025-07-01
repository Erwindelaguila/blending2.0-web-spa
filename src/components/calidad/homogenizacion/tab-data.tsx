"use client";

import { OrgColors } from "@/config/app.config.server";
import { useAppDispatch } from "@/lib/store/hooks";
import { nextStep } from "@/lib/store/slices/stepSlice";
import {
  Card,
  Button,
  CheckboxProps,
  Checkbox,
  Label,
} from "@fluentui/react-components";
import { DatePicker } from "@fluentui/react-datepicker-compat";
import { useState } from "react";
import { AppTagPicker } from "../../ui/app-tagPicker";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { IFilterHomogenizacionHarina } from "@/interface";
import { AppCombobox } from "../../ui/app-combobox";
import { Info16Regular } from "@fluentui/react-icons";
import { Title } from "@/components/ui/title";
import { useButtonsStyles } from "@/styles/button.styles";

const allOptions = [
  "John Doe",
  "Jane Doe",
  "Max Mustermann",
  "Erika Mustermann",
  "Pierre Dupont",
  "Amelie Dupont",
  "Mario Rossi",
  "Maria Rossi",
];

export function TabData() {
  const style = useButtonsStyles();
  const comboOptions = ["Cat", "Dog", "Ferret", "Fish", "Hamster", "Snake"];

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<IFilterHomogenizacionHarina>({
    defaultValues: {
      plata_Homogenizado: "",
      centro_ubicacion: [],
      centro_produccion: [],
      ubicacion_almacen: [],
      tipo_produccion: "",
      borrar_calidades: [],
      agregar_rumas_serie: [],
    },
  });

  const onSubmit: SubmitHandler<IFilterHomogenizacionHarina> = async (data) => {
    console.log("Form data submitted:", data);
    dispatch(nextStep());
  };

  const sendData = () => {
    //handleSubmit(onSubmit)();
    dispatch(nextStep());
  };

  const [checked, setChecked] = useState<CheckboxProps["checked"]>(true);
  const [checkedCadmio, setCheckedCadmio] =
    useState<CheckboxProps["checked"]>(true);

  const dispatch = useAppDispatch();

  return (
    <div className=" w-full px-2 m-auto flex flex-col h-full">
      <div className="h-2/13 w-full pb-2">
        <Card style={{ width: "100%", height: "100%" }}>
          <div className="w-full h-full">
            <Title title="Stock disponible"></Title>
            <div className="py-6 px-8 flex justify-between">
              <Button
                size="large"
                className={`w-[20rem] ${style.buttonAzulOscuroBase} `}
              >
                Obtener desde SAP
              </Button>
              <Button
                size="large"
                className={`w-[20rem] ${style.buttonVerdeBase}`}
              >
                Descargar Stock Disponible
              </Button>
              <Button
                size="large"
                className={`w-[20rem] ${style.buttonCelesteBase}`}
              >
                Adjuntar Stock Disponible
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="w-full h-11/13 pb-2">
        <Card style={{ width: "100%", height: "100%" }}>
          <div className=" w-full h-full  overflow-y-auto">
            <Title title="Filtros"></Title>

            <div className="w-full flex flex-col gap-2 ">
              <div className="w-full mt-2 flex flex-col gap-1">
                <Controller
                  name="plata_Homogenizado"
                  control={control}
                  rules={{ required: "Seleccione una planta" }}
                  render={({ field }) => (
                    <AppCombobox
                      label="Planta Homogenizado"
                      labelRequired={true}
                      size="medium"
                      options={comboOptions}
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.plata_Homogenizado?.message}
                    />
                  )}
                />
              </div>

              <div className="w-full mt-2 flex flex-col gap-1">
                <Controller
                  name="centro_ubicacion"
                  control={control}
                  rules={{
                    required:
                      "Debe seleccionar al menos un centro de ubicacion",
                  }}
                  render={({ field }) => (
                    <AppTagPicker
                      options={allOptions}
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.centro_ubicacion?.message}
                      size="medium"
                      label="Centros de Ubicación"
                      sizeLabel="medium"
                      requieredLabel={true}
                      placeholder="Seleccione centros de ubicación"
                    />
                  )}
                />
              </div>

              <div className="w-full mt-2 flex flex-col gap-1">
                <Controller
                  name="centro_produccion"
                  control={control}
                  rules={{
                    required:
                      "Debe seleccionar al menos un centro de produccion",
                  }}
                  render={({ field }) => (
                    <AppTagPicker
                      options={allOptions}
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.centro_produccion?.message}
                      size="medium"
                      label="Centros de Producción"
                      sizeLabel="medium"
                      requieredLabel={true}
                      placeholder="Seleccione centros de producción"
                    />
                  )}
                />
              </div>

              <div className="w-full mt-2 flex flex-col gap-1">
                <Controller
                  name="ubicacion_almacen"
                  control={control}
                  rules={{
                    required:
                      "Debe seleccionar al menos un centro de produccion",
                  }}
                  render={({ field }) => (
                    <AppTagPicker
                      options={allOptions}
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.ubicacion_almacen?.message}
                      size="medium"
                      label="Ubicación Almacen"
                      sizeLabel="medium"
                      requieredLabel={true}
                      placeholder="Seleccione ubicaciones de almacen"
                    />
                  )}
                />
              </div>

              <div className="w-full mt-2 flex flex-col gap-1">
                <Controller
                  name="tipo_produccion"
                  control={control}
                  rules={{ required: "Seleccione una planta" }}
                  render={({ field }) => (
                    <AppCombobox
                      label="Tipo de Producción"
                      placeholder="Seleccione tipo de producción"
                      labelRequired={true}
                      size="medium"
                      options={comboOptions}
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.tipo_produccion?.message}
                    />
                  )}
                />
              </div>

              <div className="w-full mt-2 flex flex-col gap-1">
                <Controller
                  name="borrar_calidades"
                  control={control}
                  render={({ field }) => (
                    <AppTagPicker
                      options={allOptions}
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.borrar_calidades?.message}
                      size="medium"
                      errorInput={true}
                      label="Borrar Calidades"
                      sizeLabel="medium"
                      requieredLabel={false}
                      placeholder="Seleccione calidades a borrar"
                    />
                  )}
                />
              </div>

              <div className="w-full mt-2 flex flex-col gap-1">
                <Checkbox
                  checked={checked}
                  style={{ color: OrgColors.serotRojo }}
                  size="medium"
                  onChange={(ev, data) => setChecked(data.checked)}
                  label="Quitar rumas tipo PH"
                />
              </div>

              <div className="w-full mt-2 flex flex-col gap-1">
                <Controller
                  name="agregar_rumas_serie"
                  control={control}
                  render={({ field }) => (
                    <AppTagPicker
                      options={allOptions}
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.agregar_rumas_serie?.message}
                      size="medium"
                      errorInput={false}
                      label="Agregar rumas de la serie"
                      sizeLabel="medium"
                      requieredLabel={false}
                      placeholder="Seleccione calidades a borrar"
                    />
                  )}
                />
              </div>

              <div className="w-full mt-6 flex items-center">
                <div className=" flex flex-col gap-1 w-2/4">
                  <Checkbox
                    checked={checkedCadmio}
                    size="medium"
                    onChange={(ev, data) => setCheckedCadmio(data.checked)}
                    label="Considerar valor de cadmio"
                  />
                </div>

                <div className="flex gap-3 items-center">
                  <Label size="medium" required htmlFor="Centro de Ubicación">
                    Fecha de corte
                  </Label>
                  <DatePicker size="medium" placeholder="Elija una fecha" />
                </div>
              </div>

              <div className="w-full h-6">
                {checkedCadmio && (
                  <div className="pl-2 flex items-center gap-2">
                    <Info16Regular className="text-blue-500" />{" "}
                    <span className="text-xs">
                      En el paso de ejecucion se podra editar el valor de cadmio
                    </span>
                  </div>
                )}
              </div>

              <div className="w-full flex justify-end">
                <Button
                  size="large"
                  className={`w-[13rem] ${style.buttonCelesteBase}`}
                  onClick={() => sendData()}
                >
                  Continuar
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
