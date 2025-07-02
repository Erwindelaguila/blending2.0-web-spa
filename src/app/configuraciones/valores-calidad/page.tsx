"use client";

import { Filter, TableValoresCalidad } from "@/components";

export default function ValoresCalidadPage() {
  return (
    <>
      <div className="w-full flex flex-col h-full ">
        <div className="w-full h-3/20 pb-2">
          <Filter
            title_filter="Filtro"
            title_input="Codigo de calidad"
            moreCamps={false}
          ></Filter>
        </div>
        <div className="w-full h-17/20 pb-2">
          <TableValoresCalidad></TableValoresCalidad>
        </div>
      </div>
    </>
  );
}
