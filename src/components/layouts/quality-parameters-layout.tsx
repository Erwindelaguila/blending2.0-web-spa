import React, { useEffect, useRef, useState } from "react";
import { Input, makeStyles } from "@fluentui/react-components";

// Tipo para las filas
interface FilaDato {
  [key: string]: string;
}

// Simulación de datos desde API
const filasIniciales: FilaDato[] = [
  {
    CALIDAD: "CALIDAD-01",
    PARAM01: "67.9",
    PARAM02: "480",
    PARAM03: "654",
    PARAM04: "634",
    PARAM05: "32",
    PARAM06: "32",
    PARAM07: "32",
    PARAM08: "32",
    PARAM09: "32",
    CAMBIO: "678",
    TOTAL: "3335",
  },
  {
    CALIDAD: "CALIDAD-02",
    PARAM01: "67",
    PARAM02: "456",
    PARAM03: "634",
    PARAM04: "632",
    PARAM05: "12",
    PARAM06: "32",
    PARAM07: "32",
    PARAM08: "32",
    PARAM09: "32",
    CAMBIO: "12",
    TOTAL: "1000",
  },
  {
    CALIDAD: "CALIDAD-03",
    PARAM01: "66.9",
    PARAM02: "234",
    PARAM03: "342",
    PARAM04: "763",
    PARAM05: "76",
    PARAM06: "32",
    PARAM07: "32",
    PARAM08: "32",
    PARAM09: "32",
    CAMBIO: "763",
    TOTAL: "8618",
  },
  {
    CALIDAD: "CALIDAD-04",
    PARAM01: "66.9",
    PARAM02: "234",
    PARAM03: "342",
    PARAM04: "763",
    PARAM05: "76",
    PARAM06: "32",
    PARAM07: "32",
    PARAM08: "32",
    PARAM09: "32",
    CAMBIO: "763",
    TOTAL: "8618",
  },
];

const useStyles = makeStyles({
  container: {
    maxHeight: "30rem",
    overflow: "auto",
    border: "1px solid #ccc",
    position: "relative",
  },
  wrapper: {
    display: "inline-block",
    minWidth: "100%",
    overflow: "auto",
    position: "relative",
  },
  table: {
    borderCollapse: "collapse",
    width: "100%",
    minWidth: "max-content",
  },
  th: {
    border: "1px solid #cddc39",
    padding: "4px",
    minWidth: "100px",
    textAlign: "center",
    backgroundColor: "white",
    position: "sticky",
    top: "32px",
    zIndex: 3,
  },
  topRow: {
    backgroundColor: "#e9f5e9",
    top: "0px",
    zIndex: 4,
  },
  fixedColumn: {
    position: "sticky",
    left: 0,
    backgroundColor: "#f9f9f9",
    zIndex: 5,
  },
});

export function QualityParametersLayout() {
  const [filas, setFilas] = useState<FilaDato[]>(filasIniciales);

  const filasOriginalesRef = useRef<FilaDato[]>(filasIniciales);

  const styles = useStyles();

  const keys = Object.keys(filas[0]);
  const keyCalidad = keys[0];

  const columnas = keys.slice(1);

  const [encabezadoSuperior, setEncabezadoSuperior] = useState<string[]>(
    columnas.map(() => "0")
  );

  const esNoEditable = (idx: number) => idx >= columnas.length - 2; // las dos últimas no son editables

  const actualizarCelda = (
    filaIndex: number,
    columIndex: number,
    value: string
  ) => {
    const esNumeroPositivoDecimal = /^\d*\.?\d*$/.test(value);
    if (!esNumeroPositivoDecimal) {
      return;
    }

    const nuevasFilas = [...filas];
    const key = columnas[columIndex];

    if (value.trim() === "") {
      nuevasFilas[filaIndex][key] = "";
      setFilas(nuevasFilas);
      return;
    }

    nuevasFilas[filaIndex][key] = value;
    setFilas(nuevasFilas);
    filasOriginalesRef.current[filaIndex][key] = value;
  };

  const actualizarEncabezado = (index: number, value: string) => {
    if (!/^-?\d*\.?\d*$/.test(value)) return;

    const nuevos = [...encabezadoSuperior];

    if (value.trim() === "") {
      nuevos[index] = "";
      setEncabezadoSuperior(nuevos);
      return;
    }

    nuevos[index] = value;
    setEncabezadoSuperior(nuevos); // Aquí ya no modificamos filas directamente
  };

  const aplicarAjusteEncabezado = (index: number) => {
    const ajusteStr = encabezadoSuperior[index];
    const ajuste = parseFloat(ajusteStr);

    if (isNaN(ajuste)) return;

    const nuevasFilas = filas.map((fila) => {
      const nuevaFila = { ...fila };
      const key = columnas[index];
      const actual = parseFloat(nuevaFila[key] || "0");
      nuevaFila[key] = (actual + ajuste).toFixed(2);
      return nuevaFila;
    });

    setFilas(nuevasFilas);

    // Reiniciar encabezado a 0
    const nuevosEncabezados = [...encabezadoSuperior];
    nuevosEncabezados[index] = "0";
    setEncabezadoSuperior(nuevosEncabezados);
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th
                className={`${styles.th} ${styles.topRow} ${styles.fixedColumn}`}
              />
              {columnas.map((col, idx) => (
                <th
                  key={`top-${idx}`}
                  className={`${styles.th} ${styles.topRow} ${
                    esNoEditable(idx) ? styles.fixedColumn : ""
                  }`}
                >
                  {!esNoEditable(idx) && (
                    <Input
                      value={encabezadoSuperior[idx]?.toString() ?? ""}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          aplicarAjusteEncabezado(idx);
                        }
                      }}
                      onChange={(e) =>
                        actualizarEncabezado(idx, e.target.value)
                      }
                      style={{ textAlign: "center", width: "80px" }}
                    />
                  )}
                </th>
              ))}
            </tr>
            <tr>
              <th className={`${styles.th} ${styles.fixedColumn}`}>
                {keyCalidad}
              </th>
              {columnas.map((col, idx) => (
                <th
                  key={`header-${idx}`}
                  className={`${styles.th} ${
                    esNoEditable(idx) ? styles.fixedColumn : ""
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filas.map((fila, filaIdx) => (
              <tr key={`fila-${filaIdx}`}>
                <td className={styles.fixedColumn}>{fila[keyCalidad]}</td>
                {columnas.map((col, colIdx) => (
                  <td
                    key={`celda-${filaIdx}-${colIdx}`}
                    className={esNoEditable(colIdx) ? styles.fixedColumn : ""}
                    style={{
                      border: "1px solid #ccc",
                      padding: "2px",
                      minWidth: "100px",
                    }}
                  >
                    <Input
                      value={fila[col] ?? ""}
                      onChange={(e) =>
                        actualizarCelda(filaIdx, colIdx, e.target.value)
                      }
                      style={{ textAlign: "center", width: "100%" }}
                      type="text"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
