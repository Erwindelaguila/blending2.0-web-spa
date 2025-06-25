"use client"

import { memo } from "react"
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip"
import type { TooltipCellProps } from "@/interface/quality/quality-matrix.interfaces"

export const TooltipCell = memo(function TooltipCell({
  content,
  show,
  onMouseEnter,
  onMouseLeave,
  className = "",
  children,
}: TooltipCellProps) {
  return (
    <TooltipProvider>
      <div className={className} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <Tooltip content={content} show={show}>
          {children}
        </Tooltip>
      </div>
    </TooltipProvider>
  )
})