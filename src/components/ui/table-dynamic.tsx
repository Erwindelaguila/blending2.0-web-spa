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
import { ValidationUtils } from "@/utils/validation-utils";

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
  numericValidation,
}: ITableDynamicProps) {
  const styles = useTableDynamicStyles();

  const [localData, setLocalData] = useState<DynamicRow[]>(data || []);
  const [originalData, setOriginalData] = useState<DynamicRow[]>([]);
  const [changedCells, setChangedCells] = useState<Set<string>>(new Set());

  const lastColsRef = useRef<string[]>([]);
  const isInitializedRef = useRef<boolean>(false);
  const editingRef = useRef(false);
  const lastPropDataRef = useRef<DynamicRow[] | null>(null);


  useEffect(() => {
    const safeData = data || [];

    if (editingRef.current) {
      editingRef.current = false;
    } else {
      const propChanged = lastPropDataRef.current !== safeData;
      if (propChanged) {
        const prev = lastPropDataRef.current;
        let shallowEqual = false;
        if (prev && prev.length === safeData.length) {
          shallowEqual = safeData.every((row, idx) => row === prev[idx]);
        }
        if (!shallowEqual) {
          setLocalData(safeData);
        }
        lastPropDataRef.current = safeData;
      }
    }

    const incomingCols = getColumns(safeData, firstColKey);

    if (!isInitializedRef.current) {
      setOriginalData(deepCopy(safeData));
      lastColsRef.current = incomingCols;
      isInitializedRef.current = true;
      return;
    }

    if (!sameSet(incomingCols, lastColsRef.current)) {
      setOriginalData(prevOriginal => {
        const merged = mergeBaselineByKey(
          prevOriginal,
          safeData,
          incomingCols,
          firstColKey
        );
        return merged;
      });
      lastColsRef.current = incomingCols;
    }
  }, [data, firstColKey]); 

  const paramKeys = useMemo(
    () => getColumns(localData, firstColKey),
    [localData, firstColKey]
  );

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

  const handleChange = (rowIndex: number, key: string, value: string) => {
    let formattedValue = value;
    
    if (numericValidation?.enabled) {
      const shouldValidate = !numericValidation.columns || 
                           numericValidation.columns.includes(key);
      
      if (shouldValidate) {
        const config = {
          mode: numericValidation.mode || 'auto',
          integerMaxDigits: numericValidation.integerMaxDigits || 5,
          decimalIntegerMaxDigits: numericValidation.decimalIntegerMaxDigits || 4,
          decimalDigits: numericValidation.decimalDigits || 3,
          padOnBlur: numericValidation.padOnBlur !== false,
          allowLeadingDot: numericValidation.allowLeadingDot !== false,
        };
        
        formattedValue = ValidationUtils.validateAndFormatNumber(value, false);
      }
    }
    
    editingRef.current = true; 
    
    setLocalData((prev) => {
      const updated = [...prev];
      updated[rowIndex] = { ...updated[rowIndex], [key]: formattedValue };
      return updated;
    });
  };

  const handleBlur = (rowIndex: number, key: string, value: string) => {
    if (!numericValidation?.enabled) return;
    
    const shouldValidate = !numericValidation.columns || 
                         numericValidation.columns.includes(key);
    
    if (shouldValidate && numericValidation.padOnBlur !== false) {
      const finalized = ValidationUtils.finalizeNumber(value);
      if (finalized !== value) {
        handleChange(rowIndex, key, finalized);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, rowIndex: number, key: string) => {
    if (!numericValidation?.enabled) return;
    
    const shouldValidate = !numericValidation.columns || 
                         numericValidation.columns.includes(key);
    
    if (shouldValidate) {
      ValidationUtils.handleNumberInput(e);
    }
  };  
  const onDataChangeRef = useRef(onDataChange);
  onDataChangeRef.current = onDataChange;

  useEffect(() => {
    if (onDataChangeRef.current) {
      onDataChangeRef.current(localData);
    }
  }, [localData]);

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
                    onChange={(_, data) => handleChange(i, param, data?.value ?? "")}
                    onBlur={(e) => handleBlur(i, param, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, i, param)}
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
