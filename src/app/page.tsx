"use client"

import { Sidebar } from "@/components/navigation/sidebar";
import { WelcomeDashboardCard } from "@/components/dashboard/welcome-dashboard-card";
import { useState } from "react";
export default function Home() {
  // Sidebar expects collapsed and toggleSidebar props
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed((c) => !c);
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#f7fafd" }}>
        <WelcomeDashboardCard />
      </main>
    </div>
  );
}
