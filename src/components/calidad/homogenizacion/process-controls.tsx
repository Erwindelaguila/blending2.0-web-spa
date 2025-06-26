"use client"
import { NumericInputControl } from "@/components/ui/numeric-input-control"
import { LIMITS } from "@/lib/constants/quality-matrix.constants"

interface ProcessControlsProps {
  numeroRumas: number
  divisionRumas: number
  hasChanges: boolean
  onRumasIncrement: () => void
  onRumasDecrement: () => void
  onRumasInputChange: (value: string) => void
  onDivisionIncrement: () => void
  onDivisionDecrement: () => void
  onDivisionInputChange: (value: string) => void
  onReset: () => void
  onStartProcess: () => void
  disabled?: boolean 
}

export function ProcessControls({
  numeroRumas,
  divisionRumas,
  hasChanges,
  onRumasIncrement,
  onRumasDecrement,
  onRumasInputChange,
  onDivisionIncrement,
  onDivisionDecrement,
  onDivisionInputChange,
  onReset,
  onStartProcess,
  disabled = false, 
}: ProcessControlsProps) {
  return (
    <div className="flex items-center justify-between gap-5 pt-4 pb-0 px-0 bg-transparent rounded-none mt-4 w-full shadow-none">
      <div className="flex gap-6 items-center flex-1">
        <NumericInputControl
          label="Número de rumas"
          value={numeroRumas}
          onIncrement={onRumasIncrement}
          onDecrement={onRumasDecrement}
          onInputChange={onRumasInputChange}
          min={LIMITS.MIN_RUMAS}
        />

        <NumericInputControl
          label="División de rumas (toneladas)"
          value={divisionRumas}
          onIncrement={onDivisionIncrement}
          onDecrement={onDivisionDecrement}
          onInputChange={onDivisionInputChange}
          min={LIMITS.MIN_DIVISION}
          max={LIMITS.MAX_DIVISION}
        />
      </div>

      <div className="flex flex-col gap-3 items-center flex-shrink-0 ml-auto">
        <button
          onClick={onReset}
          disabled={!hasChanges}
          className="h-9 text-sm font-medium py-2 px-4 bg-white border-2 border-[#d1d1d1] text-[#323130] rounded-md min-w-[180px] hover:bg-gray-50 hover:border-[#c8c6c4] disabled:bg-gray-50 disabled:border-[#edebe9] disabled:text-gray-400 cursor-pointer disabled:cursor-not-allowed transition-colors"
        >
          Restablecer parámetros
        </button>

        <button
          onClick={onStartProcess}
          disabled={disabled} 
          className="h-10 text-sm font-semibold py-2 px-5 bg-[#0078d4] border-2 border-[#0078d4] text-white rounded-md min-w-[160px] hover:bg-[#106ebe] hover:border-[#106ebe] cursor-pointer transition-colors shadow-sm disabled:bg-gray-400 disabled:border-gray-400 disabled:cursor-not-allowed"
        >
          Iniciar proceso
        </button>
      </div>
    </div>
  )
}
