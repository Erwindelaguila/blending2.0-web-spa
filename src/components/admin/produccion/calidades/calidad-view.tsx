import { Filter } from "@/components/ui/app-filter";
import { CalidadTable } from "./calidad-table";

export function CalidadView() {
  return (
    <>
      <div className="w-full h-3/20 pb-2">
        <Filter title_filter="Filtro" title_input="Codigo" />
      </div>
      <div className="w-full h-17/20 pb-2">
        <CalidadTable />
      </div>
    </>
  );
}
