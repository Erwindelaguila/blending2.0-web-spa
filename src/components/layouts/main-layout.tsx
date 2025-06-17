"use client"

import { useState } from "react"
import { Sidebar } from "@/components/navigation/sidebar"
import { Header } from "@/components/navigation/header"
import { Footer } from "../navigation/footer"

interface MainLayoutProps {
  children: React.ReactNode
}
export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const toggleSidebar = () => setSidebarCollapsed(prev => !prev)

  return (
    <div className="flex h-screen overflow-hidden w-full">
      <Sidebar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-auto bg-slate-50 p-6">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}
