import { PlantaFilter } from "./planta-filter";
import { TablePlanta } from "./table-planta";
import { PlantaProvider } from "./planta-context";

export function PlantaView() {
  return (
    <PlantaProvider>
      <div className="w-full h-3/20 pb-2">
        <PlantaFilter />
      </div>
      <div className="w-full h-17/20 pb-2">
        <TablePlanta />
      </div>
    </PlantaProvider>
  );
}
