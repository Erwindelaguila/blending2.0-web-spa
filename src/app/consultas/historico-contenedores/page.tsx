"use client";

import { Filter, TableHistoricoLogistica } from "@/components/";

export default function HistoricoLogisticaPage() {
  return (
    <>
      <div className="w-full flex flex-col h-full">
        <div className="w-full h-3/20 pb-2">
          <Filter
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
