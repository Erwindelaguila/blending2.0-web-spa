export const getAllCalidadKey = () => {
  return "/api/calidades";
};

export const fetchGetCalidadesId = (id: string) => {
  return `/api/calidades/${id}`;
};

export const getAllParametroKey = "/api/core/parametro";

export const fetchGetParametrosId = (id: string) => {
  return `/api/core/parametro/detail?id=${id}`;
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
  return `api/core/produccion/agregado`;
};
//http://localhost:7006/api/core/produccion/agregado


export const getByIdAgregadoKey = (id: string ) => {
  return `api/core/produccion/agregado/detail?id=${id}`;
};
