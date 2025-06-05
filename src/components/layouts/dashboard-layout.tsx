"use client"

import type React from "react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      {children}
    </div>
  )
}