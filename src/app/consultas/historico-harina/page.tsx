"use client";

import { Filter, TableHistorico } from "@/components";

export default function HistoricoHarinaPage() {
  return (
    <>
      <div className="w-full flex flex-col h-full ">
        <div className="w-full h-3/20 pb-2">
          <Filter
            title_filter="Buscar Ejecucion"
            title_input="Codigo de ejecucion"
          ></Filter>
        </div>
        <div className="w-full h-17/20 pb-2">
          <TableHistorico></TableHistorico>
        </div>
      </div>
    </>
  );
}
