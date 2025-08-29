"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { ProtectedRoute } from "@/components/navigation/protected-route";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { MainLayout } from "@/components/layouts/main-layout";
import { PageLoader } from "@/components/ui/page-loader";
import { useAuth } from "@/hooks/use-auth";
import useSWR from "swr";
import { BaseResponse } from "@/interface";
import { AppParamsService } from "@/services/appParams.service";
import { useDispatch } from "react-redux";
import { setAppParams } from "@/lib/store/slices/appParamsSlice";

interface AppLayoutProps {
  children: React.ReactNode;
}

interface IKeyValue {
  key: string;
  value: string;
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();

  const { user, isAppLoading } = useAuth();

  const [isNavigating, setIsNavigating] = useState(false);

  const { isDashboard, isAuthenticated } = useMemo(
    () => ({
      isDashboard: pathname === "/",
      isAuthenticated: !!user?.isAuthenticated,
    }),
    [pathname, user?.isAuthenticated]
  );

  useEffect(() => {
    if (isDashboard) return;

    setIsNavigating(true);
    const timer = setTimeout(() => setIsNavigating(false), 300);
    return () => clearTimeout(timer);
  }, [pathname, isDashboard]);

  if (isAppLoading) {
    return <PageLoader isLoading text="Cargando aplicación" />;
  }

  if (!isAuthenticated) {
    return (
      <ProtectedRoute>
        <PageLoader isLoading text="Autenticando" />
      </ProtectedRoute>
    );
  }

  const Layout = isDashboard ? DashboardLayout : MainLayout;

  return (
    <ProtectedRoute>
      {isNavigating && <PageLoader isLoading text="Navegando..." />}
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}
