import { ParametroProvider } from "./parametro-context";
import { ParametroFilter } from "./parametro-filter";
import { TableParametros } from "./parametro-table";

export function ParametroView() {
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

