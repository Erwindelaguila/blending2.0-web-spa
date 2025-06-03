"use client"

import { useEffect, type ReactNode } from "react"

interface LoadingProviderProps {
  children: ReactNode
}
export function LoadingProvider({ children }: LoadingProviderProps) {
  useEffect(() => {
    const showApp = () => {
      const loader = document.getElementById("initial-loader")
      const body = document.body

      if (loader) {
        loader.style.opacity = "0"
        loader.style.transition = "opacity 0.3s ease"
        setTimeout(() => {
          loader.remove()
        }, 300)
      }

      body.classList.add("app-loaded")
      body.style.visibility = "visible"
    }

    const timer = setTimeout(showApp, 100)

    if (document.readyState === "complete") {
      showApp()
    } else {
      window.addEventListener("load", showApp)
    }

    return () => {
      clearTimeout(timer)
      window.removeEventListener("load", showApp)
    }
  }, [])

  return <>{children}</>
}
