"use client"

import { useEffect, type ReactNode } from "react"

interface LoadingProviderProps {
  readonly children: ReactNode
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  useEffect(() => {
    const hideInitialLoader = (): void => {
      const loader = document.getElementById("initial-loader")
      if (loader) {
        loader.style.display = "none"
      }

      document.body.style.visibility = "visible"
      document.body.classList.add("app-loaded")
    }
    const timerId = setTimeout(hideInitialLoader, 50)

    return () => clearTimeout(timerId)
  }, [])
  return <>{children}</>
}
