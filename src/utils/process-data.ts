export function extraerValoresUnicos(data: DataItem[]) {
  const resultado: { [key: string]: Set<string> } = {
    centroUbicacion: new Set(),
    almacenUbicacion: new Set(),
    tipoProduccion: new Set(),
    centroProduccion: new Set(),
    rumaNro: new Set(),
    calidadPlanta: new Set(),
    planta: new Set(),
    serie: new Set(),
  };

  data.forEach((item) => {
    const fijos = item.fijos;
    if (fijos.centroUbicacion)
      resultado.centroUbicacion.add(fijos.centroUbicacion);
    if (fijos.almacenUbicacion)
      resultado.almacenUbicacion.add(fijos.almacenUbicacion);
    if (fijos.tipoProduccion)
      resultado.tipoProduccion.add(fijos.tipoProduccion);
    if (fijos.centroProduccion)
      resultado.centroProduccion.add(fijos.centroProduccion);
    if (fijos.rumaNro) resultado.rumaNro.add(fijos.rumaNro);
    if (fijos.calidadPlanta) resultado.calidadPlanta.add(fijos.calidadPlanta);
    if (fijos.planta) resultado.planta.add(fijos.planta);
    if (fijos.serie) resultado.serie.add(fijos.serie);
  });

  // Convertir los Sets a arrays
  return Object.fromEntries(
    Object.entries(resultado).map(([key, set]) => [key, Array.from(set)])
  );
}

type Fijos = {
  centroUbicacion: string;
  almacenUbicacion: string;
  tipoProduccion: string;
  centroProduccion: string;
  calidadPlanta: string;
  rumaNro: string;
  planta: string;
  serie: string;
};

type DataItem = {
  fijos: Fijos;
};

export function extraerValoresParametro(
  data: any[],
  nombreParametro: string
): string[] {
  return data.flatMap((item) => {
    const valor = item?.parametrosCalidad?.[nombreParametro];
    if (valor === undefined || valor === null) return [];
    return Array.isArray(valor) ? valor : [valor];
  });
}

///En esta funcion puede acceder asi
//const relacion = buildRelacionCentroUbicacion(data);
//console.log("Estoooo: ",relacion['TSUP']);

export function buildRelacionCentroUbicacion(data: any[]) {
  const mapa: Record<
    string,
    { almacenesUbicacion: Set<string>; centrosProduccion: Set<string> }
  > = {};

  for (const item of data) {
    const fijos = item.fijos;

    const cu = fijos.centroUbicacion;
    const au = fijos.almacenUbicacion;
    const cp = fijos.centroProduccion;

    if (!cu || cu.trim() === "") continue; // Ignorar vacíos

    if (!mapa[cu]) {
      mapa[cu] = {
        almacenesUbicacion: new Set(),
        centrosProduccion: new Set(),
      };
    }

    if (au && au.trim() !== "") mapa[cu].almacenesUbicacion.add(au);
    if (cp && cp.trim() !== "") mapa[cu].centrosProduccion.add(cp);
  }

  // Convertimos Sets a arrays
  const resultado: Record<
    string,
    { almacenesUbicacion: string[]; centrosProduccion: string[] }
  > = {};
  for (const cu in mapa) {
    resultado[cu] = {
      almacenesUbicacion: Array.from(mapa[cu].almacenesUbicacion),
      centrosProduccion: Array.from(mapa[cu].centrosProduccion),
    };
  }

  return resultado;
}

/**
 * const centroSeleccionado = "TCHI"; // viene del combo seleccionado
 * const relaciones = getRelacionadosPorCentroUbicacion(
        data,
        centroSeleccionado
      );

      console.log("alamcenes",relaciones.almacenesUbicacion); // Lista de almacenes únicos
      console.log("centros",relaciones.centrosProduccion); // Lista de centros producción únicos
 * 
 */
function getRelacionadosPorCentroUbicacion(
  data: any[],
  centroUbicacion: string
) {
  const almacenesUbicacion = new Set<string>();
  const centrosProduccion = new Set<string>();

  for (const item of data) {
    const fijos = item.fijos;

    const cu = fijos.centroUbicacion?.trim();
    const au = fijos.almacenUbicacion?.trim();
    const cp = fijos.centroProduccion?.trim();

    if (cu !== centroUbicacion) continue; // Solo si coincide con el parámetro
    if (au) almacenesUbicacion.add(au);
    if (cp) centrosProduccion.add(cp);
  }

  return {
    almacenesUbicacion: Array.from(almacenesUbicacion),
    centrosProduccion: Array.from(centrosProduccion),
  };
}

export function getRelacionadosPorPlanta(data: any[], plata: string) {
  const centrosUbicacion = new Set<string>();
  const almacenesUbicacion = new Set<string>();
  const centrosProduccion = new Set<string>();

  for (const item of data) {
    const fijos = item.fijos;

    const pa = fijos.planta?.trim();
    const cu = fijos.centroUbicacion?.trim();
    const au = fijos.almacenUbicacion?.trim();
    const cp = fijos.centroProduccion?.trim();

    if (pa !== plata) continue; // Solo si coincide con el parámetro
    if (cu) centrosUbicacion.add(cu);
    if (au) almacenesUbicacion.add(au);
    if (cp) centrosProduccion.add(cp);
  }

  return {
    centrosUbicacion: Array.from(centrosUbicacion),
    almacenesUbicacion: Array.from(almacenesUbicacion),
    centrosProduccion: Array.from(centrosProduccion),
  };
}

export function getValoresUnificadosPorCentros(
  data: any[],
  centrosSeleccionados: string[]
) {
  const almacenesSet = new Set<string>();
  const centrosProduccionSet = new Set<string>();

  for (const item of data) {
    const fijos = item.fijos;

    const cu = fijos.centroUbicacion?.trim();
    const au = fijos.almacenUbicacion?.trim();
    const cp = fijos.centroProduccion?.trim();

    if (!cu || !centrosSeleccionados.includes(cu)) continue;

    if (au) almacenesSet.add(au);
    if (cp) centrosProduccionSet.add(cp);
  }

  return {
    almacenesUbicacion: Array.from(almacenesSet),
    centrosProduccion: Array.from(centrosProduccionSet),
  };
}

export type DataOferta = {
  [lote: string]: {
    fijos: any;
    parametrosCalidad: any;
    otrosParamentros: any;
  };
};

export const agruparPorUmVta = (dataOferta: DataOferta) => {
  // 1. Filtrar para quedarnos solo con los que tienen umVta numérico
  const filtrados = Object.entries(dataOferta).filter(
    ([, value]) => !isNaN(Number(value.fijos.umVta))
  );

  // 2. Agrupar por valor de umVta
  const agrupados: Record<string, DataOferta> = {};

  filtrados.forEach(([lote, data]) => {
    const grupoKey = `Grupo-${data.fijos.umVta}`;
    if (!agrupados[grupoKey]) {
      agrupados[grupoKey] = {};
    }
    agrupados[grupoKey][lote] = data;
  });

  return agrupados;
};

export function OrderKeyAgupacionUmVta(key: string[]): string[] {
  const keysOrdenados = key.sort((a, b) => {
    const numA = parseInt(a.replace("Grupo-", ""), 10);
    const numB = parseInt(b.replace("Grupo-", ""), 10);
    return numA - numB;
  });
  return keysOrdenados;
}


export function parseCommaSeparatedArray(raw: string | null | undefined): string[] {
  if (!raw || typeof raw !== "string") return [];

  // validar que tiene formato "valor(,valor)*"
  const isValid = /^([^,]+)(,[^,]+)*$/.test(raw.trim());
  if (!isValid) return [];

  return raw
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item !== "");
}
