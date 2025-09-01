"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { Header } from "@/components/navigation/header";
import { Footer } from "../navigation/footer";
import useSWR from "swr";
import { AppParamsService } from "@/services/appParams.service";
import { BaseResponse } from "@/interface";
import { IKeyValue, setAppParams } from "@/lib/store/slices/appParamsSlice";
import { useDispatch } from "react-redux";
import { PageLoader } from "../ui/page-loader";

interface MainLayoutProps {
  children: React.ReactNode;
}
export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const dispatch = useDispatch();

  const {
    data: dataAppParams,
    isLoading,
    error,
  } = useSWR<BaseResponse<IKeyValue[]>>(
    "/api/core/appparam?isActive=1&isGlobal=1",
    AppParamsService.getAppParams,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  useEffect(() => {
    if (dataAppParams?.data) {
      dispatch(setAppParams(dataAppParams.data));
    }
  }, [dataAppParams, dispatch]);

  if (error) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="flex flex-col justify-center items-center gap-6">
          <div className="flex flex-col justify-center items-center">
            <span className="text-red-400 font-semibold">500 server error</span>
            <h5 className="text-8xl font-semibold">Opps!</h5>
          </div>
          <p>
            Error al obtener los parámetros de la aplicación. Por favor,
            inténtelo nuevamente y, si el problema persiste, contacte al
            administrador.
          </p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return <PageLoader isLoading text="Cargando parámetros de la aplicación" />;
  }

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
  )
}
