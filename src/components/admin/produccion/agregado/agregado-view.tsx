import { AgregadoFilter } from "./agregado-filter";
import { AgregadoTable } from "./agregado-table";
import { AgregadoProvider } from "./agregado-context";

export function AgregadoView(){
    return (
        <AgregadoProvider>
          <div className="w-full h-3/20 pb-2">
            <AgregadoFilter />
          </div>
          <div className="w-full h-17/20 pb-2">
            <AgregadoTable />
          </div>
        </AgregadoProvider>
      );
}