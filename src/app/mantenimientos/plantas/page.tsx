"use client";

import { DrawerBase, Filter, TablePlanta } from "@/components";

export default function PlantasHomogenizacionPage() {
  return (
    <>
      <div className="w-full flex flex-col gap-4">
        <Filter></Filter>
        <TablePlanta></TablePlanta>
        
      </div>
    </>
  );
}
