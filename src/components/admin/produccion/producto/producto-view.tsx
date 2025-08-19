import { ProductoProvider } from "@/components/admin/produccion/producto/producto-context";
import { ProductoFilter } from "@/components/admin/produccion/producto/producto-filter";
import { ProductoTable } from "@/components/admin/produccion/producto/producto-table";

export function ProductoView() {
  return (
    <ProductoProvider>
      <div className="w-full h-3/20 pb-2">
        <ProductoFilter />
      </div>
      <div className="w-full h-17/20 pb-2">
        <ProductoTable />
      </div>
    </ProductoProvider>
  );
}
