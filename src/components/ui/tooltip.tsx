import type React from "react"
import type { ReactNode } from "react"

interface TooltipProps {
  content: string
  children: ReactNode
  show: boolean
}

export function Tooltip({ content, children, show }: TooltipProps) {
  return (
    <div className="relative">
      {children}
      {show && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 py-1.5 px-2 bg-[#323130] text-white text-xs rounded whitespace-nowrap z-30 shadow-lg after:content-[''] after:absolute after:top-full after:left-1/2 after:transform after:-translate-x-1/2 after:border-t-4 after:border-r-4 after:border-b-4 after:border-l-4 after:border-t-[#323130] after:border-r-transparent after:border-b-transparent after:border-l-transparent">
          {content}
        </div>
      )}
    </div>
  )
}
export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
