"use client";

import { TableDynamic } from "@/components/ui/table-dynamic";
import {
  AppTagPickerKeyValue,
  KeyValue,
} from "@/components/ui/tagPicker-KeyValue";
import { Title } from "@/components/ui/title";
import { DynamicRow } from "@/interface";
import { ErrorAlertContent } from "@/interface/components/message-alert";
import {
  IEmparejamientos,
  IParticiones,
} from "@/interface/logistics/asignacion";
import { useAppSelector } from "@/lib/store/hooks";
import { getAppParamOrDefault } from "@/lib/store/slices/appParamsSlice";
import { AsignacionData } from "@/lib/store/slices/asignacion";
import {
  agruparPorUmVta,
  DataOferta,
  OrderKeyAgupacionUmVta,
} from "@/utils/process-data";
import {
  Card,
  CardPreview,
  Checkbox,
  CheckboxProps,
  Input,
  InputProps,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Textarea,
  TextareaProps,
} from "@fluentui/react-components";
import { useEffect, useMemo, useRef, useState } from "react";

export function OtrosParametros({
  dataAsignacion,
  onChange,
}: {
  dataAsignacion: AsignacionData | null;
  onChange?: (
    isError: boolean,
    keyParamentrosSeleccionados: string[],
    particiones: IParticiones,
    emparejamientos: IEmparejamientos,
    tiempoEspera: string
  ) => void;
}) {
  const APP_LOG_TIEMPO_ESPERA_DEFAULT = useAppSelector((state) =>
    getAppParamOrDefault(state, "APP_LOG_TIEMPO_ESPERA_DEFAULT", "300")
  );

  const APP_LOG_VALOR_DIVISION_DEFAULT = useAppSelector((state) =>
    getAppParamOrDefault(state, "APP_LOG_VALOR_DIVISION_DEFAULT", "40")
  );

  const APP_LOG_HABILITAR_DIVISION = useAppSelector((state) =>
    getAppParamOrDefault(state, "APP_LOG_HABILITAR_DIVISION", "TRUE")
  );


  

  const [dataRumasExcelList, setDataRumasExcelList] = useState<DynamicRow[]>(
    []
  );
  const [dataGruposEmparejamiento, setDataGruposEmparejamiento] = useState<
    DynamicRow[]
  >([]);

  const [habilitarDivision, setHabilitarDivision] = useState<
    CheckboxProps["checked"]
  >(APP_LOG_HABILITAR_DIVISION === "TRUE");

  //Variable general de errores en otro paramentros
  const [isErrorOtrosParamentros, setIsErrorOtrosParametros] =
    useState<boolean>(false);

  const [tiempoEspera, setTiempoEspera] = useState<string>(
    APP_LOG_TIEMPO_ESPERA_DEFAULT
  );

  //Variable a enviar al Padre
  const [
    gruposEmparejamientoCambiosValues,
    setGruposEmparejamientoCambiosValues,
  ] = useState<any[]>([]);

  //Variable Posible Envio al padre
  //Variable a evaluar
  const [valuesSelecParamentrosCalidad, setValuesSelecParamentrosCalidad] =
    useState<KeyValue[]>([]);

  //Variable no renderizar
  const [parametrosCalidad, setParametrosCalidad] = useState<KeyValue[]>([]);

  //Variable enviar a padre
  const [valuesRumas, setValuesRumas] = useState("");

  //Varaible a evaluar
  const [
    visibleErrorGruposEmparejamiento,
    setVisibleErrorGruposEmparejamiento,
  ] = useState<boolean>(false);

  const [errorGruposEmparejamiento, setErrorGruposEmparejamiento] =
    useState<ErrorAlertContent>({
      descripcion: "",
      typeError: "info",
    });

  //Variable a evaluar
  const [visibleErrorDataRumas, setVisibleErrorDataRumas] =
    useState<boolean>(false);

  const [setDataRumas, setErrorDataRumas] = useState<ErrorAlertContent>({
    descripcion: "",
    typeError: "info",
  });

  const [valuesGruposPorUmVta, setValuesGruposPorUmVta] = useState<string[]>(
    []
  );

  const [resultadoAgrupacionUmVta, setResultadoAgrupacionUmVta] = useState<
    Record<string, DataOferta>
  >({});

  const onChangeValuesRumas: TextareaProps["onChange"] = (ev, data) => {
    if (data.value.length <= 50) {
      setValuesRumas(data.value);
    }
  };

  const memoParametrosCalidad = useMemo(
    () => parametrosCalidad,
    [parametrosCalidad]
  );
  const memoValuesSelecParamentrosCalidad = useMemo(
    () => valuesSelecParamentrosCalidad,
    [valuesSelecParamentrosCalidad]
  );

  const [visibleErrorTiempoEspera, setVisibleErrorTiempoEspera] =
    useState<boolean>(false);

  const [errorTiempoEspera, setErrorTiempoespera] = useState<ErrorAlertContent>(
    {
      descripcion: "",
      typeError: "info",
    }
  );

  const onChangeTiempoEspera: InputProps["onChange"] = (ev, data) => {
    setTiempoEspera(data.value);
  };

  useEffect(() => {
    if (!dataAsignacion) {
      return;
    }
    const parametrosValues = dataAsignacion.demanda.paramentrosCalidad;

    if (parametrosValues) {
      const keyValueParametrosCalidad: KeyValue[] = Object.entries(
        parametrosValues
      ).map(([key, value]) => ({
        key,
        value: String(value),
      }));

      setParametrosCalidad(keyValueParametrosCalidad);
    }

    const dataOferta = dataAsignacion.oferta ?? {};
    const resultadoAgrupacionUmVta = agruparPorUmVta(dataOferta);

    let keysAgrupacionUmVta = resultadoAgrupacionUmVta
      ? Object.keys(resultadoAgrupacionUmVta)
      : [];
    const keysAgrupacionOrdernados =
      OrderKeyAgupacionUmVta(keysAgrupacionUmVta);

    // Variables de keys y resultado
    setResultadoAgrupacionUmVta(resultadoAgrupacionUmVta);
    setValuesGruposPorUmVta(keysAgrupacionOrdernados);

    const nuevosGrupoEmparejamiento: DynamicRow[] =
      keysAgrupacionOrdernados.map((element) => ({
        grupo: element,
      }));

    setDataGruposEmparejamiento(nuevosGrupoEmparejamiento);
  }, [dataAsignacion]);

  useEffect(() => {
    if (!dataAsignacion) return;

    const dataLotes = dataAsignacion.oferta ?? {};
    const loteKeys = Object.keys(dataLotes);

    if (habilitarDivision) {
      setValuesRumas("");
      const nuevosDatos: DynamicRow[] = loteKeys.map((element) => ({
        ruma: element,
        División: APP_LOG_VALOR_DIVISION_DEFAULT,
      }));
      setDataRumasExcelList(nuevosDatos);
    } else {
      setDataRumasExcelList([]);
    }
  }, [dataAsignacion, habilitarDivision]);

  useEffect(() => {
    if (!valuesSelecParamentrosCalidad) return;

    setDataGruposEmparejamiento((prevData) => {
      const updated = prevData.map((row) => {
        const newRow: DynamicRow = { ...row };
        valuesSelecParamentrosCalidad.forEach((param) => {
          if (!(param.key in newRow)) {
            newRow[param.key] = param.value;
          }
        });

        Object.keys(newRow).forEach((key) => {
          if (
            key !== "grupo" &&
            !valuesSelecParamentrosCalidad.find((p) => p.key === key)
          ) {
            delete newRow[key];
          }
        });

        return newRow;
      });

      const isEqual =
        updated.length === prevData.length &&
        updated.every((row, i) => {
          const prevRow = prevData[i];
          const keysRow = Object.keys(row);
          const keysPrev = Object.keys(prevRow);

          if (keysRow.length !== keysPrev.length) return false;

          return keysRow.every((k) => row[k] === prevRow[k]);
        });

      return isEqual ? prevData : updated;
    });
  }, [valuesSelecParamentrosCalidad]);

  const [particiones, setParticiones] = useState<IParticiones>({});

  useEffect(() => {
    // Para cambio brusco de variable boleana
    setErrorDataRumas({
      descripcion: "",
      typeError: "info",
    });
    setVisibleErrorDataRumas(false);

    if (!habilitarDivision) {
      if (!valuesRumas) {
        setErrorDataRumas({
          descripcion: `División de rumas no puede estar vacío`,
          typeError: "error",
        });
        setVisibleErrorDataRumas(true);
        return;
      }
      const divisionRumas = valuesRumas.split(",").map((d) => d.trim());
      // Caso especial: coma al final (último elemento vacío)
      if (divisionRumas[divisionRumas.length - 1] === "") {
        setErrorDataRumas({
          descripcion: `División de rumas termina con coma sin número posterior`,
          typeError: "error",
        });
        setVisibleErrorDataRumas(true);
        return;
      }

      // Validar que todos sean números válidos
      const notNumbers = divisionRumas.filter(
        (d) => d === "" || isNaN(Number(d))
      );

      if (notNumbers.length > 0) {
        setErrorDataRumas({
          descripcion: `División contiene valores no numéricos '${notNumbers.join(
            ", "
          )}'`,
          typeError: "error",
        });
        setVisibleErrorDataRumas(true);
        return;
      }
      return;
    }

    if (dataRumasExcelList.length === 0) return;

    let hasError = false;

    for (let i = 0; i < dataRumasExcelList.length; i++) {
      const row = dataRumasExcelList[i];
      const divisionRaw = row["División"]?.toString().trim() ?? "";

      // 1. No vacío
      if (!divisionRaw) {
        setErrorDataRumas({
          descripcion: `Fila ${i + 1}: División no puede estar vacío`,
          typeError: "error",
        });
        setVisibleErrorDataRumas(true);
        hasError = true;
        break;
      }

      // 2. No cero
      if (divisionRaw === "0") {
        setErrorDataRumas({
          descripcion: `Fila ${i + 1}: División no puede ser 0`,
          typeError: "error",
        });
        setVisibleErrorDataRumas(true);
        hasError = true;
        break;
      }

      // 3. Separar por comas y validar números
      const divisiones = divisionRaw.split(",").map((d) => d.trim());

      // Caso especial: coma al final (último elemento vacío)
      if (divisiones[divisiones.length - 1] === "") {
        setErrorDataRumas({
          descripcion: `Fila ${
            i + 1
          }: División termina con coma sin número posterior`,
          typeError: "error",
        });
        setVisibleErrorDataRumas(true);
        hasError = true;
        break;
      }

      // Validar que todos sean números válidos
      const notNumbers = divisiones.filter((d) => d === "" || isNaN(Number(d)));

      if (notNumbers.length > 0) {
        setErrorDataRumas({
          descripcion: `Fila ${
            i + 1
          }: División contiene valores no numéricos (${notNumbers.join(", ")})`,
          typeError: "error",
        });
        setVisibleErrorDataRumas(true);
        hasError = true;
        break;
      }

      // Si todo ok, limpiar errores
      setErrorDataRumas({
        descripcion: "",
        typeError: "info",
      });
      setVisibleErrorDataRumas(false);
    }

    if (!hasError) {
      // ✅ No hay errores → separar filas según regla de "40"
      const filasConDivisionFiltrada = dataRumasExcelList.filter((row) => {
        const divisionRaw = row["División"]?.toString().trim() ?? "";
        const divisiones = divisionRaw.split(",").map((d) => d.trim());
        return !(
          divisiones.length === 1 &&
          divisiones[0] === APP_LOG_VALOR_DIVISION_DEFAULT
        );
      });

      const particiones: IParticiones = filasConDivisionFiltrada.reduce(
        (acc, item) => {
          acc[item.ruma] = String(item["División"].toString()); // 👈 conversión explícita
          return acc;
        },
        {} as IParticiones
      );
      setParticiones(particiones);
    }
  }, [dataRumasExcelList, habilitarDivision, valuesRumas]);

  useEffect(() => {
    if (!dataGruposEmparejamiento || dataGruposEmparejamiento.length === 0) {
      setGruposEmparejamientoCambiosValues([]);
      setErrorGruposEmparejamiento({ descripcion: "", typeError: "info" });
      setVisibleErrorGruposEmparejamiento(false);
      return;
    }

    const valuesInicialesParametrosCalidad = parametrosCalidad;
    const gruposConCambios: any[] = [];
    let error: ErrorAlertContent | null = null;

    // etiqueta opcional por si necesitas romper doble loop
    outer: for (
      let rowIndex = 0;
      rowIndex < dataGruposEmparejamiento.length;
      rowIndex++
    ) {
      const grupo = dataGruposEmparejamiento[rowIndex];
      const cambios: any = { grupo: grupo.grupo };

      for (const param of Object.keys(grupo)) {
        if (param === "grupo") continue;
        const valor = grupo[param];

        // 🔎 Validaciones
        if (valor === "" || valor == null) {
          error = {
            descripcion: `Fila ${rowIndex + 1} '${
              grupo.grupo
            }' - '${param}': vacío no permitido`,
            typeError: "error",
          };
          break outer; // 👈 cortamos en el primer error
        }

        if (!/^\d+(\.\d+)?$/.test(String(valor))) {
          error = {
            descripcion: `Fila ${rowIndex + 1} '${
              grupo.grupo
            }' - '${param}': debe ser número con punto decimal`,
            typeError: "error",
          };
          break outer;
        }

        const num = parseFloat(String(valor));
        if (num <= 0) {
          error = {
            descripcion: `Fila ${rowIndex + 1} '${
              grupo.grupo
            }' - '${param}': debe ser mayor que 0`,
            typeError: "error",
          };
          break outer;
        }

        // Solo registrar cambios válidos
        const inicial = valuesInicialesParametrosCalidad.find(
          (p) => p.key === param
        );
        if (inicial && inicial.value !== String(valor)) {
          cambios[param] = valor;
        }
      }

      if (Object.keys(cambios).length > 1) {
        gruposConCambios.push(cambios);
      }
    }

    if (error) {
      setErrorGruposEmparejamiento(error);
      setVisibleErrorGruposEmparejamiento(true);
      setGruposEmparejamientoCambiosValues([]); // no guardamos nada si hay error
    } else {
      setErrorGruposEmparejamiento({ descripcion: "", typeError: "info" });
      setVisibleErrorGruposEmparejamiento(false);
      setGruposEmparejamientoCambiosValues(gruposConCambios);
    }
  }, [dataGruposEmparejamiento]);

  useEffect(() => {
    if (!tiempoEspera) {
      setVisibleErrorTiempoEspera(true);
      setErrorTiempoespera({
        descripcion: "El tiempo de espera no puede ser vacio",
        typeError: "error",
      });
    } else if (tiempoEspera === "0") {
      setVisibleErrorTiempoEspera(true);
      setErrorTiempoespera({
        descripcion: "El tiempo de espera no puede ser 0",
        typeError: "error",
      });
    } else {
      setVisibleErrorTiempoEspera(false);
      setErrorTiempoespera({
        descripcion: "",
        typeError: "info",
      });
    }
  }, [tiempoEspera]);

  useEffect(() => {
    setIsErrorOtrosParametros(
      visibleErrorDataRumas ||
        visibleErrorGruposEmparejamiento ||
        valuesSelecParamentrosCalidad.length === 0 ||
        visibleErrorTiempoEspera
    );
  }, [
    visibleErrorDataRumas,
    visibleErrorGruposEmparejamiento,
    valuesSelecParamentrosCalidad,
    visibleErrorTiempoEspera,
  ]);

  useEffect(() => {
    const keysParamentrosSeleccionados = valuesSelecParamentrosCalidad.map(
      (item) => item.key
    );

    const particionesDefault: IParticiones = { "*": valuesRumas };

    const particionesValue = habilitarDivision
      ? particiones
      : particionesDefault;

    const emparejamientos: IEmparejamientos =
      gruposEmparejamientoCambiosValues.reduce((acc, item) => {
        const { grupo, ...rest } = item;

        // Convertir todos los valores string a number
        const parametros = Object.fromEntries(
          Object.entries(rest).map(([k, v]) => [k, Number(v)])
        );

        acc[grupo] = parametros;
        return acc;
      }, {} as IEmparejamientos);

    onChange?.(
      isErrorOtrosParamentros,
      keysParamentrosSeleccionados,
      particionesValue,
      emparejamientos,
      tiempoEspera
    );
  }, [
    isErrorOtrosParamentros,
    valuesSelecParamentrosCalidad,
    particiones,
    gruposEmparejamientoCambiosValues,
    tiempoEspera,
    valuesRumas,
  ]);

  return (
    <div className="w-full">
      <Card>
        <CardPreview>
          <div className="p-3 ">
            <div className="flex flex-col gap-4">
              <div>
                <Title title="Otros Paramentros" />
              </div>

              <div className="flex flex-col gap-0.5">
                <AppTagPickerKeyValue
                  options={memoParametrosCalidad}
                  value={memoValuesSelecParamentrosCalidad}
                  onChange={(newValues) => {
                    const prevKeys = valuesSelecParamentrosCalidad
                      .map((v) => v.key)
                      .sort();
                    const newKeys = newValues.map((v) => v.key).sort();

                    const same =
                      prevKeys.length === newKeys.length &&
                      prevKeys.every((k, i) => k === newKeys[i]);

                    if (!same) {
                      setValuesSelecParamentrosCalidad(newValues);
                    }
                  }}
                  size="medium"
                  label="Elige uno o más parámetros"
                  sizeLabel="medium"
                  requieredLabel={false}
                  placeholder="Seleccione centros de ubicación"
                  keyView={true}
                />

                {valuesSelecParamentrosCalidad.length === 0 && (
                  <span className="text-red-400">
                    Los parametros son requeridos
                  </span>
                )}
              </div>

              <div>
                <Checkbox
                  size="large"
                  label="Habilitar división por ruma"
                  checked={habilitarDivision}
                  onChange={(ev, data) => setHabilitarDivision(data.checked)}
                />
              </div>

              <div className="flex w-full gap-6 pb-10">
                <div className="flex flex-col gap-3 w-1/3 ">
                  {!habilitarDivision ? (
                    <>
                      <Textarea
                        placeholder="Ingresa valor"
                        style={{ height: "6rem" }}
                        value={valuesRumas}
                        onChange={onChangeValuesRumas}
                      />
                    </>
                  ) : (
                    <>
                      <span className="font-semibold">División de rumas</span>
                      <TableDynamic
                        data={dataRumasExcelList}
                        editable
                        firstColKey="ruma"
                        onDataChange={setDataRumasExcelList}
                        widthFull={false}
                        height="auto"
                        isStickyFirstCol={false}
                        paintRowCol={false}
                        titleFirstCol="Rumas"
                        isChangeBold={true}
                      ></TableDynamic>
                    </>
                  )}

                  <div className="flex flex-col gap-2">
                    {visibleErrorDataRumas && (
                      <>
                        <MessageBar intent={setDataRumas.typeError}>
                          <MessageBarBody>
                            <MessageBarTitle>
                              {setDataRumas.typeError}
                            </MessageBarTitle>
                            {setDataRumas.descripcion}
                          </MessageBarBody>
                        </MessageBar>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3 w-2/3">
                  <span className="font-semibold">Emparejamiento</span>
                  <TableDynamic
                    data={dataGruposEmparejamiento}
                    editable
                    firstColKey="grupo"
                    onDataChange={setDataGruposEmparejamiento}
                    widthFull={false}
                    height="auto"
                    isStickyFirstCol={false}
                    paintRowCol={false}
                    titleFirstCol="Grupos"
                    isChangeBold={true}
                  ></TableDynamic>

                  <div className="flex flex-col gap-2">
                    {visibleErrorGruposEmparejamiento && (
                      <>
                        <MessageBar
                          intent={errorGruposEmparejamiento.typeError}
                        >
                          <MessageBarBody>
                            <MessageBarTitle>
                              {errorGruposEmparejamiento.typeError}
                            </MessageBarTitle>
                            {errorGruposEmparejamiento.descripcion}
                          </MessageBarBody>
                        </MessageBar>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-end">
                <div className="w-1/4 flex flex-col gap-2">
                  <div className="w-full flex justify-end">
                    <div className="bg-red-500 w-auto py-2 rounded-xs px-3 flex gap-3 items-center">
                      <span className="text-white">Tiempo de espera: </span>
                      <Input
                        value={tiempoEspera}
                        type="number"
                        size="large"
                        min={1}
                        onKeyDown={(e) => {
                          if (e.key === "-" || e.key === "e" || e.key === "E") {
                            e.preventDefault(); // bloquea escribir signos y exponentes
                          }
                        }}
                        onChange={onChangeTiempoEspera}
                      ></Input>
                    </div>
                  </div>

                  {visibleErrorTiempoEspera && (
                    <>
                      <MessageBar intent={errorTiempoEspera.typeError}>
                        <MessageBarBody>
                          <MessageBarTitle>
                            {errorTiempoEspera.typeError}
                          </MessageBarTitle>
                          {errorTiempoEspera.descripcion}
                        </MessageBarBody>
                      </MessageBar>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardPreview>
      </Card>
    </div>
  );
}
