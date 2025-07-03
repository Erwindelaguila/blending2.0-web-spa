import { api } from "@/lib/api";

export const CalidadFechApi = async (url: string) => {
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Error al realizar la solicitud:", error);
    throw error;
  }
};
