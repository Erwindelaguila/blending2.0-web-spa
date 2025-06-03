"use client"

import { useEffect, useState } from "react"
import { COLORS } from "@/config/app.config.server"

interface AppLoaderProps {
  isLoading: boolean
  type?: "initial" | "navigation"
  text?: string
}
export function AppLoader({ isLoading, type = "navigation", text = "Cargando..." }: AppLoaderProps) {
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (isLoading) {
      setShouldRender(true)
    } else {
      const timer = setTimeout(() => setShouldRender(false), 200)
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  if (!shouldRender) return null

  const isInitial = type === "initial"
  const zIndex = isInitial ? 9999 : 8888
  const backdropFilter = isInitial ? "none" : "blur(2px)"

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: isInitial ? COLORS.background : "rgba(248, 250, 252, 0.95)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex,
        backdropFilter,
        opacity: isLoading ? 1 : 0,
        transition: "opacity 0.2s ease",
      }}
    >
      <div
        style={{
          width: isInitial ? "64px" : "48px",
          height: isInitial ? "64px" : "48px",
          backgroundColor: COLORS.primary,
          color: "white",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: isInitial ? "32px" : "24px",
          fontWeight: "bold",
          marginBottom: "16px",
          animation: "pulse 2s infinite",
        }}
      >
        T
      </div>

      <div
        style={{
          width: isInitial ? "40px" : "32px",
          height: isInitial ? "40px" : "32px",
          border: `${isInitial ? "3px" : "2px"} solid #e2e8f0`,
          borderTop: `${isInitial ? "3px" : "2px"} solid ${COLORS.primary}`,
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />

      <div
        style={{
          marginTop: "12px",
          color: COLORS.textSecondary,
          fontSize: isInitial ? "14px" : "13px",
          fontWeight: "500",
        }}
      >
        {text}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  )
}
