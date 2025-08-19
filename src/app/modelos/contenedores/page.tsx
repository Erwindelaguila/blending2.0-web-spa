"use client";

import { OtrosParametros, ParametrosLogisticos, Title } from "@/components";
import { FileUploadButton } from "@/components/ui/file-upload-button";
import { OrgColors } from "@/config/app.config.server";
import { useAsyncAction } from "@/hooks/use-async-action";
import { BaseResponse } from "@/interface";
import {
  DataAsignacion,
  ICapacidades,
  IDemanda,
  IEmparejamientos,
  IOferta,
  IOfertaSacos,
  IParticiones,
} from "@/interface/logistics/asignacion";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  clearAsignacionData,
  loadAsignacionData,
  persistAsignacionData,
} from "@/lib/store/slices/asignacion";
import { ExcelService } from "@/services/excel.service";
import { useButtonsStyles } from "@/styles/button.styles";
import { hexToRgba } from "@/utils/colors";
import { Button, Card, Divider, Spinner } from "@fluentui/react-components";
import { use, useEffect, useMemo, useState } from "react";

export default function ContenedoresPage() {
  const style = useButtonsStyles();
  const asyncAction = useAsyncAction();
  const dispatch = useAppDispatch();

  const { data, loading } = useAppSelector((state) => state.asignacion);

  const [loadingFile, setLoadingFile] = useState<boolean>(false);

  const [isErrorAsignacion, setIsErrorAsignacion] = useState<boolean>(false);
  const [socketErroParametrosLogisticos, setSocketErroParametrosLogisticos] =
    useState<boolean>(false);
  const [socketErroOtrosParametros, setSocketErroOtrosParametros] =
    useState<boolean>(false);

  const [
    socketParamentrosSeleccionadosKeys,
    setSocketParamentrosSeleccionadosKeys,
  ] = useState<string[]>([]);

  const [pesoContenedorSocket, setPesoContenedorSocket] = useState<string>("");

  const [emparejamientosSocket, setEmparejamientosSocket] =
    useState<IEmparejamientos>({});

  const [tiempoEsperaSocket, setTiempoEsperaSocket] = useState<string>("")

  const [responseCargarExcel, setResponseCargarExcel] = useState<{
    error: string;
    success: BaseResponse<any> | null;
  }>({
    error: "",
    success: null,
  });

  const [capacidadesSocketValues, setCapacidadesSocketValues] = useState<
    ICapacidades[]
  >([]);

  const [particionesSocket, setParticionesSocket] = useState<IParticiones>({});

  const handleUploadFile = async (file: File) => {
    console.log("File selected:", file);
    dispatch(clearAsignacionData());
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

    console.log("Uploading file:", file);
    await asyncAction.execute(
      () => ExcelService.uploadExcelLogistica(file),
      undefined,
      setResponseCargarExcel
    );
  };

  useEffect(() => {
    if (responseCargarExcel.success?.succeeded) {
      dispatch(persistAsignacionData(responseCargarExcel.success.data));
    }
  }, [dispatch, responseCargarExcel.success]);

  useEffect(() => {
    dispatch(loadAsignacionData());
  }, []);

  useEffect(() => {
    setIsErrorAsignacion(
      socketErroParametrosLogisticos || socketErroOtrosParametros
    );
  }, [socketErroParametrosLogisticos, socketErroOtrosParametros]);

  const contratoPesoContendores = useMemo(() => {
    if (loading) {
      return (
        <div className="w-full items-center flex justify-start h-auto ">
          <Spinner
            labelPosition="after"
            label="Cargando datos ..."
            size="tiny"
          />
        </div>
      );
    }
    if (data) {
      return (
        <>
          <Divider
            style={{
              height: "0.2rem",
              backgroundColor: "#ccc",
            }}
          ></Divider>

          <div className="flex gap-4">
            <span className="font-semibold">Contrato: {data.contrato}</span>
            <span className="font-semibold">
              Cantidad de Sacos: {data.pesoContenedores}
            </span>
          </div>
        </>
      );
    }

    return;
  }, [data, loading]);

  const parametros = useMemo(() => {
    if (loading) {
      return (
        <div className="w-full items-center flex justify-center h-auto pt-7">
          <Spinner labelPosition="after" label="Cargando parametros ..." />
        </div>
      );
    }
    if (data) {
      return (
        <>
          <ParametrosLogisticos
            dataAsignacion={data}
            onChange={(isError, capacidades, pesoContendor) => {
              setSocketErroParametrosLogisticos(isError);
              setCapacidadesSocketValues(capacidades);
              setPesoContenedorSocket(pesoContendor);
            }}
          ></ParametrosLogisticos>

          <OtrosParametros
            dataAsignacion={data}
            onChange={(
              isError,
              keyParamentrosSeleccionados,
              particiones,
              emparejamientos,
              tiempoEspera

            ) => {
              setSocketErroOtrosParametros(isError);
              setSocketParamentrosSeleccionadosKeys(
                keyParamentrosSeleccionados
              );
              setParticionesSocket(particiones);
              setEmparejamientosSocket(emparejamientos);
              setTiempoEsperaSocket(tiempoEspera)
            }}
          ></OtrosParametros>
        </>
      );
    }

    return;
  }, [data, loading]);

  function sendDataAsignacion() {
    if (!data) return;

    const demandaData: IDemanda = {
      cantidad: data.demanda.fijos.cantidadAsignadaToneladas,
      parametros: data.demanda.paramentrosCalidad,
    };

    

    const { ofertaList, ofertaSacos } = Object.entries(data.oferta).reduce(
      (acc, [lote, value]) => {
        const cantidad = value.fijos.cantidadAsignadaSacos;
        acc.ofertaSacos[lote] = cantidad.toString();
        acc.ofertaList.push({
          lote,
          cantidadAsignada: cantidad,
          descripcionCentro: value.fijos.descripcionCentro,
          ubicacionAlmacen: value.fijos.umAlmac,
          emparejamiento: value.fijos.umVta,
          parametros: value.parametrosCalidad,
        });
        return acc;
      },
      { ofertaList: [] as IOferta[], ofertaSacos: {} as IOfertaSacos }
    );
    const loteKeys = Object.keys(data.oferta);

    const totalCantidad = capacidadesSocketValues.reduce(
      (acc, item) => acc + item.cantidad,
      0
    );

    const resultado = Array.from(
      { length: totalCantidad },
      (_, i) => `C-${i + 1}`
    );

    const dataAsignacionSend: DataAsignacion = {
      demanda: demandaData,
      oferta: ofertaList,
      contenedores: resultado,
      parametrosSeleccionados: socketParamentrosSeleccionadosKeys,
      indiceOferta: loteKeys,
      ofertaSacos: ofertaSacos,
      capacidades: capacidadesSocketValues,
      particiones: particionesSocket,
      pesoContenedor: Number(pesoContenedorSocket),
      emparejamientos: emparejamientosSocket,
      tiempoEspera: Number( tiempoEsperaSocket)
    };

    console.log("Data Asginacion hasta el momento, ", dataAsignacionSend);
  }


  console.log("Esta es data",data);


  return (
    <div className="w-full h-full">
      <div className=" flex flex-col gap-4  w-full h-full pb-2 overflow-y-auto pr-1">
        <div>
          <Card style={{ width: "100%" }}>
            <div className="">
              <div className="flex flex-col gap-4">
                <div>
                  <Title title="Asignación" />
                </div>

                <FileUploadButton
                  accept=".xls,.xlsx"
                  label="Adjuntar Asignación"
                  onFileSelected={async (file) => {
                    setLoadingFile(true);
                    await handleUploadFile(file);
                    setLoadingFile(false);
                  }}
                  icon={true}
                  loading={loadingFile}
                />

                {contratoPesoContendores}
              </div>
            </div>
          </Card>
        </div>

        {parametros}

        <div className="flex gap-4 w-full">
          <div
            className="w-2/3 rounded-xl p-3 text-md flex items-center "
            style={{
              backgroundColor: hexToRgba(OrgColors.celeste, 0.3),
              color: OrgColors.azulOscuro,
            }}
          >
            <div>
              Se está ejecutando el modelo, esto puede demorar algunos minutos.
              Puede consultar el estado <br /> de la ejecución, con el código:{" "}
              <span className="font-semibold">DISLOG000123</span>
            </div>
          </div>

          <div className="w-1/3 flex flex-col gap-2 items-end justify-end">
            <Button
              size="large"
              disabled={isErrorAsignacion}
              onClick={sendDataAsignacion}
              className={`w-[13rem]  ${
                isErrorAsignacion
                  ? style.buttonDisabled
                  : style.buttonAzulOscuroBase
              }`}
            >
              Correr modelo
            </Button>
            <Button
              size="large"
              className={`w-[13rem] ${style.buttonVerdeBase}`}
            >
              Descargar reporte
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
