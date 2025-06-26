"use client";

import { Filter, TableHistoricoLogistica } from "@/components/";

export default function HistoricoLogisticaPage() {
  return (
    <>
      <div className="w-full flex flex-col gap-4">
        <Filter
          title_filter="Buscar Ejecucion"
          title_input="Codigo de ejecucion"
        />
        <TableHistoricoLogistica />
      </div>
    </>
  );
}