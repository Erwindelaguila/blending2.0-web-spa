"use client";

import { Filter, TableConfiguracionApp } from "@/components";

export default function ConfiguracionAplicacionPage() {
  return (
    <>
      <div className="w-full flex flex-col h-full ">
        <div className="w-full h-3/20 pb-2">
          <Filter
            title_filter="Buscar Planta"
            title_input="Codigo de planta"
          ></Filter>
        </div>
        <div className="w-full h-17/20 pb-2">
          <TableConfiguracionApp></TableConfiguracionApp>
        </div>
      </div>
    </>
  );
}
