import type React from "react"
export interface FilaDato {
  [key: string]: string | undefined
}

export interface HoveredCell {
  row: number
  col: string
  type?: "header" | "data"
}

export interface ColumnConfig {
  keys: string[]
  keyCalidad: string
  columnas: string[]
  columnasFijas: string[]
  columnasParams: string[]
  paramsGridColumns: string
}

export interface ProcessConfig {
  numeroRumas: number
  divisionRumas: number
  parametros: FilaDato[]
  totalParametros: number
}

export interface MatrixCellProps {
  value: string
  onUpdate: (value: string) => void
  readOnly?: boolean
  className?: string
  type?:
    | "number"
    | "text"
    | "search"
    | "time"
    | "email"
    | "password"
    | "tel"
    | "url"
    | "date"
    | "datetime-local"
    | "month"
    | "week"
  placeholder?: string
}

export interface AdjustmentInputProps {
  value: string
  index: number
  onUpdate: (index: number, value: string) => void
  onApply: (index: number) => void
  className?: string
}

export interface TooltipCellProps {
  content: string
  show: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
  className?: string
  children: React.ReactNode
}

export interface ParameterRowProps {
  fila: FilaDato
  filaIndex: number
  columnasParams: string[]
  paramsGridColumns: string
  onCellUpdate: (filaIndex: number, columna: string, value: string) => void
  isSelected: boolean
}

export interface FixedColumnsRowProps {
  fila: FilaDato
  filaIndex: number
  columnasFijas: string[]
  onCellUpdate: (filaIndex: number, columna: string, value: string) => void
  isSelected: boolean
}

export interface QualityParametersMatrixProps {
  showCheckboxes?: boolean
  selectedType?: string
  allowMultipleSelection?: boolean
}

export interface MouseHandlers {
  handleMouseEnter: (row: number, col: string, type: "header" | "data") => void
  handleMouseLeave: () => void
}
