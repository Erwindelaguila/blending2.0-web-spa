import { TableBase } from "@/components/ui/table-base";
import { TableDynamic } from "@/components/ui/table-dynamic";
import { Title } from "@/components/ui/title";
import { OrgColors } from "@/config/app.config.server";
import { DynamicRow, RowData } from "@/interface";
import { AsignacionData } from "@/lib/store/slices/asignacion";
import {
  Card,
  CardPreview,
  Checkbox,
  CheckboxProps,
  Input,
  InputProps,
  Label,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
} from "@fluentui/react-components";
import { useEffect, useState } from "react";
import TablaContenedores from "./tabla-contenedores";
import { ErrorAlertContent } from "@/interface/components/message-alert";
import { ICapacidades } from "@/interface/logistics/asignacion";
import { useAppSelector } from "@/lib/store/hooks";
import { getAllAppParams, getAppParamOrDefault } from "@/lib/store/slices/appParamsSlice";

export function ParametrosLogisticos({
  dataAsignacion,
  onChange,
}: {
  dataAsignacion: AsignacionData | null;
  onChange?: (
    isError: boolean,
    capacidades: ICapacidades[],
    pesoContendor: string
  ) => void;
}) {
  const APP_LOG_PESO_CONTENEDOR_DEFAULT = useAppSelector((state) =>
    getAppParamOrDefault(state, "APP_LOG_PESO_CONTENEDOR_DEFAULT", "0")
  );

  const APP_LOG_PESO_MAX_CONTENEDOR = useAppSelector((state) =>
    getAppParamOrDefault(state, "APP_LOG_PESO_MAX_CONTENEDOR", "0")
  );

  const APP_LOG_PESO_MIN_CONTENEDOR = useAppSelector((state) =>
    getAppParamOrDefault(state, "APP_LOG_PESO_MIN_CONTENEDOR", "0")
  );

  const APP_LOG_CANTIDAD_MIN_SACOS_X_CONTENEDOR = useAppSelector((state) =>
    getAppParamOrDefault(state, "APP_LOG_CANTIDAD_MIN_SACOS_X_CONTENEDOR", "0")
  );

  const APP_LOG_CANTIDAD_MAX_SACOS_X_CONTENEDOR = useAppSelector((state) =>
    getAppParamOrDefault(state, "APP_LOG_CANTIDAD_MAX_SACOS_X_CONTENEDOR", "0")
  );

  const APP_LOG_CANTIDAD_SACOS_X_CONTENEDOR_DEFAULT = useAppSelector((state) =>
    getAppParamOrDefault(
      state,
      "APP_LOG_CANTIDAD_SACOS_X_CONTENEDOR_DEFAULT",
      "0"
    )
  );

  const APP_LOG_ACTUALIZAR_CANTIDAD_CONTENEDORES = useAppSelector((state) =>
    getAppParamOrDefault(
      state,
      "APP_LOG_ACTUALIZAR_CANTIDAD_CONTENEDORES",
      "TRUE"
    )
  );


  const [actualizarcantcontenedor, setActualizarcantcontenedor] = useState<
    CheckboxProps["checked"]
  >(APP_LOG_ACTUALIZAR_CANTIDAD_CONTENEDORES === "TRUE");


  if (!dataAsignacion) {
    return;
  }

  const [dataTablaContenedores, setdataTablaContenedores] = useState<RowData[]>(
    []
  );

  const [isErrorParametrosLogisticos, setIsErrorParametrosLogisticos] =
    useState<boolean>(false);

  //Socket de errores
  //Error a Evaluar
  const [socketIsErrorTablaContenedores, setSocketIsErrorTablaContenedores] =
    useState<boolean>(false);

  //Error a Evaluar
  const [
    socketIsErrorCalculoCantidaSacos,
    setSocketIsErrorCalculoCantidaSacos,
  ] = useState<boolean>(false);

  const [cantidadContenedores, setCantidadContenedores] = useState<string>("1");
  const [cantidadSacosContenedores, setCantidadSacosContenedores] =
    useState<string>(APP_LOG_CANTIDAD_SACOS_X_CONTENEDOR_DEFAULT);

  //Error a Evaluar
  const [
    visibleErrorSacosContenedorUnicoValor,
    setVisibleErrorSacosContenedorUnicoValor,
  ] = useState<boolean>(false);

  const [errorSacosContenedorUnicoValor, setErrorSacosContenedorUnicoValor] =
    useState<ErrorAlertContent>({
      descripcion: "",
      typeError: "info",
    });
  //Error a Evaluar
  const [
    visibleErrorCantidadContenedoresUnicoValor,
    setVisibleErrorCantidadContenedoresUnicoValor,
  ] = useState<boolean>(false);

  const [
    errorCantidadContendoresUnicoValor,
    setErrorCantidadContendoresUnicoValor,
  ] = useState<ErrorAlertContent>({
    descripcion: "",
    typeError: "info",
  });

  //Error a Evaluar
  const [visibleErrorPesoContenedor, setVisibleErrorPesoContenedor] =
    useState<boolean>(false);
  const [errorPesoContenedor, setErrorPesoContenedor] =
    useState<ErrorAlertContent>({
      descripcion: "",
      typeError: "info",
    });

  //Error que no se evaluara por el socket socketIsErrorCalculoCantidaSacos
  const [visibleErrorCantidadSacos, setVisibleErrorCalculoCantidadSacos] =
    useState<boolean>(false);
  const [errorCantidaSacos, setErrorCalculoCantidadSacos] =
    useState<ErrorAlertContent>({
      descripcion: "",
      typeError: "info",
    });

  const [dataContratoPesoContendor, setDataContratoPesoContendor] = useState<
    DynamicRow[]
  >([
    {
      contrato: "CHI2511010",
      "Peso Contenedores": APP_LOG_PESO_CONTENEDOR_DEFAULT ?? "",
    },
  ]);

  useEffect(() => {
    const rawValue = dataContratoPesoContendor[0]["Peso Contenedores"];
    const valor = Number(rawValue);

    if (isNaN(valor)) {
      setVisibleErrorPesoContenedor(true);
      setErrorPesoContenedor({
        descripcion: `El peso del contenedor debe ser un número válido`,
        typeError: "error",
      });
      return;
    }

    if (valor > Number(APP_LOG_PESO_MAX_CONTENEDOR)) {
      setVisibleErrorPesoContenedor(true);
      setErrorPesoContenedor({
        descripcion: `El peso del contenedor no puede ser mayor que ${APP_LOG_PESO_MAX_CONTENEDOR}`,
        typeError: "error",
      });
    } else if (valor < Number(APP_LOG_PESO_MIN_CONTENEDOR)) {
      setVisibleErrorPesoContenedor(true);
      setErrorPesoContenedor({
        descripcion: `El peso del contenedor no puede ser menor que ${APP_LOG_PESO_MIN_CONTENEDOR}`,
        typeError: "error",
      });
    } else {
      // Valor válido
      setVisibleErrorPesoContenedor(false);
      setErrorPesoContenedor({
        descripcion: "",
        typeError: "info",
      });
    }
  }, [dataContratoPesoContendor]);

  const onChangeValueCantSacos: InputProps["onChange"] = (ev, data) => {
    setCantidadSacosContenedores(data.value);
  };

  const onChangeValueCantContenedores: InputProps["onChange"] = (ev, data) => {
    setCantidadContenedores(data.value);
  };

  useEffect(() => {
    const value = Number(dataAsignacion.pesoContenedores);

    if (actualizarcantcontenedor === true) {
      setVisibleErrorCantidadContenedoresUnicoValor(false);
      setErrorCantidadContendoresUnicoValor({
        descripcion: "",
        typeError: "info",
      });
      setVisibleErrorSacosContenedorUnicoValor(false);
      setErrorSacosContenedorUnicoValor({
        descripcion: ``,
        typeError: "info",
      });

      const totalDataTablaContendores = dataTablaContenedores.reduce(
        (acc, row) => {
          const multiplicacion = Number(row.contenedores) * Number(row.sacos);
          return acc + multiplicacion;
        },
        0
      );

      if (totalDataTablaContendores !== value) {
        setSocketIsErrorCalculoCantidaSacos(true);
        setVisibleErrorCalculoCantidadSacos(true);
        setErrorCalculoCantidadSacos({
          descripcion: `Las combinaciones elegidas da como resultado ${totalDataTablaContendores} y debería ser ${value}.`,
          typeError: "error",
        });
      } else {
        setSocketIsErrorCalculoCantidaSacos(false);
        setVisibleErrorCalculoCantidadSacos(true);
        setErrorCalculoCantidadSacos({
          descripcion: `Las combinaciones elegidas permite la cantidad exacta solicitada: ${value}`,
          typeError: "success",
        });
      }
    } else {
      if (actualizarcantcontenedor === false) {
        if (cantidadContenedores === "") {
          setVisibleErrorCantidadContenedoresUnicoValor(true);
          setErrorCantidadContendoresUnicoValor({
            descripcion: "La cantidad de contenedores no debe de ser vacio",
            typeError: "error",
          });
        } else if (cantidadContenedores === "0") {
          setVisibleErrorCantidadContenedoresUnicoValor(true);
          setErrorCantidadContendoresUnicoValor({
            descripcion: "La cantidad de contenedores no debe de ser 0",
            typeError: "error",
          });
        } else {
          setVisibleErrorCantidadContenedoresUnicoValor(false);
          setErrorCantidadContendoresUnicoValor({
            descripcion: "",
            typeError: "info",
          });
        }

        if (cantidadSacosContenedores === "") {
          setVisibleErrorSacosContenedorUnicoValor(true);
          setErrorSacosContenedorUnicoValor({
            descripcion:
              "La cantidad de sacos en contenedores no debe de ser vacio",
            typeError: "error",
          });
        } else if (cantidadSacosContenedores === "0") {
          setVisibleErrorSacosContenedorUnicoValor(true);
          setErrorSacosContenedorUnicoValor({
            descripcion:
              "La cantidad de sacos en contenedores no debe de ser 0",
            typeError: "error",
          });
        } else if (
          Number(cantidadSacosContenedores) >
          Number(APP_LOG_CANTIDAD_MAX_SACOS_X_CONTENEDOR)
        ) {
          setVisibleErrorSacosContenedorUnicoValor(true);
          setErrorSacosContenedorUnicoValor({
            descripcion: `La cantidad de sacos en contenedores no debe ser mayor a ${APP_LOG_CANTIDAD_MAX_SACOS_X_CONTENEDOR}`,
            typeError: "error",
          });
        } else if (
          Number(cantidadSacosContenedores) <
          Number(APP_LOG_CANTIDAD_MIN_SACOS_X_CONTENEDOR)
        ) {
          setVisibleErrorSacosContenedorUnicoValor(true);
          setErrorSacosContenedorUnicoValor({
            descripcion: `La cantidad de sacos en contenedores no debe ser menor a ${APP_LOG_CANTIDAD_MIN_SACOS_X_CONTENEDOR}`,
            typeError: "error",
          });
        } else {
          setVisibleErrorSacosContenedorUnicoValor(false);
          setErrorSacosContenedorUnicoValor({
            descripcion: ``,
            typeError: "info",
          });
        }

        const producto =
          Number(cantidadContenedores) * Number(cantidadSacosContenedores);

        if (producto !== value) {
          setVisibleErrorCalculoCantidadSacos(true);
          setErrorCalculoCantidadSacos({
            descripcion: `La combinación elegida da como resultado ${producto} y debería ser ${value}.`,
            typeError: "error",
          });
          setSocketIsErrorCalculoCantidaSacos(true);
        } else {
          setSocketIsErrorCalculoCantidaSacos(false);
          setVisibleErrorCalculoCantidadSacos(true);
          setErrorCalculoCantidadSacos({
            descripcion: `La combinación permite la cantidad exacta solicitada: ${value}`,
            typeError: "success",
          });
        }
      }
    }
  }, [
    cantidadSacosContenedores,
    cantidadContenedores,
    actualizarcantcontenedor,
    dataTablaContenedores,
  ]);

  const [capacidadesValues, setCapacidadesValues] = useState<ICapacidades[]>(
    []
  );

  useEffect(() => {
    if (actualizarcantcontenedor) {
      const capacidadesValues: ICapacidades[] = dataTablaContenedores.map(
        (element) => ({
          cantidad: Number(element.contenedores),
          capacidad: Number(element.sacos),
        })
      );

      setCapacidadesValues(capacidadesValues);

      setIsErrorParametrosLogisticos(
        socketIsErrorTablaContenedores ||
          socketIsErrorCalculoCantidaSacos ||
          visibleErrorPesoContenedor
      );
    } else {
      const capacidadesOnlyValue: ICapacidades[] = [
        {
          cantidad: Number(cantidadContenedores),
          capacidad: Number(cantidadSacosContenedores),
        },
      ];

      setCapacidadesValues(capacidadesOnlyValue);

      setIsErrorParametrosLogisticos(
        socketIsErrorCalculoCantidaSacos ||
          visibleErrorSacosContenedorUnicoValor ||
          visibleErrorCantidadContenedoresUnicoValor ||
          visibleErrorPesoContenedor
      );
    }
  }, [
    socketIsErrorTablaContenedores,
    socketIsErrorCalculoCantidaSacos,
    visibleErrorSacosContenedorUnicoValor,
    visibleErrorCantidadContenedoresUnicoValor,
    visibleErrorPesoContenedor,
    actualizarcantcontenedor,
    cantidadContenedores,
    cantidadSacosContenedores,
  ]);

  useEffect(() => {
    onChange?.(
      isErrorParametrosLogisticos,
      capacidadesValues,
      dataContratoPesoContendor[0]["Peso Contenedores"].toString()
    );
  }, [
    isErrorParametrosLogisticos,
    capacidadesValues,
    dataContratoPesoContendor,
  ]);

  return (
    <div className="w-full">
      <Card>
        <CardPreview>
          <div className="p-3">
            <div className="flex flex-col gap-2">
              <div className="mb-2">
                <Title title="Parámetros Logísticos" />
              </div>

              <div className="flex flex-col gap-3 ">
                <div className="w-full flex flex-col gap-2">
                  <div className="w-[40rem]">
                    <TableDynamic
                      data={dataContratoPesoContendor}
                      firstColKey="contrato"
                      editable
                      onDataChange={setDataContratoPesoContendor}
                      widthFull={false}
                      height="auto"
                      isStickyFirstCol={false}
                      paintRowCol={false}
                      titleFirstCol="Contrato"
                      width="37rem"
                    ></TableDynamic>
                  </div>

                  <div className="flex flex-col gap-2">
                    {visibleErrorPesoContenedor && (
                      <>
                        <MessageBar intent={errorPesoContenedor.typeError}>
                          <MessageBarBody>
                            <MessageBarTitle>
                              {errorPesoContenedor.typeError}
                            </MessageBarTitle>
                            {errorPesoContenedor.descripcion}
                          </MessageBarBody>
                        </MessageBar>
                      </>
                    )}
                  </div>
                </div>

                <div className="w-full flex flex-col gap-2">
                  <div className="flex items-center gap-6 ">
                    <div className="flex  justify-start items-center gap-2 ">
                      <Label>Cantidad de contenedores</Label>
                      <Input
                        style={{
                          width: "10rem",
                          border: ` 2px solid ${OrgColors.serotGris}`,
                        }}
                        onChange={onChangeValueCantContenedores}
                        value={cantidadContenedores}
                        type="number"
                        min={1}
                        disabled={actualizarcantcontenedor === true}
                        onKeyDown={(e) => {
                          if (e.key === "-" || e.key === "e" || e.key === "E") {
                            e.preventDefault(); // bloquea escribir signos y exponentes
                          }
                        }}
                      />
                    </div>
                    <div className="flex  justify-start items-center gap-2">
                      <Label>Cantidad de sacos en contenedores</Label>
                      <Input
                        style={{
                          width: "10rem",
                          border: ` 2px solid ${OrgColors.serotGris}`,
                        }}
                        value={cantidadSacosContenedores}
                        onChange={onChangeValueCantSacos}
                        type="number"
                        min={Number(APP_LOG_CANTIDAD_MIN_SACOS_X_CONTENEDOR)}
                        max={Number(APP_LOG_CANTIDAD_MAX_SACOS_X_CONTENEDOR)}
                        disabled={actualizarcantcontenedor === true}
                        onKeyDown={(e) => {
                          if (e.key === "-" || e.key === "e" || e.key === "E") {
                            e.preventDefault(); // bloquea escribir signos y exponentes
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-full flex flex-col gap-2">
                    {visibleErrorCantidadContenedoresUnicoValor && (
                      <>
                        <MessageBar
                          intent={errorCantidadContendoresUnicoValor.typeError}
                        >
                          <MessageBarBody>
                            <MessageBarTitle>
                              {errorCantidadContendoresUnicoValor.typeError}
                            </MessageBarTitle>
                            {errorCantidadContendoresUnicoValor.descripcion}
                          </MessageBarBody>
                        </MessageBar>
                      </>
                    )}

                    {visibleErrorSacosContenedorUnicoValor && (
                      <>
                        <MessageBar
                          intent={errorSacosContenedorUnicoValor.typeError}
                        >
                          <MessageBarBody>
                            <MessageBarTitle>
                              {errorSacosContenedorUnicoValor.typeError}
                            </MessageBarTitle>
                            {errorSacosContenedorUnicoValor.descripcion}
                          </MessageBarBody>
                        </MessageBar>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 ">
                <span>¿Desea definir contenedores con capacidad distinta?</span>

                <Checkbox
                  size="large"
                  label="Actualizar las cantidades de los contenedores"
                  checked={actualizarcantcontenedor}
                  onChange={(ev, data) =>
                    setActualizarcantcontenedor(data.checked)
                  }
                />

                {actualizarcantcontenedor && (
                  <>
                    <div>
                      <TablaContenedores
                        onChange={(data, isError) => {
                          setdataTablaContenedores(data);
                          setSocketIsErrorTablaContenedores(isError);
                        }}
                      />
                    </div>
                  </>
                )}
              </div>

              {visibleErrorCantidadSacos && (
                <>
                  <MessageBar intent={errorCantidaSacos.typeError}>
                    <MessageBarBody>
                      <MessageBarTitle>
                        {errorCantidaSacos.typeError}
                      </MessageBarTitle>
                      {errorCantidaSacos.descripcion}
                    </MessageBarBody>
                  </MessageBar>
                </>
              )}
            </div>
          </div>
        </CardPreview>
      </Card>
    </div>
  );
}
