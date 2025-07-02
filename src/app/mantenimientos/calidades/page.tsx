"use client";

import { Filter, TableCalidades } from "@/components";
export default function CalidadesPage() {
  return (
    <>
      <div className="w-full flex flex-col h-full ">
        <div className="w-full h-3/20 pb-2">
          <Filter
            title_filter="Buscar Calidad"
            title_input="Codigo de calidad"
          ></Filter>
        </div>
        <div className="w-full h-17/20 pb-2">
          <TableCalidades></TableCalidades>
        </div>
      </div>
    </>
  );
}
