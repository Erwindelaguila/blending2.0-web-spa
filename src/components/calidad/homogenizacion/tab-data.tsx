"use client";

import { OrgColors } from "@/config/app.config.server";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { nextStep } from "@/lib/store/slices/stepSlice";
import {
  Card,
  Button,
  CheckboxProps,
  Checkbox,
  Label,
  Spinner,
} from "@fluentui/react-components";
import { DatePicker } from "@fluentui/react-datepicker-compat";
import { useEffect, useState } from "react";
import { AppTagPicker } from "../../ui/app-tagPicker";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  BaseResponse,
  BlobUploadResultDto,
  IFilterHomogenizacionHarina,
} from "@/interface";
import { AppCombobox } from "../../ui/app-combobox";
import { Info16Regular } from "@fluentui/react-icons";
import { Title } from "@/components/ui/title";
import { useButtonsStyles } from "@/styles/button.styles";
import { FileUploadButton } from "@/components/ui/file-upload-button";
import { useAsyncAction } from "@/hooks/use-async-action";
import { ExcelService } from "@/services/excel.service";
import { SapService } from "@/services/sap.service";
import {
  clearStockDisponibleFromDB,
  loadStockDisponible,
  persistStockDisponible,
} from "@/lib/store/slices/stockDisponible";
import { downloadFileExcel } from "@/utils/download-file";
import {
  extraerValoresParametro,
  extraerValoresUnicos,
  getValoresUnificadosPorCentros,
} from "@/utils/process-data";
import { resetBlobData, setBlobData } from "@/lib/store/slices/blobSlice";
import { onFormatDate } from "@/utils/date";

export function TabData() {
  const style = useButtonsStyles();
  const asyncAction = useAsyncAction();

  const [responseCargarExcel, setResponseCargarExcel] = useState<{
    error: string;
    success: BaseResponse<any> | null;
  }>({
    error: "",
    success: null,
  });

  const [responseSap, setResponseSap] = useState<{
    error: string;
    success: BaseResponse<BlobUploadResultDto> | null;
  }>({
    error: "",
    success: null,
  });

  const [loadingFile, setLoadingFile] = useState<boolean>(false);
  const [loadingSap, setLoadingSap] = useState<boolean>(false);
  const { data, loading } = useAppSelector((state) => state.stockDisponible);
  const { downloadUrl, fileName, expiresAtUtc } = useAppSelector(
    (state) => state.blob
  );

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
      tipo_produccion: [],
      borrar_calidades: [],
      agregar_rumas_serie: [],
    },
  });

  const onSubmit: SubmitHandler<IFilterHomogenizacionHarina> = async (data) => {
    console.log("Form data submitted:", data);
    //(nextStep());
  };

  const sendData = () => {
    //handleSubmit(onSubmit)();
    //dispatch(nextStep());
  };

  const [checkedRumasHp, setCheckedRumasHp] =
    useState<CheckboxProps["checked"]>(true);

  const [checkedTiposProduccion, setCheckedTiposProduccion] =
    useState<CheckboxProps["checked"]>(false);
  const [checkedCadmio, setCheckedCadmio] =
    useState<CheckboxProps["checked"]>(true);

  const [centrosUbicacion, setCentrosUbicacion] = useState<string[]>([]);
  const [alamacenesUbicacion, setAlmacenesUbicacion] = useState<string[]>([]);
  const [centrosProduccion, setCentrosProduccion] = useState<string[]>([]);
  const [errorDownloadExcel, setErrorDownloadExcel] = useState<string>("");
  const [allTiposProduccion, setAllTiposProduccion] = useState<string[]>([]);
  const [tipoProduccion, setTipoProduccion] = useState<string[]>([]);
  const [rumas, setRumas] = useState<string[]>([]);
  const [allRumas, setAllRumas] = useState<string[]>([]);
  const [allValuesCadmio, setAllValuesCadmio] = useState<string[]>([]);
  const [calidadPlanta, setCalidadPlanta] = useState<string[]>([]);

  const dispatch = useAppDispatch();

  const handleUploadFile = async (file: File) => {
    reset();
    dispatch(clearStockDisponibleFromDB());
    asyncAction.reset();
    setResponseCargarExcel({
      error: "",
      success: null,
    });
    const allowedExtensions = /\.(xls|xlsx|csv)$/i;
    if (!allowedExtensions.test(file.name)) {
      setResponseCargarExcel({
        error: "Formato no permitido. Solo se aceptan .xls y .xlsx",
        success: null,
      });
      return;
    }
    await asyncAction.execute(
      () => ExcelService.uploadExcelCalidad(file),
      undefined,
      setResponseCargarExcel
    );
  };

  const actionUploadFIle = async (file: File): Promise<void> => {
    setLoadingFile(true);
    await handleUploadFile(file);
    setLoadingFile(false);
  };

  const dowdlandExcelSap = () => {
    setErrorDownloadExcel("");
    const now = new Date();
    const expiration = new Date(expiresAtUtc);
    if (now.getTime() >= expiration.getTime()) {
      setErrorDownloadExcel("El enlace de descarga ha expirado.");
      return;
    }

    downloadFileExcel(downloadUrl);
  };

  const getSapData = async () => {
    reset();
    setErrorDownloadExcel("");
    dispatch(resetBlobData());
    dispatch(clearStockDisponibleFromDB());
    setResponseCargarExcel({
      error: "",
      success: null,
    });
    setLoadingSap(true);
    asyncAction.reset();
    setResponseSap({
      error: "",
      success: null,
    });

    const filename = fileName ?? undefined;
    await asyncAction.execute(
      () => SapService.getSapData("/api/get-sap-stock", filename),
      undefined,
      setResponseSap
    );
    setLoadingSap(false);
  };

  useEffect(() => {
    if (responseCargarExcel.success?.succeeded) {
      dispatch(persistStockDisponible(responseCargarExcel.success.data));
    }
  }, [dispatch, responseCargarExcel.success, responseSap.success]);

  useEffect(() => {
    if (responseSap.success?.succeeded) {
      dispatch(
        setBlobData({
          downloadUrl: responseSap.success.data?.downloadUrl ?? "",
          fileName: responseSap.success.data?.fileName ?? "",
          expiresAtUtc: responseSap.success.data?.expiresAtUtc ?? "",
        })
      );
      dispatch(persistStockDisponible(responseSap.success.data?.excelDataSap));
    }
  }, [dispatch, responseSap.success]);

  useEffect(() => {
    dispatch(loadStockDisponible());
  }, [dispatch, responseCargarExcel.success?.succeeded]);

  useEffect(() => {
    if (data && data.length > 0) {
      const valoresUnicos = extraerValoresUnicos(data);
      setCentrosUbicacion(valoresUnicos.centroUbicacion);
      setAllTiposProduccion(valoresUnicos.tipoProduccion);
      setTipoProduccion(valoresUnicos.tipoProduccion);
      setAllRumas(valoresUnicos.rumaNro);
      setCalidadPlanta(valoresUnicos.calidadPlanta);
      const cadmio = extraerValoresParametro(data, "cadmio");
      setAllValuesCadmio(cadmio);
    }
  }, [data]);

  useEffect(() => {
    if (checkedRumasHp) {
      const rumasFiltradas = allRumas.filter(
        (ruma) => !ruma.toUpperCase().includes("PH")
      );
      setRumas(rumasFiltradas);
    } else {
      setRumas(allRumas);
    }
  }, [checkedRumasHp, allRumas]);

  function processCentrosUbicacion(selected: string[]) {
    setAlmacenesUbicacion([]);
    setCentrosProduccion([]);
    if (!data) {
      return;
    }
    const resultado = getValoresUnificadosPorCentros(data, selected);
    setAlmacenesUbicacion(resultado.almacenesUbicacion);
    setCentrosProduccion(resultado.centrosProduccion);
  }

  function processTipoProduccion(selected: string[]) {
    if (!data || checkedTiposProduccion || selected.length === 0) {
      setTipoProduccion(allTiposProduccion);
      return;
    }

    const gruposQuimicosSeleccionados = selected.map((s) => {
      const partes = s.split("+");
      return partes[1]?.trim(); // ETOXIQ o BHT
    });

    const opcionesFiltradas = allTiposProduccion.filter((opcion) => {
      return gruposQuimicosSeleccionados.some((grupo) =>
        opcion.includes(grupo)
      );
    });
    setTipoProduccion(opcionesFiltradas);
  }

  const processData = () => {
    if (loading) {
      return (
        <div className="w-full items-center flex justify-center h-auto pt-7">
          <Spinner labelPosition="after" label="Cargando filtros" />
        </div>
      );
    }
    if (data && data.length > 0) {
      return (
        <>
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
                          options={["Planta 1", "Planta 2", "Planta 3"]}
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
                          options={centrosUbicacion}
                          value={field.value}
                          onChange={(selected) => {
                            field.onChange(selected);
                            processCentrosUbicacion(selected); // lógica extra opcional
                          }}
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
                          options={centrosProduccion}
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
                          options={alamacenesUbicacion}
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
                    <Checkbox
                      checked={checkedTiposProduccion}
                      size="medium"
                      onChange={(ev, data) => {
                        setCheckedTiposProduccion(data.checked);
                        if (data.checked) {
                          setTipoProduccion(allTiposProduccion);
                        } else {
                          setTipoProduccion(allTiposProduccion); // o puedes filtrar más tarde según primera selección
                          setValue("tipo_produccion", []); // Limpiar el combo
                        }
                      }}
                      label="Permitir mezclar tipo de producción"
                    />
                  </div>

                  <div className="w-full mt-2 flex flex-col gap-1">
                    <Controller
                      name="tipo_produccion"
                      control={control}
                      rules={{
                        required:
                          "Debe seleccionar al menos un centro de producción",
                      }}
                      render={({ field }) => (
                        <AppTagPicker
                          options={tipoProduccion}
                          value={field.value}
                          onChange={(selected) => {
                            field.onChange(selected);
                            processTipoProduccion(selected); // lógica extra opcional
                          }}
                          error={errors.tipo_produccion?.message}
                          size="medium"
                          label="Tipo de Producción"
                          sizeLabel="medium"
                          requieredLabel={true}
                          placeholder="Seleccione tipos de producción"
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
                          options={calidadPlanta}
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
                      checked={checkedRumasHp}
                      style={{ color: OrgColors.serotRojo }}
                      size="medium"
                      onChange={(ev, data) => setCheckedRumasHp(data.checked)}
                      label="Quitar rumas tipo PH"
                    />
                  </div>

                  <div className="w-full mt-2 flex flex-col gap-1">
                    <Controller
                      name="agregar_rumas_serie"
                      control={control}
                      render={({ field }) => (
                        <AppTagPicker
                          options={[]}
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
                      <Label
                        size="medium"
                        required
                        htmlFor="Centro de Ubicación"
                      >
                        Fecha de corte
                      </Label>
                      <DatePicker
                        size="medium"
                        placeholder="Elija una fecha"
                        formatDate={onFormatDate}
                        allowTextInput
                      />
                    </div>
                  </div>

                  <div className="w-full h-6">
                    {checkedCadmio && (
                      <div className="pl-2 flex items-center gap-2">
                        <Info16Regular className="text-blue-500" />{" "}
                        <span className="text-xs">
                          En el paso de ejecucion se podra editar el valor de
                          cadmio
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
        </>
      );
    }

    return;
  };

  return (
    <div className=" w-full px-2 m-auto flex flex-col h-full">
      <div className="h-2/13 w-full pb-2">
        <Card style={{ width: "100%", height: "100%" }}>
          <div className="w-full h-full">
            <Title title="Stock disponible"></Title>
            <div className="pt-3 px-8 flex justify-between">
              <div className="w-full grid grid-cols-3 gap-2">
                <div className="w-full">
                  <div className="flex flex-col items-center gap-1">
                    <Button
                      size="large"
                      onClick={getSapData}
                      icon={
                        loadingSap ? <Spinner size="tiny"></Spinner> : undefined
                      }
                      disabled={loadingSap}
                      className={`w-[20rem] ${style.buttonAzulOscuroBase} `}
                    >
                      {loadingSap ? "Obteniendo ...." : "Obtener desde SAP"}
                    </Button>
                    <span
                      className={
                        responseSap.error != ""
                          ? "text-red-600 font-semibold"
                          : "text-blue-600 font-semibold"
                      }
                    >
                      {responseSap.error != ""
                        ? responseSap.error
                        : responseSap.success?.message}
                    </span>
                  </div>
                </div>
                <div className="w-full">
                  <div className="flex flex-col items-center gap-1">
                    <Button
                      size="large"
                      className={`w-[20rem] ${
                        downloadUrl
                          ? style.buttonVerdeBase
                          : style.buttonDisabled
                      }`}
                      disabled={!downloadUrl}
                      onClick={dowdlandExcelSap}
                    >
                      Descargar Stock Disponible
                    </Button>
                    <span className="text-red-600 font-semibold">
                      {errorDownloadExcel}
                    </span>
                  </div>
                </div>
                <div className="w-full">
                  <div className="flex flex-col items-center gap-1">
                    <FileUploadButton
                      accept=".xls,.xlsx"
                      label="Adjuntar Stock Disponible"
                      onFileSelected={(file: File) => actionUploadFIle(file)}
                      loading={loadingFile}
                    />

                    <span
                      className={
                        responseCargarExcel.error != ""
                          ? "text-red-600 font-semibold"
                          : "text-blue-600 font-semibold"
                      }
                    >
                      {responseCargarExcel.error != ""
                        ? responseCargarExcel.error
                        : responseCargarExcel.success?.message}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {processData()}
    </div>
  );
}
