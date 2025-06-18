"use client"

import { useEffect, useRef, useState } from "react"
import { Input, Button, Label, Checkbox } from "@fluentui/react-components"
import { Add20Regular, Subtract20Regular } from "@fluentui/react-icons"
import { useCustomProductStyles } from "@/styles/custom-product.styles"

interface FilaDato {
  [key: string]: string
}

interface HoveredCell {
  row: number
  col: string
  type?: "header" | "data"
}

interface ColumnConfig {
  keys: string[]
  keyCalidad: string
  columnas: string[]
  columnasFijas: string[]
  columnasParams: string[]
  paramsGridColumns: string
}

const MIN_RUMAS = 2
const MAX_DIVISION = 50
const MIN_DIVISION = 1
const CALIDAD_MAX_LENGTH = 8
const DECIMAL_REGEX = /^\d*\.?\d$/
const SIGNED_DECIMAL_REGEX = /^-?\d*\.?\d$/

const filasIniciales: FilaDato[] = [
  {
    CALIDAD: "CALIDAD-01",
    P: "67.9",
    PARAM02: "480",
    PARAM03: "480",
    PARAM04: "480",
    PARAM05: "480",
    PARAM06: "480",
    CADMIO: "678",
    TOTAL: "3335",
  },
  {
    CALIDAD: "CALIDAD-02",
    P: "67",
    PARAM02: "456",
    PARAM03: "480",
    PARAM04: "480",
    PARAM05: "480",
    PARAM06: "480",
    CADMIO: "12",
    TOTAL: "1000",
  },
  {
    CALIDAD: "CALIDAD-SUPER-LARGA-NOMBRE-EXTENSO-03",
    P: "66.9",
    PARAM02: "234",
    PARAM03: "480",
    PARAM04: "480",
    PARAM05: "480",
    PARAM06: "480",
    CADMIO: "763",
    TOTAL: "8618",
  },
]

class TextUtilities {
  static shouldTruncateBasedOnSpace(text: string, availableColumns: number): boolean {
    if (availableColumns <= 3) return text.length > 12
    if (availableColumns <= 6) return text.length > 8
    return text.length > 6
  }

  static getTruncatedText(text: string, availableColumns: number): string {
    if (!this.shouldTruncateBasedOnSpace(text, availableColumns)) return text

    let maxLength = 6
    if (availableColumns <= 3) maxLength = 12
    else if (availableColumns <= 6) maxLength = 8

    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  }

  static truncateCalidad(text: string): string {
    return text.length > CALIDAD_MAX_LENGTH 
      ? `${text.substring(0, CALIDAD_MAX_LENGTH)}...` 
      : text
  }

  static shouldShowTooltipCalidad(text: string): boolean {
    return text.length > CALIDAD_MAX_LENGTH
  }
}

class ColumnConfigBuilder {
  static buildConfig(filas: FilaDato[]): ColumnConfig {
    const keys = Object.keys(filas[0])
    const keyCalidad = keys[0]
    const columnas = keys.slice(1)
    const columnasFijas = ["CADMIO", "TOTAL"]
    const columnasParams = columnas.filter((col) => !columnasFijas.includes(col))
    const paramsGridColumns = `repeat(${columnasParams.length}, 1fr)`

    return {
      keys,
      keyCalidad,
      columnas,
      columnasFijas,
      columnasParams,
      paramsGridColumns,
    }
  }
}

class ValidationService {
  static isValidPositiveDecimal(value: string): boolean {
    return DECIMAL_REGEX.test(value) || value === ""
  }

  static isValidSignedDecimal(value: string): boolean {
    return SIGNED_DECIMAL_REGEX.test(value) || value === "" || value === "-"
  }

  static parseNumberSafely(value: string, fallback: number = 0): number {
    const parsed = Number.parseFloat(value)
    return isNaN(parsed) ? fallback : parsed
  }
}

class DataTransformationService {
  static deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj))
  }

  static updateCellValue(
    filas: FilaDato[],
    filaIndex: number,
    columna: string,
    value: string
  ): FilaDato[] {
    if (!ValidationService.isValidPositiveDecimal(value)) return filas

    const nuevasFilas = [...filas]
    nuevasFilas[filaIndex][columna] = value
    return nuevasFilas
  }

  static applyAdjustment(
    filas: FilaDato[],
    columnasParams: string[],
    adjustmentIndex: number,
    adjustmentValue: number
  ): FilaDato[] {
    return filas.map((fila) => {
      const nuevaFila = { ...fila }
      const key = columnasParams[adjustmentIndex]
      const currentValue = ValidationService.parseNumberSafely(nuevaFila[key])
      const result = currentValue + adjustmentValue

      nuevaFila[key] = result < 0 ? "0" : result.toFixed(2)
      return nuevaFila
    })
  }

  static detectChanges(currentData: FilaDato[], originalData: FilaDato[]): boolean {
    return currentData.some((fila, index) =>
      Object.keys(fila).some((key) => fila[key] !== originalData[index][key])
    )
  }
}

class ScrollSyncService {
  static createSyncHandler(
    elements: HTMLElement[],
    isScrollingRef: React.MutableRefObject<boolean>
  ) {
    return (sourceElement: HTMLElement) => (event: Event) => {
      if (isScrollingRef.current) return

      isScrollingRef.current = true
      const scrollLeft = sourceElement.scrollLeft

      elements.forEach((element) => {
        if (element !== sourceElement) {
          element.scrollLeft = scrollLeft
        }
      })

      requestAnimationFrame(() => {
        isScrollingRef.current = false
      })
    }
  }

  static attachListeners(
    elements: HTMLElement[],
    handlers: ((event: Event) => void)[]
  ): () => void {
    elements.forEach((element, index) => {
      element.addEventListener("scroll", handlers[index], { passive: true })
    })

    return () => {
      elements.forEach((element, index) => {
        element.removeEventListener("scroll", handlers[index])
      })
    }
  }
}

const useDataManagement = (initialData: FilaDato[]) => {
  const [filas, setFilas] = useState<FilaDato[]>(initialData)
  const [filasOriginales] = useState<FilaDato[]>(
    DataTransformationService.deepClone(initialData)
  )
  const [hasChanges, setHasChanges] = useState(false)

  const detectChanges = (currentFilas: FilaDato[], selectedRow: number | null) => {
    const hasDataChanges = DataTransformationService.detectChanges(currentFilas, filasOriginales)
    setHasChanges(hasDataChanges || selectedRow !== null)
  }

  const updateCell = (filaIndex: number, columna: string, value: string) => {
    const updatedFilas = DataTransformationService.updateCellValue(
      filas,
      filaIndex,
      columna,
      value
    )
    if (updatedFilas !== filas) {
      setFilas(updatedFilas)
    }
  }

  const resetData = () => {
    setFilas(DataTransformationService.deepClone(filasOriginales))
    setHasChanges(false)
  }

  return {
    filas,
    filasOriginales,
    hasChanges,
    detectChanges,
    updateCell,
    resetData,
  }
}

const useAdjustments = (columnasParams: string[]) => {
  const [encabezadoSuperior, setEncabezadoSuperior] = useState<string[]>(
    columnasParams.map(() => "0")
  )

  const updateAdjustment = (index: number, value: string) => {
    if (!ValidationService.isValidSignedDecimal(value)) return

    const nuevos = [...encabezadoSuperior]
    nuevos[index] = value
    setEncabezadoSuperior(nuevos)
  }

  const applyAdjustment = (
    index: number,
    filas: FilaDato[],
    onFilasUpdate: (newFilas: FilaDato[]) => void
  ) => {
    const adjustmentValue = ValidationService.parseNumberSafely(
      encabezadoSuperior[index]
    )

    if (adjustmentValue === 0) return

    const updatedFilas = DataTransformationService.applyAdjustment(
      filas,
      columnasParams,
      index,
      adjustmentValue
    )

    onFilasUpdate(updatedFilas)

    const resetAdjustments = [...encabezadoSuperior]
    resetAdjustments[index] = "0"
    setEncabezadoSuperior(resetAdjustments)
  }

  const resetAdjustments = () => {
    setEncabezadoSuperior(columnasParams.map(() => "0"))
  }

  return {
    encabezadoSuperior,
    updateAdjustment,
    applyAdjustment,
    resetAdjustments,
  }
}

const useScrollSync = () => {
  const scrollAdjustmentRef = useRef<HTMLDivElement>(null)
  const scrollHeaderRef = useRef<HTMLDivElement>(null)
  const scrollDataRef = useRef<HTMLDivElement>(null)
  const isScrollingRef = useRef(false)

  useEffect(() => {
    const elements = [
      scrollAdjustmentRef.current,
      scrollHeaderRef.current,
      scrollDataRef.current,
    ].filter(Boolean) as HTMLElement[]

    if (elements.length !== 3) return

    const syncHandler = ScrollSyncService.createSyncHandler(elements, isScrollingRef)
    const handlers = elements.map(syncHandler)

    return ScrollSyncService.attachListeners(elements, handlers)
  }, [])

  return {
    scrollAdjustmentRef,
    scrollHeaderRef,
    scrollDataRef,
  }
}

export function CustomProductLayout() {
  const styles = useCustomProductStyles()

  const dataManagement = useDataManagement(filasIniciales)
  const scrollSync = useScrollSync()

  const columnConfig = ColumnConfigBuilder.buildConfig(dataManagement.filas)
  const adjustments = useAdjustments(columnConfig.columnasParams)

  const [numeroRumas, setNumeroRumas] = useState<number>(MIN_RUMAS)
  const [divisionRumas, setDivisionRumas] = useState<number>(MAX_DIVISION)
  const [hoveredCell, setHoveredCell] = useState<HoveredCell | null>(null)
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null)

  useEffect(() => {
    dataManagement.detectChanges(dataManagement.filas, selectedRowIndex)
  }, [dataManagement.filas, selectedRowIndex])

  const handleCheckboxChange = (rowIndex: number, checked: boolean) => {
    setSelectedRowIndex(checked ? rowIndex : null)
  }

  const handleCellUpdate = (filaIndex: number, columna: string, value: string) => {
    dataManagement.updateCell(filaIndex, columna, value)
  }

  const handleAdjustmentUpdate = (index: number, value: string) => {
    adjustments.updateAdjustment(index, value)
  }

  const handleAdjustmentApply = (index: number) => {
    adjustments.applyAdjustment(index, dataManagement.filas, (newFilas) => {
      dataManagement.filas.splice(0, dataManagement.filas.length, ...newFilas)
    })
  }

  const handleRumasIncrement = () => setNumeroRumas((prev) => prev + 1)
  const handleRumasDecrement = () => setNumeroRumas((prev) => Math.max(MIN_RUMAS, prev - 1))
  const handleDivisionIncrement = () => setDivisionRumas((prev) => Math.min(MAX_DIVISION, prev + 1))
  const handleDivisionDecrement = () => setDivisionRumas((prev) => Math.max(MIN_DIVISION, prev - 1))

  const handleRumasInputChange = (value: string) => {
    const numValue = Number.parseInt(value) || MIN_RUMAS
    if (numValue >= MIN_RUMAS) setNumeroRumas(numValue)
  }

  const handleDivisionInputChange = (value: string) => {
    const numValue = Number.parseInt(value) || MIN_DIVISION
    if (numValue >= MIN_DIVISION && numValue <= MAX_DIVISION) {
      setDivisionRumas(numValue)
    }
  }

  const handleReset = () => {
    dataManagement.resetData()
    adjustments.resetAdjustments()
    setSelectedRowIndex(null)
  }

  const handleStartProcess = () => {
    const processData = {
      numeroRumas,
      divisionRumas,
      parametros: dataManagement.filas,
      filaSeleccionada: selectedRowIndex !== null ? dataManagement.filas[selectedRowIndex] : null,
      totalParametros: columnConfig.columnasParams.length,
    }
    
    console.log("Iniciando proceso de producto a medida:", processData)
  }

  const renderAdjustmentInputs = () => (
    <div className={styles.adjustmentInputsGrid} style={{ gridTemplateColumns: columnConfig.paramsGridColumns }}>
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
            value={adjustments.encabezadoSuperior[idx] ?? ""}
            onKeyDown={(e) => e.key === "Enter" && handleAdjustmentApply(idx)}
            onChange={(e, data) => handleAdjustmentUpdate(idx, data.value)}
            className={styles.adjustmentInput}
            placeholder="0"
          />
        </div>
      ))}
    </div>
  )

  const renderParameterHeaders = () => (
    <div className={styles.headerParamsGrid} style={{ gridTemplateColumns: columnConfig.paramsGridColumns }}>
      {columnConfig.columnasParams.map((col, idx) => (
        <div
          key={`header-${idx}`}
          className={styles.headerCell}
          onMouseEnter={() => setHoveredCell({ row: -1, col, type: "header" })}
          onMouseLeave={() => setHoveredCell(null)}
          title={TextUtilities.shouldTruncateBasedOnSpace(col, columnConfig.columnasParams.length) ? col : undefined}
        >
          {TextUtilities.getTruncatedText(col, columnConfig.columnasParams.length)}
          {hoveredCell?.row === -1 &&
            hoveredCell?.col === col &&
            hoveredCell?.type === "header" &&
            TextUtilities.shouldTruncateBasedOnSpace(col, columnConfig.columnasParams.length) && (
              <div className={styles.tooltip}>{col}</div>
            )}
        </div>
      ))}
    </div>
  )

  const renderFixedHeaders = () => (
    <div className={styles.headerRight}>
      {columnConfig.columnasFijas.map((col, idx) => (
        <div 
          key={`header-fixed-${idx}`} 
          className={styles.headerCellFixed} 
          title={TextUtilities.shouldTruncateBasedOnSpace(col, columnConfig.columnasFijas.length) ? col : undefined}
        >
          {TextUtilities.getTruncatedText(col, columnConfig.columnasFijas.length)}
        </div>
      ))}
    </div>
  )

  const renderCheckboxColumn = () => (
    <div className={styles.dataCheckbox}>
      <div className={styles.dataCheckboxContent}>
        {dataManagement.filas.map((_, filaIdx) => (
          <div key={`checkbox-${filaIdx}`} className={styles.checkboxCell}>
            <Checkbox
              checked={selectedRowIndex === filaIdx}
              onChange={(e, data) => handleCheckboxChange(filaIdx, data.checked === true)}
              size="medium"
            />
          </div>
        ))}
      </div>
    </div>
  )

  const renderCalidadColumn = () => (
    <div className={styles.dataLeft}>
      <div className={styles.dataLeftContent}>
        {dataManagement.filas.map((fila, filaIdx) => (
          <div 
            key={`calidad-${filaIdx}`} 
            className={styles.dataCellLeft} 
            title={TextUtilities.shouldShowTooltipCalidad(fila[columnConfig.keyCalidad]) ? fila[columnConfig.keyCalidad] : undefined}
          >
            {TextUtilities.truncateCalidad(fila[columnConfig.keyCalidad])}
          </div>
        ))}
      </div>
    </div>
  )

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
              <div key={`param-${filaIdx}-${colIdx}`} className={styles.dataCell}>
                <Input 
                  value={fila[col] ?? ""} 
                  onChange={(e, data) => handleCellUpdate(filaIdx, col, data.value)} 
                  className={styles.dataInput} 
                  type="text" 
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )

  const renderFixedData = () => (
    <div className={styles.dataRight}>
      <div className={styles.dataRightContent}>
        {dataManagement.filas.map((fila, filaIdx) => (
          <div key={`fila-fixed-${filaIdx}`} className={styles.dataRowGridFixed}>
            {columnConfig.columnasFijas.map((col, colIdx) => (
              <div key={`fixed-${filaIdx}-${colIdx}`} className={styles.dataCellFixed}>
                <Input 
                  value={fila[col] ?? ""} 
                  onChange={(e, data) => handleCellUpdate(filaIdx, col, data.value)} 
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
  )

  const renderControls = () => (
    <div className={styles.controlsContainer}>
      <div className={styles.controlsLeft}>
        <div className={styles.controlGroup}>
          <Label className={styles.controlLabel}>Número de rumas</Label>
          <div className={styles.controlInputContainer}>
            <button 
              className={styles.incrementButton} 
              onClick={handleRumasDecrement} 
              disabled={numeroRumas <= MIN_RUMAS}
            >
              <Subtract20Regular />
            </button>
            <Input
              value={numeroRumas.toString()}
              onChange={(e, data) => handleRumasInputChange(data.value)}
              className={styles.controlInput}
            />
            <button className={styles.incrementButton} onClick={handleRumasIncrement}>
              <Add20Regular />
            </button>
          </div>
        </div>

        <div className={styles.controlGroup}>
          <Label className={styles.controlLabel}>División de rumas (toneladas)</Label>
          <div className={styles.controlInputContainer}>
            <button 
              className={styles.incrementButton} 
              onClick={handleDivisionDecrement} 
              disabled={divisionRumas <= MIN_DIVISION}
            >
              <Subtract20Regular />
            </button>
            <Input
              value={divisionRumas.toString()}
              onChange={(e, data) => handleDivisionInputChange(data.value)}
              className={styles.controlInput}
            />
            <button 
              className={styles.incrementButton} 
              onClick={handleDivisionIncrement} 
              disabled={divisionRumas >= MAX_DIVISION}
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

        <Button 
          onClick={handleStartProcess} 
          className={styles.primaryButton} 
          disabled={selectedRowIndex === null}
        >
          Iniciar proceso
        </Button>
      </div>
    </div>
  )

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Producto a Medida</h2>

      <div className={styles.gridContainer}>
        <div className={styles.gridWrapper}>
          <div className={styles.adjustmentRow}>
            <div className={styles.adjustmentLeft}>Ajustes</div>
            <div className={styles.adjustmentMiddle} ref={scrollSync.scrollAdjustmentRef}>
              {renderAdjustmentInputs()}
            </div>
            <div className={styles.adjustmentRight}></div>
          </div>

          <div className={styles.headerRow}>
            <div className={styles.headerCheckbox}></div>
            <div className={styles.headerLeft}>
              {TextUtilities.truncateCalidad(columnConfig.keyCalidad)}
            </div>
            <div className={styles.headerMiddle} ref={scrollSync.scrollHeaderRef}>
              {renderParameterHeaders()}
            </div>
            {renderFixedHeaders()}
          </div>

          <div className={styles.dataRow}>
            {renderCheckboxColumn()}
            {renderCalidadColumn()}
            {renderParameterData()}
            {renderFixedData()}
          </div>
        </div>
      </div>

      {renderControls()}
    </div>
  )
}
