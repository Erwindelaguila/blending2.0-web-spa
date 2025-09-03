"use client";

import {  TableHistoricoLogistica } from "@/components/";
import { FilterLogistics } from "@/components/ui/app-filter-logistics";

export default function HistoricoLogisticaPage() {
  return (
    <>
      <div className="w-full flex flex-col h-full">
        <div className="w-full h-3/20 pb-2">
          <FilterLogistics
            title_filter="Buscar Ejecucion"
            title_input="Codigo de ejecucion"
          />
        </div>
        <div className="w-full h-17/20 pb-2 ">
          <TableHistoricoLogistica />
        </div>
      </div>
    </>
  );
}
