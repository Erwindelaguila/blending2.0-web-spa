"use client"

import { useEffect, useState } from "react"
import { makeStyles } from "@fluentui/react-components"
import { COLORS } from "@/config/app.config.server"

interface PageLoaderProps {
  isLoading: boolean
  text?: string
}

const useStyles = makeStyles({
  container: {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(248, 250, 252, 0.95)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    zIndex: "8888",
    backdropFilter: "blur(2px)",
  },
  logo: {
    width: "48px",
    height: "48px",
    backgroundColor: COLORS.primary,
    color: "white",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "16px",
    animationName: {
      "0%": { transform: "scale(1)" },
      "50%": { transform: "scale(1.05)" },
      "100%": { transform: "scale(1)" },
    },
    animationDuration: "2s",
    animationIterationCount: "infinite",
    animationTimingFunction: "ease-in-out",
  },
  spinner: {
    width: "32px",
    height: "32px",
    border: "2px solid #e2e8f0",
    borderTopColor: COLORS.primary,
    borderRadius: "50%",
    animationName: {
      "0%": { transform: "rotate(0deg)" },
      "100%": { transform: "rotate(360deg)" },
    },
    animationDuration: "1s",
    animationIterationCount: "infinite",
    animationTimingFunction: "linear",
  },
  text: {
    marginTop: "12px",
    color: COLORS.textSecondary,
    fontSize: "13px",
    fontWeight: "500",
  },
})
export function PageLoader({ isLoading, text = "Cargando..." }: PageLoaderProps) {
  const styles = useStyles()
  const [shouldRender, setShouldRender] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    if (isLoading) {
      setShouldRender(true)
    } else {
      const timer = setTimeout(() => setShouldRender(false), 200)
      return () => clearTimeout(timer)
    }
  }, [isLoading, isMounted])

  if (!isMounted || !shouldRender) {
    return null
  }

  return (
    <div
      className={styles.container}
      style={{
        opacity: isLoading ? 1 : 0,
        transition: "opacity 0.2s ease",
      }}
    >
      <div className={styles.logo}>T</div>
      <div className={styles.spinner} />
      <div className={styles.text}>{text}</div>
    </div>
  )
}