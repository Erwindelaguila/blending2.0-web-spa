"use client"

import { WelcomeDashboard } from "@/components/dashboard/welcome-dashboard"
import { useEffect } from "react"

export default function Home() {
  useEffect(() => {
    console.log("🏠 Dashboard: Página cargada")
  }, [])

  return <WelcomeDashboard />
}
