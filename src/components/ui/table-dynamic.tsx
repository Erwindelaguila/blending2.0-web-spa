"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHeader,
  TableHeaderCell,
  Input,
  Text,
} from "@fluentui/react-components";
import { useEffect, useMemo, useRef, useState } from "react";
import { mergeClasses } from "@fluentui/react-components";
import { useTableDynamicStyles } from "@/styles/table-dynamic";
import { DynamicRow, ITableDynamicProps } from "@/interface";

// Helpers
const deepCopy = <T,>(x: T): T => JSON.parse(JSON.stringify(x));

const getColumns = (rows: DynamicRow[], firstColKey: string) => {
  const set = new Set<string>();
  if (!rows || !Array.isArray(rows)) {
    return [];
  }
  rows.forEach((r) =>
    Object.keys(r).forEach((k) => k !== firstColKey && set.add(k))
  );
  return Array.from(set);
};

const sameSet = (a: string[], b: string[]) => {
  if (a.length !== b.length) return false;
  const A = new Set(a);
  return b.every((x) => A.has(x));
};

// Construye nuevo snapshot cuando cambian columnas.
// - Mantiene baseline previo para columnas existentes.
// - Para columnas nuevas, toma como baseline el valor actual.
function mergeBaselineByKey(
  prevBaseline: DynamicRow[],
  newData: DynamicRow[],
  columns: string[],
  firstColKey: string
): DynamicRow[] {
  const prevMap = new Map<string, DynamicRow>();
  prevBaseline.forEach((r) => prevMap.set(String(r[firstColKey]), r));

  return newData.map((row) => {
    const key = String(row[firstColKey]);
    const prev = prevMap.get(key) ?? {};
    const merged: DynamicRow = { [firstColKey]: row[firstColKey] };

    columns.forEach((col) => {
      if (prev && Object.prototype.hasOwnProperty.call(prev, col)) {
        merged[col] = prev[col];
      } else {
        // Nueva columna: baseline = valor actual
        merged[col] = row[col];
      }
    });

    return merged;
  });
}

export function TableDynamic({
  data,
  firstColKey = "calidad",
  titleFirstCol = "Default",
  editable = false,
  widthFull = false,
  height = "auto",
  isStickyFirstCol = false,
  onDataChange,
  uppercaseTitle = false,
  width = "20rem",
  isChangeBold = false,
}: ITableDynamicProps) {
  const styles = useTableDynamicStyles();

  const [localData, setLocalData] = useState<DynamicRow[]>(data || []);
  const [originalData, setOriginalData] = useState<DynamicRow[]>([]);
  const [changedCells, setChangedCells] = useState<Set<string>>(new Set());

  // Guardamos las columnas "conocidas" para detectar cambios estructurales.
  const lastColsRef = useRef<string[]>([]);

  // 1) Sincroniza localData SIEMPRE con la prop data.
  //    PERO el snapshot (originalData) SOLO se inicializa una vez o
  //    se recalcula cuando cambian las columnas (no cuando cambian valores).
  useEffect(() => {
    const safeData = data || [];
    setLocalData(safeData);

    const incomingCols = getColumns(safeData, firstColKey);

    if (originalData.length === 0) {
      setOriginalData(deepCopy(safeData));
      lastColsRef.current = incomingCols;
      return;
    }

    // ¿Cambió la estructura de columnas?
    if (!sameSet(incomingCols, lastColsRef.current)) {
      const merged = mergeBaselineByKey(
        originalData,
        safeData,
        incomingCols,
        firstColKey
      );
      setOriginalData(merged);
      lastColsRef.current = incomingCols;
    }
  }, [data, firstColKey]); // <- no dependas de originalData aquí

  // 2) Columnas actuales (derivadas de localData)
  const paramKeys = useMemo(
    () => getColumns(localData, firstColKey),
    [localData, firstColKey]
  );

  // 3) Recalcula celdas cambiadas cada vez que cambia localData o el snapshot.
  useEffect(() => {
    if (originalData.length === 0) return;

    const origByKey = new Map<string, DynamicRow>();
    originalData.forEach((r) => origByKey.set(String(r[firstColKey]), r));

    const newChanged = new Set<string>();

    localData.forEach((row) => {
      const rowKey = String(row[firstColKey]);
      const origRow = origByKey.get(rowKey) ?? {};
      paramKeys.forEach((col) => {
        const currentValue = String(row[col] ?? "");
        const originalValue = String(origRow[col] ?? "");
        if (currentValue !== originalValue) {
          newChanged.add(`${rowKey}-${col}`);
        }
      });
    });

    setChangedCells(newChanged);
  }, [localData, originalData, paramKeys, firstColKey]);

  // 4) Cambio de input (usa data.value en Fluent UI v9)
  const handleChange = (rowIndex: number, key: string, value: string) => {
    setLocalData((prev) => {
      const updated = [...prev];
      updated[rowIndex] = { ...updated[rowIndex], [key]: value };
      return updated;
    });
  };

  useEffect(() => {
    onDataChange?.(localData);
  }, [localData, onDataChange]);

  if (!localData || localData.length === 0) {
    return (
      <div className={styles.container} style={{ height }}>
        <Table style={{ minWidth: widthFull ? "100%" : "20rem", width: "fit-content" }}>
          <TableBody>
            <TableRow>
              <TableCell>
                <Text align="center" size={300}>
                  No hay datos que mostrar
                </Text>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  const renderContent = () =>
    localData.map((row, i) => {
      const rowKey = String(row[firstColKey]);
      const rowChanged = paramKeys.some((param) =>
        changedCells.has(`${rowKey}-${param}`)
      );

      return (
        <TableRow key={rowKey}>
          <TableCell
            className={mergeClasses(
              isStickyFirstCol
                ? mergeClasses(styles.stickyFirstCol, styles.stickyFirstHeader)
                : styles.defaultDataFirstCol
            )}
          >
            <span
              className={
                isChangeBold
                  ? rowChanged
                    ? "font-bold"
                    : "font-normal"
                  : "font-normal"
              }
            >
              {row[firstColKey]}
            </span>
          </TableCell>

          {paramKeys.map((param) => {
            const cellChanged = changedCells.has(`${rowKey}-${param}`);

            return (
              <TableCell
                key={`${rowKey}-${param}`}
                className={mergeClasses(styles.bodyCell)}
              >
                {editable ? (
                  <Input
                    type="text"
                    value={String(row[param] ?? "")}
                    onChange={(_, data) =>
                      handleChange(i, param, data?.value ?? "")
                    }
                    style={{
                      width: "100%",
                      border: "none",
                      background: "transparent",
                      textAlign: "center",
                      fontWeight: isChangeBold
                        ? cellChanged
                          ? ("bold" as const)
                          : ("normal" as const)
                        : "normal",
                    }}
                  />
                ) : (
                  String(row[param] ?? "-")
                )}
              </TableCell>
            );
          })}
        </TableRow>
      );
    });

  return (
    <div className={styles.container} style={{ height }}>
      <Table
        style={{
          minWidth: widthFull ? "100%" : `${width}`,
          width: "fit-content",
        }}
      >
        <TableHeader>
          <TableRow>
            <TableHeaderCell
              className={mergeClasses(
                styles.headerCell,
                isStickyFirstCol
                  ? mergeClasses(
                      styles.stickyFirstCol,
                      styles.stickyFirstHeader
                    )
                  : styles.defaultFirstCol
              )}
            >
              <span
                className={`text-center w-full ${
                  uppercaseTitle ? "uppercase" : ""
                }`}
              >
                {titleFirstCol}
              </span>
            </TableHeaderCell>
            {paramKeys.map((param) => (
              <TableHeaderCell key={`h-${param}`} className={styles.headerCell}>
                <span className="w-full text-center">{param}</span>
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>{renderContent()}</TableBody>
      </Table>
    </div>
  );
}
