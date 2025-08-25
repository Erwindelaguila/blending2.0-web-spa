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
import { useEffect, useMemo, useState } from "react";
import { AppTagPicker } from "../../ui/app-tagPicker";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  BaseResponse,
  BlobUploadResultDto,
  IFilterHomogenizacionHarina,
  PlantaFiltersParams,
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
  StockDisponibleItem,
} from "@/lib/store/slices/stockDisponible";
import { downloadFileExcel } from "@/utils/download-file";
import { extraerValoresUnicos } from "@/utils/process-data";
import { resetBlobData, setBlobData } from "@/lib/store/slices/blobSlice";
import { datePickerStringsEs, onFormatDate } from "@/utils/date";
import {
  IPlantaDataShort,
  ITabData,
  StockFiltradoItem,
} from "@/interface/quality/tab-data";
import useSWR from "swr";
import { buildPaginatedSWRKey } from "@/utils";
import { PlantasService } from "@/services";

const buildPlantasKey = (
  page: number,
  size: number,
  filters?: PlantaFiltersParams
) => {
  return buildPaginatedSWRKey("plantas", page, size, filters);
};

export function TabData() {
  const PLATA_DEFAULT = "MSU";

  const PARAMETRO_SERIE = ["12", "16", "11", "15", "00"];

  const style = useButtonsStyles();
  const asyncAction = useAsyncAction();
  const dispatch = useAppDispatch();

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
  const [calidadPlanta, setCalidadPlanta] = useState<string[]>([]);
  const [dataFiltered, setDataFiltered] = useState<StockDisponibleItem[]>([]);
  const [rumasSeries, setRumasSeries] = useState<string[]>([]);

  const swrKey = buildPlantasKey(1, 10, { estado: 1, isHarina: 1 });

  const {
    data: dataPlantas,
    isLoading: loadingPlantas,
    error: errorPlantas,
  } = useSWR<BaseResponse<IPlantaDataShort[]>>(
    swrKey,
    () =>
      PlantasService.listar<IPlantaDataShort[]>(1, 10, {
        estado: 1,
        isHarina: 1,
      } as PlantaFiltersParams),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 2000,
    }
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
      fecha_corte: null,
    },
  });

  const onSubmit: SubmitHandler<IFilterHomogenizacionHarina> = async (
    dataSubmit
  ) => {
    const fecha_corte = formatDate(dataSubmit.fecha_corte ?? new Date());

    console.log("Fecha de corte: ", fecha_corte);

    let dataFilter: StockDisponibleItem[] = [...dataFiltered];

    // filtros normales
    dataFilter = dataFilter.filter((item) =>
      dataSubmit.centro_ubicacion.includes(item.fijos.centroUbicacion)
    );

    console.log("Centro ubicacion: ", dataFilter);

    dataFilter = dataFilter.filter((item) =>
      dataSubmit.centro_produccion.includes(item.fijos.centroProduccion)
    );

    console.log("Centro centro produccion: ", dataFilter);

    dataFilter = dataFilter.filter((item) =>
      dataSubmit.ubicacion_almacen.includes(item.fijos.almacenUbicacion)
    );
    console.log("Ubicacion alamacen: ", dataFilter);

    dataFilter = dataFilter.filter((item) =>
      dataSubmit.tipo_produccion.includes(item.fijos.tipoProduccion)
    );

    console.log("Tipo de Produccion", dataFilter);

    /*

    dataFilter = dataFilter.filter(
      (item) => !dataSubmit.borrar_calidades.includes(item.fijos.calidadPlanta)
    );
    */

    if (checkedRumasHp) {
      dataFilter = dataFilter.filter((item) => item.fijos.serie !== "PH");
    }

    console.log("Se quitar el PH: ", dataFilter);

    if (dataSubmit.agregar_rumas_serie.length > 0) {
      const recuperar = data.filter((item) =>
        dataSubmit.agregar_rumas_serie.includes(item.fijos.serie)
      );

      const recuperarFiltrados = recuperar.filter(
        (item) =>
          dataSubmit.centro_ubicacion.includes(item.fijos.centroUbicacion) &&
          dataSubmit.centro_produccion.includes(item.fijos.centroProduccion) &&
          dataSubmit.ubicacion_almacen.includes(item.fijos.almacenUbicacion) &&
          dataSubmit.tipo_produccion.includes(item.fijos.tipoProduccion) &&
          !dataSubmit.borrar_calidades.includes(item.fijos.calidadPlanta)
      );

      // Combinar y quitar duplicados por `rumaNro`
      const uniqueMap = new Map<string, StockDisponibleItem>();
      [...dataFilter, ...recuperarFiltrados].forEach((item) => {
        uniqueMap.set(item.fijos.rumaNro, item);
      });

      dataFilter = Array.from(uniqueMap.values());
    }

    console.log("Data filtrada agregarr rumas serie : ", dataFilter);

    dataFilter = dataFilter.filter(
      (item) =>
        item.fijos.fechaCorte && fecha_corte.includes(item.fijos.fechaCorte)
    );

    console.log("Data filtrada v1 : ", dataFilter);

    const stockFiltrado: StockFiltradoItem[] = dataFilter.map((item) => ({
      rumaNro: item.fijos.rumaNro,
      cantidad: item.fijos.cantidad,
      parametros: item.parametrosCalidad,
    }));

    const TabDataExport: ITabData = {
      stockFiltrado: stockFiltrado,
      planta: dataSubmit.plata_Homogenizado,
      incluirCadmio: checkedCadmio == true ? true : false,
    };

    console.log("Estok filtrado", TabDataExport);

    //dispatch(nextStep());
  };

  const sendData = () => {
    handleSubmit(onSubmit)();
  };

  const centroUbicacionWatch = watch("centro_ubicacion");
  const centroProduccionWatch = watch("centro_produccion");
  const ubicacionAlmacenWatch = watch("ubicacion_almacen");
  const tipoProduccionWatch = watch("tipo_produccion");
  const borrarCalidadesWatch = watch("borrar_calidades");
  const agregarRumasSerieWatch = watch("agregar_rumas_serie");
  const fechaCorteWatch = watch("fecha_corte");

  const dataFiltradaSocketCount = useMemo(() => {
    let current = [...dataFiltered];

    if (centroUbicacionWatch?.length > 0) {
      current = current.filter((item) =>
        centroUbicacionWatch.includes(item.fijos.centroUbicacion)
      );
    }

    if (centroProduccionWatch?.length > 0) {
      current = current.filter((item) =>
        centroProduccionWatch.includes(item.fijos.centroProduccion)
      );
    }

    if (ubicacionAlmacenWatch?.length > 0) {
      current = current.filter((item) =>
        ubicacionAlmacenWatch.includes(item.fijos.almacenUbicacion)
      );
    }

    if (tipoProduccionWatch?.length > 0) {
      current = current.filter((item) =>
        tipoProduccionWatch.includes(item.fijos.tipoProduccion)
      );
    }

    if (checkedRumasHp) {
      current = current.filter((item) => item.fijos.serie !== "PH");
    }

    if (agregarRumasSerieWatch?.length > 0) {
      // Recupera todas las rumas cuya serie está en la selección
      const recuperar = data.filter((item) =>
        agregarRumasSerieWatch.includes(item.fijos.serie)
      );

      const recuperarFiltrados = recuperar.filter((item) => {
        const matchCentroUbicacion =
          centroUbicacionWatch.length === 0 ||
          centroUbicacionWatch.includes(item.fijos.centroUbicacion);

        const matchCentroProduccion =
          centroProduccionWatch.length === 0 ||
          centroProduccionWatch.includes(item.fijos.centroProduccion);

        const matchUbicacionAlmacen =
          ubicacionAlmacenWatch.length === 0 ||
          ubicacionAlmacenWatch.includes(item.fijos.almacenUbicacion);

        const matchTipoProduccion =
          tipoProduccionWatch.length === 0 ||
          tipoProduccionWatch.includes(item.fijos.tipoProduccion);

        const matchCalidades =
          borrarCalidadesWatch.length === 0 ||
          !borrarCalidadesWatch.includes(item.fijos.calidadPlanta);

        return (
          matchCentroUbicacion &&
          matchCentroProduccion &&
          matchUbicacionAlmacen &&
          matchTipoProduccion &&
          matchCalidades
        );
      });

      // Combinar lo ya filtrado con las rumas recuperadas, evitando duplicados
      const uniqueMap = new Map<string, StockDisponibleItem>();
      [...current, ...recuperarFiltrados].forEach((item) => {
        uniqueMap.set(item.fijos.rumaNro, item);
      });
      current = Array.from(uniqueMap.values());
    }

    if (fechaCorteWatch) {
      const fecha_corte_value_parce = formatDate(fechaCorteWatch ?? new Date());
      current = current.filter(
        (item) =>
          item.fijos.fechaCorte && // asegura que no sea vacío
          fecha_corte_value_parce === item.fijos.fechaCorte
      );
    }

    return current;
  }, [
    centroUbicacionWatch,
    centroProduccionWatch,
    ubicacionAlmacenWatch,
    tipoProduccionWatch,
    borrarCalidadesWatch,
    agregarRumasSerieWatch,
    data,
    dataFiltered,
    checkedRumasHp,
    fechaCorteWatch,
  ]);

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
      () => SapService.getSapData("/api/upload/get-sap-stock", filename),
      undefined,
      setResponseSap
    );
    setLoadingSap(false);
  };

  useEffect(() => {
    if (responseCargarExcel.success?.succeeded) {
      dispatch(persistStockDisponible(responseCargarExcel.success.data));
    }
  }, [dispatch, responseCargarExcel.success]);

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
      console.log("Data: ", data);

      let dataFilter: StockDisponibleItem[] = [...data];
      const valoresUnicos = extraerValoresUnicos(data);
      setAllTiposProduccion(valoresUnicos.tipoProduccion);
      setTipoProduccion(valoresUnicos.tipoProduccion);
      setCalidadPlanta(valoresUnicos.calidadPlanta);
      setCentrosUbicacion(valoresUnicos.centroUbicacion);
      setAlmacenesUbicacion(valoresUnicos.almacenUbicacion);
      setCentrosProduccion(valoresUnicos.centroProduccion);
      const serieExcel = valoresUnicos.serie;

      const intersection = serieExcel.filter((value) =>
        PARAMETRO_SERIE.includes(value)
      );

      if (intersection.length > 0) {
        dataFilter = dataFilter.filter(
          (item) => !intersection.includes(item.fijos.serie)
        );
        setRumasSeries(intersection);
      }
      setDataFiltered(dataFilter);
    }
  }, [data]);

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

  function formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() es 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const processData = useMemo(() => {
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
              <div className=" w-full h-full  overflow-y-auto z-50">
                <Title title="Filtros"></Title>
                <div className="w-full flex flex-col gap-2 ">
                  <div className="w-full mt-2 flex flex-col gap-1">
                    {loadingPlantas ? (
                      <>
                        <Spinner
                          size="small"
                          label="Cargando plantas de homogenización ..."
                        ></Spinner>
                      </>
                    ) : errorPlantas ? (
                      <span className="text-red-400">
                        Error al traer las plantas
                      </span>
                    ) : (
                      <>
                        <Controller
                          name="plata_Homogenizado"
                          control={control}
                          rules={{ required: "Seleccione una planta" }}
                          render={({ field }) => (
                            <AppCombobox
                              label="Planta Homogenizado"
                              labelRequired={true}
                              size="medium"
                              options={
                                dataPlantas?.data?.map((item) => item.codigo) ??
                                []
                              }
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value);
                              }}
                              error={errors.plata_Homogenizado?.message}
                            />
                          )}
                        />
                      </>
                    )}
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
                          options={rumasSeries}
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
                    <div className=" flex flex-col gap-1 w-2/4 ">
                      <Checkbox
                        checked={checkedCadmio}
                        size="medium"
                        onChange={(ev, data) => setCheckedCadmio(data.checked)}
                        label="Considerar valor de cadmio"
                      />
                    </div>

                    <div className="flex flex-col gap-2 w-2/4">
                      <div className="flex gap-3 items-center">
                        <Label
                          size="medium"
                          required
                          htmlFor="Centro de Ubicación"
                        >
                          Fecha de corte
                        </Label>
                        <div className="flex flex-col gap-2"></div>
                        <Controller
                          name="fecha_corte"
                          control={control}
                          rules={{ required: "Seleccione una fecha" }}
                          render={({ field }) => (
                            <DatePicker
                              size="medium"
                              placeholder="Elija una fecha"
                              allowTextInput
                              value={field.value}
                              onSelectDate={field.onChange}
                              formatDate={(date) =>
                                date ? date.toLocaleDateString("es-ES") : ""
                              }
                              strings={datePickerStringsEs}
                            />
                          )}
                        ></Controller>
                      </div>
                    </div>
                  </div>

                  <div className="w-full h-6 flex">
                    <div className="w-2/4 ">
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
                    <div className="w-2/4 ">
                      {errors.fecha_corte && (
                        <span className="text-red-600 text-xs">
                          {errors.fecha_corte.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="w-full flex justify-end">
                    <Button appearance="subtle">
                      Coincidencias encontradas {dataFiltradaSocketCount.length}
                    </Button>

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
    return null;
  }, [
    loading,
    data,
    centrosUbicacion,
    allTiposProduccion,
    tipoProduccion,
    calidadPlanta,
    checkedCadmio,
    checkedRumasHp,
    checkedTiposProduccion,
    sendData,
    loadingPlantas,
    dataFiltradaSocketCount,
  ]);

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

      {processData}
    </div>
  );
}
