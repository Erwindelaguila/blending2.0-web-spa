export const getAllCalidadKey = () => {
  return "/api/core/produccion/calidad"; // actualizado endpoint correcto
};

export const fetchGetCalidadesId = (id: string) => {
  return `/api/core/produccion/calidad/detail?id=${id}`; // endpoint detalle con query id
};

export const getAllParametroKey = "/api/core/parametro";

export const getByIdParametroKey = (id: string) => {
  return `/api/core/parametro/detail?id=${id}`;
};

export const fetchGetParametrosId = (id: string) => {
  return `/api/core/parametro/detail?id=${id}`;
};

export const getUserMenuKey = () => {
  return "/api/core/user/menu";
};

export const getAllPlantaKey = () => {
  return "/api/core/planta";
};

export const fetchGetPlantasId = (id: string) => {
  return `/api/core/planta/detail?id=${id}`;
};

export const createPlantaKey = () => {
  return "/api/core/planta";
};

export const updatePlantaKey = () => {
  return "/api/core/planta";
};

export const deletePlantaKey = () => {
  return "/api/core/planta";
};

//Region Produccion
export const getAllAgregadoKey = () => {
  return `/api/core/produccion/agregado`;
};
//http://localhost:7006/api/core/produccion/agregado


export const getByIdAgregadoKey = (id: string ) => {
  return `api/core/produccion/agregado/detail?id=${id}`;
};

export const deleteAgregadoKey = () => {
  return `/api/core/produccion/agregado`;
};

// Region Produccion - Linea Produccion
export const getAllLineaProduccionKey = () => {
  return `/api/core/produccion/lineaproduccion`;
};

export const getByIdLineaProduccionKey = (id: string) => {
  return `/api/core/produccion/lineaproduccion/detail?id=${id}`;
};

export const deleteLineaProduccionKey = () => {
  return `/api/core/produccion/lineaproduccion`;
};

// Region Produccion - Tipo Produccion
export const getAllTipoProduccionKey = () => {
  return `/api/core/produccion/tipoproduccion`;
};

export const getByIdTipoProduccionKey = (id: string) => {
  return `/api/core/produccion/tipoproduccion/detail?id=${id}`;
};

export const deleteTipoProduccionKey = () => {
  return `/api/core/produccion/tipoproduccion`;
};
