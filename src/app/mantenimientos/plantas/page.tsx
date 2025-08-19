"use client";

import { TablePlanta } from "@/components";
import { PlantaProvider } from "@/components/admin/plantas-homogenizacion/planta-context";
import { PlantaFilter } from "@/components/admin/plantas-homogenizacion/planta-filter";

export default function PlantasHomogenizacionPage() {
  return (
    <PlantaProvider>
      <div className="w-full flex flex-col h-full">
        <div className="w-full h-3/20 pb-2">
          <PlantaFilter />
        </div>
        <div className="w-full h-17/20 pb-2">
          <TablePlanta />
        </div>
      </div>
    </PlantaProvider>
  );
}
