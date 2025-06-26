"use client"
import React, { memo } from "react"
import type { ReactNode } from "react"

interface TooltipCellProps {
  content: string
  show: boolean
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  className?: string
  children: ReactNode
}

export const TooltipCell = memo(function TooltipCell({
  content,
  show,
  onMouseEnter,
  onMouseLeave,
  className = "",
  children,
}: TooltipCellProps) {
  return (
    <div className="relative">
      <div 
        className={className} 
        onMouseEnter={onMouseEnter} 
        onMouseLeave={onMouseLeave}
      >
        {children}
      </div>
      {show && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 py-1.5 px-2 bg-[#323130] text-white text-xs rounded whitespace-nowrap z-30 shadow-lg after:content-[''] after:absolute after:top-full after:left-1/2 after:transform after:-translate-x-1/2 after:border-t-4 after:border-r-4 after:border-b-4 after:border-l-4 after:border-t-[#323130] after:border-r-transparent after:border-b-transparent after:border-l-transparent">
          {content}
        </div>
      )}
    </div>
  )
})