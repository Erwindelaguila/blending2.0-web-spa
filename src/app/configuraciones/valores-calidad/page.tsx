"use client";

import { TableValoresCalidad } from "@/components";
import { ValoresCalidadFilter } from "@/components/admin/valores-calidad/valores-calidad-filter";
import { ValoresCalidadProvider } from "@/components/admin/valores-calidad/valores-calidad-context";

export default function ValoresCalidadPage() {
  return (
    <ValoresCalidadProvider>
      <div className="w-full flex flex-col h-full ">
        <div className="w-full h-3/20 pb-2">
          <ValoresCalidadFilter />
        </div>
        <div className="w-full h-17/20 pb-2">
          <TableValoresCalidad />
        </div>
      </div>
    </ValoresCalidadProvider>
  );
}
