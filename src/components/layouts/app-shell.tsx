"use client";

import type React from "react";
import { AppProviders } from "@/providers/app-providers";
import { AppLayout } from "@/components/layouts/app-layout";
import { PageLoader } from "@/components/ui/page-loader";
import useSWR from "swr";
import { AppParamsService } from "@/services/appParams.service";
import { BaseResponse } from "@/interface";
import { IKeyValue, setAppParams } from "@/lib/store/slices/appParamsSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

interface AppShellProps {
  children: React.ReactNode;
}

function AppInitializer({ children }: { children: React.ReactNode }) {
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
    );
  }

  if (isLoading) {
    return <PageLoader isLoading text="Cargando parámetros de la aplicación" />;
  }

    console.log("dataAppParams >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ",dataAppParams);

  return <AppLayout>{children}</AppLayout>;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <AppProviders>
      <AppInitializer>{children}</AppInitializer>
    </AppProviders>
  );
}
