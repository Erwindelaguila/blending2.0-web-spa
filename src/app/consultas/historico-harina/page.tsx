"use client";

import { Filter, TableHistorico } from "@/components";

export default function HistoricoHarinaPage() {
  return (
    <>
      <div className="w-full flex flex-col gap-4">
        <Filter
          title_filter="Buscar Ejecucion"
          title_input="Codigo de ejecucion"
        ></Filter>
        <TableHistorico></TableHistorico>
      </div>
    </>
  );
}

