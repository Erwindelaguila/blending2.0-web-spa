"use client"

import type React from "react"

interface DashboardLayoutProps {
  children: React.ReactNode
}
export function DashboardLayout({ children }: DashboardLayoutProps) {
  return <div className="max-w-7xl mx-auto">{children}</div>
}
