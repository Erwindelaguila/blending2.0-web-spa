import { Filter } from "@/components/ui/app-filter";
import { ProductoTable } from "./producto-table";

export function ProductoView() {
  return (
    <>
      <div className="w-full h-3/20 pb-2">
        <Filter
          title_filter="Filtro"
          title_input="Codigo"
        />
      </div>
      <div className="w-full h-17/20 pb-2">
        <ProductoTable />
      </div>
    </>
  );
}
