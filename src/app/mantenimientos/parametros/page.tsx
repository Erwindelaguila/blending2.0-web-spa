"use client";

import { TableParametros } from "@/components";
import { ParametroProvider } from "@/components/admin/parametros-calidad/parametro-context";
import { ParametroFilter } from "@/components/admin/parametros-calidad/parametro-filter";

export default function ParametrosCalidadPage() {
  return (
    <ParametroProvider>
      <div className="w-full h-3/20 pb-2">
        <ParametroFilter />
      </div>
      <div className="w-full h-17/20 pb-2">
        <TableParametros />
      </div>
    </ParametroProvider>
  );
}
