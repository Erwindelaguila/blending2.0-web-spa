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
    width: "100vw",
    height: "100vh",
    background: COLORS.primary,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    zIndex: "9999",
    backdropFilter: "blur(1.5px)",
    transition: "none",
    overflow: "hidden",
  },
  logo: {
    width: "180px",
    height: "180px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "32px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #2e3567 0%, #457b9d 100%)",
    position: "relative",
    boxShadow: "0 12px 48px #232a4a33, 0 4px 24px #0002",
    overflow: "hidden",
  },
  borderAnim: {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    border: "6px solid transparent",
    borderTop: "6px solid #457b9d",
    borderRight: "6px solid #fff",
    borderBottom: "6px solid #2e3567",
    borderLeft: "6px solid #fff",
    boxSizing: "border-box",
    animationName: {
      "0%": { transform: "rotate(0deg)" },
      "100%": { transform: "rotate(360deg)" },
    },
    animationDuration: "1.2s",
    animationIterationCount: "infinite",
    animationTimingFunction: "linear",
    zIndex: 1,
  },
  spinner: {
    display: "none",
  },
  text: {
    marginTop: "18px",
    color: "#fff",
    fontSize: "20px",
    fontWeight: 700,
    letterSpacing: "0.18em",
    textShadow: "0 2px 12px #232a4a55, 0 1px 8px #0002",
    textAlign: "center",
    fontFamily: 'inherit',
    padding: "0 12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "32px",
  },
  dots: {
    display: "inline-block",
    width: "32px",
    textAlign: "left",
    marginLeft: "4px",
    fontWeight: 700,
    letterSpacing: 0,
  },
})
export function PageLoader({ isLoading, text = "Cargando..." }: PageLoaderProps) {
  const styles = useStyles()
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 400);
    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <div className={styles.borderAnim} />
        <img
          src="/logo-tasa-white.svg"
          alt="Logo"
          style={{ width: 120, height: 120, objectFit: "contain", position: "relative", zIndex: 2 }}
        />
      </div>
      <div className={styles.text}>
        {text.replace(/\.*$/, "")}
        <span className={styles.dots}>{".".repeat(dotCount) + (dotCount < 3 ? ".".repeat(3 - dotCount) : "")}</span>
      </div>
    </div>
  )
}