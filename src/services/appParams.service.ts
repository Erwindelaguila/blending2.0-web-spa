import { api } from "@/lib/api";

export class AppParamsService {
  static async getAppParams(url: any) {
    try {
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      throw error;
    }
  }
}
