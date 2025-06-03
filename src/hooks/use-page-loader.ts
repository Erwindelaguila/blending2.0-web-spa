"use client"

import { useEffect, useState } from "react"

export function usePageLoader(isLoading: boolean) {
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (isLoading) {
      setShouldRender(true)
    } else {
      const timer = setTimeout(() => setShouldRender(false), 200)
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  return { shouldRender }
}
