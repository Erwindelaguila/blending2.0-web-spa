"use client";

import { useEffect, useRef, useState } from "react";
import { Input, Button, Label } from "@fluentui/react-components";
import { Add20Regular, Subtract20Regular } from "@fluentui/react-icons";
import { useQualityParametersStyles } from "@/styles/quality-parameters.styles";
import { useAppDispatch } from "@/lib/store/hooks";
import { nextStep } from "@/lib/store/slices/stepSlice";

interface FilaDato {
  [key: string]: string;
}

interface HoveredCell {
  row: number;
  col: string;
  type?: "header" | "data";
}

interface ColumnConfig {
  keys: string[];
  keyCalidad: string;
  columnas: string[];
  columnasFijas: string[];
  columnasParams: string[];
  paramsGridColumns: string;
}

interface ProcessConfig {
  numeroRumas: number;
  divisionRumas: number;
  parametros: FilaDato[];
  totalParametros: number;
}

const MIN_RUMAS = 2;
const MAX_DIVISION = 50;
const MIN_DIVISION = 1;
const CALIDAD_MAX_LENGTH = 8;
const PARAM_MAX_LENGTH = 6;
const DECIMAL_REGEX = /^\d*\.?\d$/;
const SIGNED_DECIMAL_REGEX = /^-?\d*\.?\d$/;

const filasIniciales: FilaDato[] = [
  {
    CALIDAD: "CALIDAD-01",
    P: "67.9",
    PARAM02: "480",
    PARAM03: "15.2",
    PARAM04: "456",
    PARAM05: "14.8",
    PARAM06: "456",
    PARAM07: "14.8",
    PARAM08: "456",
    PARAM09: "14.8",
    PARAM010: "14.8",
    PARAM011: "14.8",
    PARAM012: "14.8",
    PARAM013: "14.8",
    PARAM014: "14.8",
    PARAM015: "14.8",
    PARAM016: "14.8",
    PARAM017: "14.8",
    PARAM018: "14.8",
    CADMIO: "678",
    TOTAL: "3335",
  },
  {
    CALIDAD: "CALIDAD-02",
    P: "67.0",
    PARAM02: "456",
    PARAM03: "14.8",
    PARAM04: "456",
    PARAM05: "14.8",
    PARAM06: "456",
    PARAM07: "14.8",
    PARAM08: "456",
    PARAM09: "14.8",
    PARAM010: "14.8",
    PARAM011: "14.8",
    PARAM012: "14.8",
    PARAM013: "14.8",
    PARAM014: "14.8",
    PARAM015: "14.8",
    PARAM016: "14.8",
    PARAM017: "14.8",
    PARAM018: "14.8",
    CADMIO: "12",
    TOTAL: "1000",
  },
  {
    CALIDAD: "CALIDAD-03",
    P: "66.9",
    PARAM02: "234",
    PARAM03: "16.1",
    CADMIO: "763",
    TOTAL: "8618",
  },
  {
    CALIDAD: "CALIDAD-04",
    P: "68.2",
    PARAM02: "512",
    PARAM03: "14.5",
    PARAM04: "456",
    PARAM05: "14.8",
    PARAM06: "456",
    PARAM07: "14.8",
    PARAM08: "456",
    PARAM09: "14.8",
    PARAM010: "14.8",
    PARAM011: "14.8",
    PARAM012: "14.8",
    PARAM013: "14.8",
    PARAM014: "14.8",
    PARAM015: "14.8",
    PARAM016: "14.8",
    PARAM017: "14.8",
    PARAM018: "14.8",
    CADMIO: "421",
    TOTAL: "2145",
  },
  {
    CALIDAD: "CALIDAD-05",
    P: "69.1",
    PARAM02: "398",
    PARAM03: "15.8",
    PARAM04: "456",
    PARAM05: "14.8",
    PARAM06: "456",
    PARAM07: "14.8",
    PARAM08: "456",
    PARAM09: "14.8",
    PARAM010: "14.8",
    PARAM011: "14.8",
    PARAM012: "14.8",
    PARAM013: "14.8",
    PARAM014: "14.8",
    PARAM015: "14.8",
    PARAM016: "14.8",
    PARAM017: "14.8",
    PARAM018: "14.8",
    CADMIO: "892",
    TOTAL: "4567",
  },
];

class TextUtilityService {
  static shouldTruncateBasedOnSpace(
    text: string,
    availableColumns: number
  ): boolean {
    if (availableColumns <= 3) return text.length > 12;
    if (availableColumns <= 6) return text.length > 8;
    return text.length > PARAM_MAX_LENGTH;
  }

  static getTruncatedText(text: string, availableColumns: number): string {
    if (!this.shouldTruncateBasedOnSpace(text, availableColumns)) return text;

    let maxLength = PARAM_MAX_LENGTH;
    if (availableColumns <= 3) maxLength = 12;
    else if (availableColumns <= 6) maxLength = 8;

    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  }

  static truncateCalidad(text: string): string {
    return text.length > CALIDAD_MAX_LENGTH
      ? `${text.substring(0, CALIDAD_MAX_LENGTH)}...`
      : text;
  }

  static shouldShowTooltipCalidad(text: string): boolean {
    return text.length > CALIDAD_MAX_LENGTH;
  }

  static shouldShowTooltip(
    text: string,
    maxLength: number = PARAM_MAX_LENGTH
  ): boolean {
    return text.length > maxLength;
  }
}

class ColumnConfigurationService {
  static buildConfiguration(filas: FilaDato[]): ColumnConfig {
    const keys = Object.keys(filas[0]);
    const keyCalidad = keys[0];
    const columnas = keys.slice(1);
    const columnasFijas = ["CADMIO", "TOTAL"];
    const columnasParams = columnas.filter(
      (col) => !columnasFijas.includes(col)
    );
    const paramsGridColumns = `repeat(${columnasParams.length}, 1fr)`;

    return {
      keys,
      keyCalidad,
      columnas,
      columnasFijas,
      columnasParams,
      paramsGridColumns,
    };
  }
}

class ValidationService {
  static isValidPositiveDecimal(value: string): boolean {
    return DECIMAL_REGEX.test(value) || value === "";
  }

  static isValidSignedDecimal(value: string): boolean {
    return SIGNED_DECIMAL_REGEX.test(value) || value === "" || value === "-";
  }

  static parseNumberSafely(value: string, fallback: number = 0): number {
    const parsed = Number.parseFloat(value);
    return isNaN(parsed) ? fallback : parsed;
  }

  static clampNumber(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }
}

class DataTransformationService {
  static deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  static updateCellValue(
    filas: FilaDato[],
    filaIndex: number,
    columna: string,
    value: string
  ): FilaDato[] {
    if (!ValidationService.isValidPositiveDecimal(value)) return filas;

    const nuevasFilas = [...filas];
    nuevasFilas[filaIndex][columna] = value;
    return nuevasFilas;
  }

  static applyAdjustmentToColumn(
    filas: FilaDato[],
    columnasParams: string[],
    adjustmentIndex: number,
    adjustmentValue: number
  ): FilaDato[] {
    return filas.map((fila) => {
      const nuevaFila = { ...fila };
      const key = columnasParams[adjustmentIndex];
      const currentValue = ValidationService.parseNumberSafely(nuevaFila[key]);
      const result = currentValue + adjustmentValue;

      nuevaFila[key] = result < 0 ? "0" : result.toFixed(2);
      return nuevaFila;
    });
  }

  static detectChanges(
    currentData: FilaDato[],
    originalData: FilaDato[]
  ): boolean {
    return currentData.some((fila, index) =>
      Object.keys(fila).some((key) => fila[key] !== originalData[index][key])
    );
  }
}

class ScrollSynchronizationService {
  static createSyncHandler(
    elements: HTMLElement[],
    isScrollingRef: React.MutableRefObject<boolean>
  ) {
    return (sourceElement: HTMLElement) => (event: Event) => {
      if (isScrollingRef.current) return;

      isScrollingRef.current = true;
      const scrollLeft = sourceElement.scrollLeft;

      elements.forEach((element) => {
        if (element !== sourceElement) {
          element.scrollLeft = scrollLeft;
        }
      });

      requestAnimationFrame(() => {
        isScrollingRef.current = false;
      });
    };
  }

  static attachScrollListeners(
    elements: HTMLElement[],
    handlers: ((event: Event) => void)[]
  ): () => void {
    elements.forEach((element, index) => {
      element.addEventListener("scroll", handlers[index], { passive: true });
    });

    return () => {
      elements.forEach((element, index) => {
        element.removeEventListener("scroll", handlers[index]);
      });
    };
  }
}

const useQualityDataManagement = (initialData: FilaDato[]) => {
  const [filas, setFilas] = useState<FilaDato[]>(initialData);
  const [filasOriginales] = useState<FilaDato[]>(
    DataTransformationService.deepClone(initialData)
  );

  const [hasChanges, setHasChanges] = useState(false);

  const detectChanges = () => {
    const changesDetected = DataTransformationService.detectChanges(
      filas,
      filasOriginales
    );
    setHasChanges(changesDetected);
  };

  const updateCell = (filaIndex: number, columna: string, value: string) => {
    const updatedFilas = DataTransformationService.updateCellValue(
      filas,
      filaIndex,
      columna,
      value
    );
    if (updatedFilas !== filas) {
      setFilas(updatedFilas);
    }
  };

  const resetToOriginal = () => {
    setFilas(DataTransformationService.deepClone(filasOriginales));
    setHasChanges(false);
  };

  return {
    filas,
    filasOriginales,
    hasChanges,
    detectChanges,
    updateCell,
    resetToOriginal,
  };
};

const useAdjustmentManagement = (columnasParams: string[]) => {
  const [encabezadoSuperior, setEncabezadoSuperior] = useState<string[]>(
    columnasParams.map(() => "0")
  );

  const updateAdjustment = (index: number, value: string) => {
    if (!ValidationService.isValidSignedDecimal(value)) return;

    const nuevos = [...encabezadoSuperior];
    nuevos[index] = value;
    setEncabezadoSuperior(nuevos);
  };

  const applyAdjustment = (
    index: number,
    filas: FilaDato[],
    onFilasUpdate: (newFilas: FilaDato[]) => void
  ) => {
    const adjustmentValue = ValidationService.parseNumberSafely(
      encabezadoSuperior[index]
    );
    if (adjustmentValue === 0) return;

    const updatedFilas = DataTransformationService.applyAdjustmentToColumn(
      filas,
      columnasParams,
      index,
      adjustmentValue
    );

    onFilasUpdate(updatedFilas);

    const resetAdjustments = [...encabezadoSuperior];
    resetAdjustments[index] = "0";
    setEncabezadoSuperior(resetAdjustments);
  };

  const resetAllAdjustments = () => {
    setEncabezadoSuperior(columnasParams.map(() => "0"));
  };

  return {
    encabezadoSuperior,
    updateAdjustment,
    applyAdjustment,
    resetAllAdjustments,
  };
};

const useProcessConfiguration = () => {
  const [numeroRumas, setNumeroRumas] = useState<number>(MIN_RUMAS);
  const [divisionRumas, setDivisionRumas] = useState<number>(MAX_DIVISION);

  const incrementRumas = () => setNumeroRumas((prev) => prev + 1);
  const decrementRumas = () =>
    setNumeroRumas((prev) => Math.max(MIN_RUMAS, prev - 1));
  const incrementDivision = () =>
    setDivisionRumas((prev) => Math.min(MAX_DIVISION, prev + 1));
  const decrementDivision = () =>
    setDivisionRumas((prev) => Math.max(MIN_DIVISION, prev - 1));

  const updateRumasFromInput = (value: string) => {
    const numValue = Number.parseInt(value) || MIN_RUMAS;
    if (numValue >= MIN_RUMAS) setNumeroRumas(numValue);
  };

  const updateDivisionFromInput = (value: string) => {
    const numValue = Number.parseInt(value) || MIN_DIVISION;
    const clampedValue = ValidationService.clampNumber(
      numValue,
      MIN_DIVISION,
      MAX_DIVISION
    );
    setDivisionRumas(clampedValue);
  };

  return {
    numeroRumas,
    divisionRumas,
    incrementRumas,
    decrementRumas,
    incrementDivision,
    decrementDivision,
    updateRumasFromInput,
    updateDivisionFromInput,
  };
};

const useScrollSynchronization = () => {
  const scrollAdjustmentRef = useRef<HTMLDivElement>(null);
  const scrollHeaderRef = useRef<HTMLDivElement>(null);
  const scrollDataRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  useEffect(() => {
    const elements = [
      scrollAdjustmentRef.current,
      scrollHeaderRef.current,
      scrollDataRef.current,
    ].filter(Boolean) as HTMLElement[];

    if (elements.length !== 3) return;

    const syncHandler = ScrollSynchronizationService.createSyncHandler(
      elements,
      isScrollingRef
    );
    const handlers = elements.map(syncHandler);

    return ScrollSynchronizationService.attachScrollListeners(
      elements,
      handlers
    );
  }, []);

  return {
    scrollAdjustmentRef,
    scrollHeaderRef,
    scrollDataRef,
  };
};

export function QualityParametersMatrix() {
  const styles = useQualityParametersStyles();

  const dispatch = useAppDispatch();
  const dataManagement = useQualityDataManagement(filasIniciales);
  const scrollSync = useScrollSynchronization();
  const processConfig = useProcessConfiguration();

  const columnConfig = ColumnConfigurationService.buildConfiguration(
    dataManagement.filas
  );
  const adjustmentManagement = useAdjustmentManagement(
    columnConfig.columnasParams
  );

  const [hoveredCell, setHoveredCell] = useState<HoveredCell | null>(null);

  useEffect(() => {
    dataManagement.detectChanges();
  }, [dataManagement.filas]);

  const handleCellUpdate = (
    filaIndex: number,
    columna: string,
    value: string
  ) => {
    dataManagement.updateCell(filaIndex, columna, value);
  };

  const handleAdjustmentUpdate = (index: number, value: string) => {
    adjustmentManagement.updateAdjustment(index, value);
  };

  const handleAdjustmentApply = (index: number) => {
    adjustmentManagement.applyAdjustment(
      index,
      dataManagement.filas,
      (newFilas) => {
        dataManagement.filas.splice(
          0,
          dataManagement.filas.length,
          ...newFilas
        );
      }
    );
  };

  const handleReset = () => {
    dataManagement.resetToOriginal();
    adjustmentManagement.resetAllAdjustments();
  };

  const handleStartProcess = () => {
    dispatch(nextStep());
    return;
    const processData: ProcessConfig = {
      numeroRumas: processConfig.numeroRumas,
      divisionRumas: processConfig.divisionRumas,
      parametros: dataManagement.filas,
      totalParametros: columnConfig.columnasParams.length,
    };
    console.log("Iniciando proceso con:", processData);
  };

  const renderAdjustmentInputs = () => (
    <div
      className={styles.adjustmentInputsGrid}
      style={{ gridTemplateColumns: columnConfig.paramsGridColumns }}
    >
      {columnConfig.columnasParams.map((col, idx) => (
        <div
          key={`adjustment-container-${idx}`}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "0 2px",
            width: "100%",
            minWidth: "60px",
          }}
        >
          <Input
            value={
              adjustmentManagement.encabezadoSuperior[idx]?.toString() ?? ""
            }
            onKeyDown={(e) => e.key === "Enter" && handleAdjustmentApply(idx)}
            onChange={(e, data) => handleAdjustmentUpdate(idx, data.value)}
            className={styles.adjustmentInput}
            placeholder="0"
          />
        </div>
      ))}
    </div>
  );

  const renderParameterHeaders = () => (
    <div
      className={styles.headerParamsGrid}
      style={{ gridTemplateColumns: columnConfig.paramsGridColumns }}
    >
      {columnConfig.columnasParams.map((col, idx) => (
        <div
          key={`header-${idx}`}
          className={styles.headerCell}
          onMouseEnter={() => setHoveredCell({ row: -1, col, type: "header" })}
          onMouseLeave={() => setHoveredCell(null)}
          title={
            TextUtilityService.shouldTruncateBasedOnSpace(
              col,
              columnConfig.columnasParams.length
            )
              ? col
              : undefined
          }
        >
          {TextUtilityService.getTruncatedText(
            col,
            columnConfig.columnasParams.length
          )}
          {hoveredCell?.row === -1 &&
            hoveredCell?.col === col &&
            hoveredCell?.type === "header" &&
            TextUtilityService.shouldTruncateBasedOnSpace(
              col,
              columnConfig.columnasParams.length
            ) && <div className={styles.tooltip}>{col}</div>}
        </div>
      ))}
    </div>
  );

  const renderFixedHeaders = () => (
    <div className={styles.headerRight}>
      {columnConfig.columnasFijas.map((col, idx) => (
        <div
          key={`header-fixed-${idx}`}
          className={styles.headerCellFixed}
          onMouseEnter={() => setHoveredCell({ row: -1, col, type: "header" })}
          onMouseLeave={() => setHoveredCell(null)}
          title={
            TextUtilityService.shouldTruncateBasedOnSpace(
              col,
              columnConfig.columnasFijas.length
            )
              ? col
              : undefined
          }
        >
          {TextUtilityService.getTruncatedText(
            col,
            columnConfig.columnasFijas.length
          )}
          {hoveredCell?.row === -1 &&
            hoveredCell?.col === col &&
            hoveredCell?.type === "header" &&
            TextUtilityService.shouldTruncateBasedOnSpace(
              col,
              columnConfig.columnasFijas.length
            ) && <div className={styles.tooltip}>{col}</div>}
        </div>
      ))}
    </div>
  );

  const renderCalidadColumn = () => (
    <div className={styles.dataLeft}>
      <div className={styles.dataLeftContent}>
        {dataManagement.filas.map((fila, filaIdx) => (
          <div
            key={`calidad-${filaIdx}`}
            className={styles.dataCellLeft}
            onMouseEnter={() =>
              setHoveredCell({
                row: filaIdx,
                col: columnConfig.keyCalidad,
                type: "data",
              })
            }
            onMouseLeave={() => setHoveredCell(null)}
            title={
              TextUtilityService.shouldShowTooltipCalidad(
                fila[columnConfig.keyCalidad]
              )
                ? fila[columnConfig.keyCalidad]
                : undefined
            }
          >
            {TextUtilityService.truncateCalidad(fila[columnConfig.keyCalidad])}
            {hoveredCell?.row === filaIdx &&
              hoveredCell?.col === columnConfig.keyCalidad &&
              hoveredCell?.type === "data" &&
              TextUtilityService.shouldShowTooltipCalidad(
                fila[columnConfig.keyCalidad]
              ) && (
                <div className={styles.tooltip}>
                  {fila[columnConfig.keyCalidad]}
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderParameterData = () => (
    <div className={styles.dataMiddle} ref={scrollSync.scrollDataRef}>
      <div className={styles.dataMiddleContent}>
        {dataManagement.filas.map((fila, filaIdx) => (
          <div
            key={`fila-params-${filaIdx}`}
            className={styles.dataRowGrid}
            style={{ gridTemplateColumns: columnConfig.paramsGridColumns }}
          >
            {columnConfig.columnasParams.map((col, colIdx) => (
              <div
                key={`param-${filaIdx}-${colIdx}`}
                className={styles.dataCell}
              >
                <Input
                  value={fila[col] ?? ""}
                  onChange={(e, data) =>
                    handleCellUpdate(filaIdx, col, data.value)
                  }
                  className={styles.dataInput}
                  type="text"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  const renderFixedData = () => (
    <div className={styles.dataRight}>
      <div className={styles.dataRightContent}>
        {dataManagement.filas.map((fila, filaIdx) => (
          <div
            key={`fila-fixed-${filaIdx}`}
            className={styles.dataRowGridFixed}
          >
            {columnConfig.columnasFijas.map((col, colIdx) => (
              <div
                key={`fixed-${filaIdx}-${colIdx}`}
                className={styles.dataCellFixed}
              >
                <Input
                  value={fila[col] ?? ""}
                  onChange={(e, data) =>
                    handleCellUpdate(filaIdx, col, data.value)
                  }
                  className={styles.dataInput}
                  type="text"
                  readOnly={true}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  const renderProcessControls = () => (
    <div className={styles.controlsContainer}>
      <div className={styles.controlsLeft}>
        <div className={styles.controlGroup}>
          <Label className={styles.controlLabel}>Número de rumas</Label>
          <div className={styles.controlInputContainer}>
            <button
              className={styles.incrementButton}
              onClick={processConfig.decrementRumas}
              disabled={processConfig.numeroRumas <= MIN_RUMAS}
            >
              <Subtract20Regular />
            </button>
            <Input
              value={processConfig.numeroRumas.toString()}
              onChange={(e, data) =>
                processConfig.updateRumasFromInput(data.value)
              }
              className={styles.controlInput}
            />
            <button
              className={styles.incrementButton}
              onClick={processConfig.incrementRumas}
            >
              <Add20Regular />
            </button>
          </div>
        </div>

        <div className={styles.controlGroup}>
          <Label className={styles.controlLabel}>
            División de rumas (toneladas)
          </Label>
          <div className={styles.controlInputContainer}>
            <button
              className={styles.incrementButton}
              onClick={processConfig.decrementDivision}
              disabled={processConfig.divisionRumas <= MIN_DIVISION}
            >
              <Subtract20Regular />
            </button>
            <Input
              value={processConfig.divisionRumas.toString()}
              onChange={(e, data) =>
                processConfig.updateDivisionFromInput(data.value)
              }
              className={styles.controlInput}
            />
            <button
              className={styles.incrementButton}
              onClick={processConfig.incrementDivision}
              disabled={processConfig.divisionRumas >= MAX_DIVISION}
            >
              <Add20Regular />
            </button>
          </div>
        </div>
      </div>

      <div className={styles.buttonsContainer}>
        <Button
          onClick={handleReset}
          disabled={!dataManagement.hasChanges}
          className={styles.outlineButton}
        >
          Restablecer parámetros
        </Button>

        <div style={{ height: "8px" }} />

        <Button onClick={handleStartProcess} className={styles.primaryButton}>
          Iniciar proceso
        </Button>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Parámetros de Calidad</h2>

      <div className={styles.gridContainer}>
        <div className={styles.gridWrapper}>
          <div className={styles.adjustmentRow}>
            <div className={styles.adjustmentLeft}>Ajustes</div>
            <div
              className={styles.adjustmentMiddle}
              ref={scrollSync.scrollAdjustmentRef}
            >
              {renderAdjustmentInputs()}
            </div>
            <div className={styles.adjustmentRight}></div>
          </div>

          <div className={styles.headerRow}>
            <div
              className={styles.headerLeft}
              onMouseEnter={() =>
                setHoveredCell({
                  row: -1,
                  col: columnConfig.keyCalidad,
                  type: "header",
                })
              }
              onMouseLeave={() => setHoveredCell(null)}
              title={
                TextUtilityService.shouldShowTooltipCalidad(
                  columnConfig.keyCalidad
                )
                  ? columnConfig.keyCalidad
                  : undefined
              }
            >
              {TextUtilityService.truncateCalidad(columnConfig.keyCalidad)}
              {hoveredCell?.row === -1 &&
                hoveredCell?.col === columnConfig.keyCalidad &&
                hoveredCell?.type === "header" &&
                TextUtilityService.shouldShowTooltipCalidad(
                  columnConfig.keyCalidad
                ) && (
                  <div className={styles.tooltip}>
                    {columnConfig.keyCalidad}
                  </div>
                )}
            </div>

            <div
              className={styles.headerMiddle}
              ref={scrollSync.scrollHeaderRef}
            >
              {renderParameterHeaders()}
            </div>

            {renderFixedHeaders()}
          </div>

          <div className={styles.dataRow}>
            {renderCalidadColumn()}
            {renderParameterData()}
            {renderFixedData()}
          </div>
        </div>
      </div>

      {renderProcessControls()}
    </div>
  );
}
