"use client";

import { useState } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { Header } from "@/components/navigation/header";
import { Footer } from "../navigation/footer";
import useSWR from "swr";
import { AppParamsService } from "@/services/appParams.service";
import { BaseResponse } from "@/interface";


interface MainLayoutProps {
  children: React.ReactNode;
}
export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

 

  return (
    <div className="flex h-screen overflow-hidden w-full">
      <Sidebar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />

      <div className="flex flex-col flex-1 overflow-hidden h-full">
        <Header toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-hidden bg-slate-100 px-4 pt-2 h-14/15">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}
