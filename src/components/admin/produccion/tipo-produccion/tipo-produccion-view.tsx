import { TipoProduccionTable } from "./tipo-produccion-table";
import { TipoProduccionFilter } from "./tipo-produccion-filter";
import { TipoProduccionProvider } from "./tipo-produccion-context";

export function TipoProduccionView() {
  return (
    <TipoProduccionProvider>
      <div className="w-full h-3/20 pb-2">
        <TipoProduccionFilter />
      </div>
      <div className="w-full h-17/20 pb-2">
        <TipoProduccionTable />
      </div>
    </TipoProduccionProvider>
  );
}
