"use client"

import { Input, Label } from "@fluentui/react-components"
import { Add20Regular, Subtract20Regular } from "@fluentui/react-icons"

interface NumericInputControlProps {
  label: string
  value: number
  onIncrement: () => void
  onDecrement: () => void
  onInputChange: (value: string) => void
  min?: number
  max?: number
  disabled?: boolean
}

export function NumericInputControl({
  label,
  value,
  onIncrement,
  onDecrement,
  onInputChange,
  min,
  max,
  disabled = false,
}: NumericInputControlProps) {
  const isDecrementDisabled = disabled || (min !== undefined && value <= min)
  const isIncrementDisabled = disabled || (max !== undefined && value >= max)

  return (
    <div className="flex items-center gap-2">
      <Label className="text-xs font-semibold text-[#323130] whitespace-nowrap">{label}</Label>
      <div className="flex items-center gap-0 border border-[#d1d1d1] rounded bg-white overflow-hidden w-24">
        <button
          className="w-6 h-7 min-w-6 p-0 bg-gray-50 border-0 border-r border-[#d1d1d1] text-blue-600 cursor-pointer flex items-center justify-center hover:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-sm"
          onClick={onDecrement}
          disabled={isDecrementDisabled}
        >
          <Subtract20Regular />
        </button>
        <Input
          value={value.toString()}
          onChange={(e, data) => onInputChange(data.value)}
          className="w-12 h-7 !border-0 text-center text-sm font-medium bg-white focus:outline-none px-1"
        />
        <button
          className="w-6 h-7 min-w-6 p-0 bg-gray-50 border-0 border-l border-[#d1d1d1] text-blue-600 cursor-pointer flex items-center justify-center hover:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-sm"
          onClick={onIncrement}
          disabled={isIncrementDisabled}
        >
          <Add20Regular />
        </button>
      </div>
    </div>
  )
}
