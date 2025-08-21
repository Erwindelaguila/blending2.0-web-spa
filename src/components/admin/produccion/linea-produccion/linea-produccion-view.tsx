import { LineaProduccionFilter } from "./linea-produccion-filter";
import { LineaProduccionTable } from "./linea-produccion-table";
import { LineaProduccionProvider } from "./linea-produccion-context";

export function LineaProduccionView() {
  return (
    <LineaProduccionProvider>
      <div className="w-full h-3/20 pb-2">
        <LineaProduccionFilter />
      </div>
      <div className="w-full h-17/20 pb-2">
        <LineaProduccionTable />
      </div>
    </LineaProduccionProvider>
  );
}
