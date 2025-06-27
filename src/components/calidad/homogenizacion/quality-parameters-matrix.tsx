"use client"
import { useState } from "react"
import { useEffect, useMemo, useCallback, memo } from "react"
import { Checkbox } from "@fluentui/react-components"
import { useAppDispatch } from "@/lib/store/hooks"
import { nextStep } from "@/lib/store/slices/stepSlice"
import type { ProcessConfig, QualityParametersMatrixProps } from "@/interface/quality/quality-matrix.interfaces"
import { INITIAL_DATA, STYLES } from "@/lib/constants/quality-matrix.constants"
import { TextUtils } from "@/utils/text-utils"
import { ColumnConfigurationUtils } from "@/utils/column-configuration.utils"
import { ProcessControls } from "./process-controls"
import { useQualityDataManagement } from "@/hooks/use-quality-data-management"
import { useAdjustmentManagement } from "@/hooks/use-adjustment-management"
import { useProcessConfiguration } from "@/hooks/use-process-configuration"
import { useMouseHandlers } from "@/hooks/use-mouse-handlers"
import { AdjustmentInput } from "./matrix-components/adjustment-input"
import { TooltipCell } from "./matrix-components/tooltip-cell"
import { ParameterRow } from "./matrix-components/parameter-row"
import { FixedColumnsRow } from "./matrix-components/fixed-columns-row"

export function QualityParametersMatrix({
  showCheckboxes = false,
  selectedType = "Homogenizado",
  allowMultipleSelection = false,
}: QualityParametersMatrixProps) {
  const dispatch = useAppDispatch()

  const dataManagement = useQualityDataManagement(INITIAL_DATA)
  const processConfig = useProcessConfiguration()
  const [hoveredCell, mouseHandlers] = useMouseHandlers()

  //configuración de columnas solo cuando cambien las filas
  const columnConfig = useMemo(
    () => ColumnConfigurationUtils.buildConfiguration(dataManagement.filas),
    [dataManagement.filas],
  )

  const adjustmentManagement = useAdjustmentManagement(columnConfig.columnasParams)

  // Estado para selección única o múltiple
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null)
  const [selectedRowIndexes, setSelectedRowIndexes] = useState<number[]>([])

  useEffect(() => {
    if (!showCheckboxes) {
      setSelectedRowIndex(null)
      setSelectedRowIndexes([])
    }
  }, [showCheckboxes])

  const handleCellUpdate = useCallback(
    (filaIndex: number, columna: string, value: string) => {
      dataManagement.updateCell(filaIndex, columna, value)
    },
    [dataManagement],
  )

  const handleAdjustmentUpdate = useCallback(
    (index: number, value: string) => {
      adjustmentManagement.updateAdjustment(index, value)
    },
    [adjustmentManagement],
  )

  const handleAdjustmentApply = useCallback(
    (index: number) => {
      adjustmentManagement.applyAdjustment(index, dataManagement.filas, (newFilas) => {
        dataManagement.updateFilas([...newFilas])
      })
    },
    [adjustmentManagement, dataManagement],
  )

  const handleCheckboxChange = useCallback((rowIndex: number, checked: boolean) => {
    if (allowMultipleSelection) {
      setSelectedRowIndexes(prev => 
        checked 
          ? [...prev, rowIndex]
          : prev.filter(index => index !== rowIndex)
      )
    } else {
      setSelectedRowIndex(checked ? rowIndex : null)
    }
  }, [allowMultipleSelection])

  const handleReset = useCallback(() => {
    dataManagement.resetToOriginal()
    adjustmentManagement.resetAllAdjustments()
    setSelectedRowIndex(null)
    setSelectedRowIndexes([])
  }, [dataManagement, adjustmentManagement])

  const handleStartProcess = useCallback(() => {
    const processData: ProcessConfig = {
      numeroRumas: processConfig.numeroRumas,
      divisionRumas: processConfig.divisionRumas,
      parametros: dataManagement.filas,
      totalParametros: columnConfig.columnasParams.length,
    }

    if (showCheckboxes && selectedRowIndex !== null) {
      console.log("Iniciando proceso de producto a medida:", {
        ...processData,
        filaSeleccionada: dataManagement.filas[selectedRowIndex],
        indiceSeleccionado: selectedRowIndex,
      })
    } else {
      console.log(`Iniciando proceso de ${selectedType}:`, processData)
    }

    dispatch(nextStep())
  }, [
    processConfig.numeroRumas,
    processConfig.divisionRumas,
    dataManagement.filas,
    columnConfig.columnasParams.length,
    showCheckboxes,
    selectedRowIndex,
    selectedType,
    dispatch,
  ])

  //Solo se recalculan cuando cambian las dependencias
  const shouldEnableReset = useMemo(
    () =>
      dataManagement.hasChanges ||
      adjustmentManagement.hasAdjustments ||
      (showCheckboxes && selectedRowIndex !== null),
    [dataManagement.hasChanges, adjustmentManagement.hasAdjustments, showCheckboxes, selectedRowIndex],
  )

  const shouldDisableStartButton = useMemo(() => {
    if (!showCheckboxes) return false
    
    if (allowMultipleSelection) {
      return selectedRowIndexes.length === 0
    } else {
      return selectedRowIndex === null
    }
  }, [showCheckboxes, allowMultipleSelection, selectedRowIndex, selectedRowIndexes])

  const gridTemplateColumns = useMemo(
    () => (showCheckboxes ? "40px minmax(70px,8%) 1fr" : "minmax(70px,8%) 1fr"),
    [showCheckboxes],
  )

  const tooltipUtils = useMemo(
    () => ({
      shouldShowCalidadTooltip: (filaIdx: number) =>
        hoveredCell?.row === filaIdx &&
        hoveredCell?.col === columnConfig.keyCalidad &&
        hoveredCell?.type === "data" &&
        TextUtils.shouldShowTooltipCalidad(dataManagement.filas[filaIdx]?.[columnConfig.keyCalidad] ?? ""),

      shouldShowHeaderTooltip: (col: string) =>
        hoveredCell?.row === -1 &&
        hoveredCell?.col === col &&
        hoveredCell?.type === "header" &&
        TextUtils.shouldTruncateBasedOnSpace(col, columnConfig.columnasParams.length),
    }),
    [hoveredCell, columnConfig, dataManagement.filas],
  )

  return (
      <div className="w-full flex flex-col gap-4 pt-5 pb-5 pl-10 pr-10 max-w-full m-0">
        <h2 className="text-2xl font-semibold text-blue-600 m-0 mb-3 text-left self-start -ml-5">
          Parámetros de Calidad
        </h2>

        <div className="border-[3px] border-[#8bc34a] rounded-xl overflow-hidden bg-white shadow-lg w-full min-w-[800px]">
          <div className="max-h-[45rem] overflow-hidden relative">
            <div className="grid h-full" style={{ gridTemplateColumns }}>
              {showCheckboxes && (
                <div className="border-r-[3px] border-[#8bc34a] bg-white sticky left-0 z-20">
                  <div className="flex flex-col">
                    <div className={STYLES.ADJUSTMENT}></div>
                    <div className={`${STYLES.HEADER} border-r-[3px] border-[#8bc34a]`}></div>
                    {dataManagement.filas.map((_, filaIdx) => (
                      <div
                        key={`checkbox-${filaIdx}`}
                        className="border-b border-[#8bc34a] bg-white flex items-center justify-center h-10 min-h-10"
                      >
                        <Checkbox
                          checked={allowMultipleSelection 
                            ? selectedRowIndexes.includes(filaIdx)
                            : selectedRowIndex === filaIdx
                          }
                          onChange={(e, data) => handleCheckboxChange(filaIdx, data.checked === true)}
                          size="medium"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="border-r-[3px] border-[#8bc34a] bg-white sticky left-0 z-10">
                <div className="flex flex-col">
                  <div className={STYLES.ADJUSTMENT}>Ajustes</div>

                  <TooltipCell
                    content={columnConfig.keyCalidad}
                    show={
                      hoveredCell?.row === -1 &&
                      hoveredCell?.col === columnConfig.keyCalidad &&
                      hoveredCell?.type === "header" &&
                      TextUtils.shouldShowTooltipCalidad(columnConfig.keyCalidad)
                    }
                    onMouseEnter={() => mouseHandlers.handleMouseEnter(-1, columnConfig.keyCalidad, "header")}
                    onMouseLeave={mouseHandlers.handleMouseLeave}
                    className={`${STYLES.HEADER} border-r-[3px] border-[#8bc34a] px-0.5 relative`}
                  >
                    {TextUtils.truncateCalidad(columnConfig.keyCalidad)}
                  </TooltipCell>

                  {dataManagement.filas.map((fila, filaIdx) => (
                    <TooltipCell
                      key={`calidad-${filaIdx}`}
                      content={fila[columnConfig.keyCalidad] ?? ""}
                      show={tooltipUtils.shouldShowCalidadTooltip(filaIdx)}
                      onMouseEnter={() => mouseHandlers.handleMouseEnter(filaIdx, columnConfig.keyCalidad, "data")}
                      onMouseLeave={mouseHandlers.handleMouseLeave}
                      className={`border-b border-[#8bc34a] py-2 px-0.5 bg-white flex items-center justify-center text-xs font-medium h-10 min-h-10 overflow-hidden text-ellipsis whitespace-nowrap relative ${
                        showCheckboxes && selectedRowIndex === filaIdx ? "bg-blue-50" : ""
                      }`}
                    >
                      {TextUtils.truncateCalidad(fila[columnConfig.keyCalidad] ?? "")}
                    </TooltipCell>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-[#8bc34a] hover:scrollbar-thumb-[#7cb342]">
                <div className="flex flex-col min-w-fit w-full">
                  {/* Fila de ajustes */}
                  <div
                    className={`grid gap-0 px-1 items-center min-w-fit w-full ${STYLES.ADJUSTMENT.replace("flex", "grid")}`}
                    style={{ gridTemplateColumns: columnConfig.paramsGridColumns }}
                  >
                    {columnConfig.columnasParams.map((col, idx) => (
                      <div
                        key={`adjustment-container-${idx}`}
                        className={`flex justify-center items-center px-0.5 w-full min-w-[80px] border-r-2 border-[#8bc34a] h-full ${
                          idx === columnConfig.columnasParams.length - 1 ? "!border-r-0" : ""
                        }`}
                      >
                        <AdjustmentInput
                          value={adjustmentManagement.encabezadoSuperior[idx]?.toString() ?? ""}
                          index={idx}
                          onUpdate={handleAdjustmentUpdate}
                          onApply={handleAdjustmentApply}
                          className="min-w-[70px] w-20 max-w-[120px] h-8 text-center text-xs !border-2 !border-[#8bc34a] bg-white rounded font-medium mx-auto block overflow-hidden text-ellipsis whitespace-nowrap px-1"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Headers de parámetros */}
                  <div
                    className={`grid gap-0 min-w-fit w-full ${STYLES.HEADER.replace("flex", "grid")}`}
                    style={{ gridTemplateColumns: columnConfig.paramsGridColumns }}
                  >
                    {columnConfig.columnasParams.map((col, idx) => (
                      <TooltipCell
                        key={`header-${idx}`}
                        content={col}
                        show={tooltipUtils.shouldShowHeaderTooltip(col)}
                        onMouseEnter={() => mouseHandlers.handleMouseEnter(-1, col, "header")}
                        onMouseLeave={mouseHandlers.handleMouseLeave}
                        className={`min-w-[80px] w-full border-r-2 border-[#8bc34a] bg-[#8bc34a] flex items-center justify-center text-xs font-bold text-white h-full px-1 overflow-hidden text-ellipsis whitespace-nowrap relative ${
                          idx === columnConfig.columnasParams.length - 1 ? "!border-r-0" : ""
                        }`}
                      >
                        {TextUtils.getTruncatedText(col, columnConfig.columnasParams.length)}
                      </TooltipCell>
                    ))}
                  </div>

                  {/*FILAS DE PARÁMETROS - Todas editables, centradas y alineadas a la derecha*/}
                  {dataManagement.filas.map((fila, filaIdx) => (
                    <ParameterRow
                      key={`fila-params-${filaIdx}`}
                      fila={fila}
                      filaIndex={filaIdx}
                      columnasParams={columnConfig.columnasParams}
                      paramsGridColumns={columnConfig.paramsGridColumns}
                      onCellUpdate={handleCellUpdate}
                      isSelected={showCheckboxes && selectedRowIndex === filaIdx}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <ProcessControls
          numeroRumas={processConfig.numeroRumas}
          divisionRumas={processConfig.divisionRumas}
          hasChanges={shouldEnableReset}
          onRumasIncrement={processConfig.incrementRumas}
          onRumasDecrement={processConfig.decrementRumas}
          onRumasInputChange={processConfig.updateRumasFromInput}
          onDivisionIncrement={processConfig.incrementDivision}
          onDivisionDecrement={processConfig.decrementDivision}
          onDivisionInputChange={processConfig.updateDivisionFromInput}
          onReset={handleReset}
          onStartProcess={handleStartProcess}
          disabled={shouldDisableStartButton}
        />
      </div>
  )
}

export default QualityParametersMatrix
