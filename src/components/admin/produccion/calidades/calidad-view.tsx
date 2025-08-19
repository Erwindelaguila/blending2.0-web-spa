import { CalidadTable } from "./calidad-table";
import { CalidadFilter } from "./calidad-filter";
import { CalidadProvider } from "./calidad-context";

export function CalidadView() {
  return (
    <CalidadProvider>
      <div className="w-full h-3/20 pb-2">
        <CalidadFilter />
      </div>
      <div className="w-full h-17/20 pb-2">
        <CalidadTable />
      </div>
    </CalidadProvider>
  );
}
