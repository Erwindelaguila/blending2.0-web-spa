import { Filter } from "@/components/ui/app-filter";
import { LineaProduccionTable } from "./linea-produccion-table";

export function LineaProduccionView() {
  return (
    <>
      <div className="w-full h-3/20 pb-2">
        <Filter title_filter="Filtro" title_input="Codigo" />
      </div>
      <div className="w-full h-17/20 pb-2">
        <LineaProduccionTable />
      </div>
    </>
  );
}
