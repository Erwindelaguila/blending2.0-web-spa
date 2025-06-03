"use client"

import { usePageLoader } from "@/hooks/use-page-loader"
import { useLoaderStyles } from "@/styles/loader.styles"

interface PageLoaderProps {
  isLoading: boolean
  text?: string
}
export function PageLoader({ isLoading, text = "Cargando..." }: PageLoaderProps) {
  const styles = useLoaderStyles()
  const { shouldRender } = usePageLoader(isLoading)

  if (!shouldRender) return null

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
