import { AppParamProvider } from "./app-param-context";
import { AppParamFilter } from "./app-param-filter";
import { TableConfiguracionApp } from "./table-configuracion";

export function AppParamView() {
	return (
		<AppParamProvider>
			<div className="w-full h-3/20 pb-2">
				<AppParamFilter />
			</div>
			<div className="w-full h-17/20 pb-2">
				<TableConfiguracionApp />
			</div>
		</AppParamProvider>
	);
}
