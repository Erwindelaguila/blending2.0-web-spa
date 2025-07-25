import api from "@/lib/api/client";
import { BaseResponse } from "@/interface";
import { IPlantaRequest, IPlantaResponse, IPlantaGet } from "@/interface/admin/planta";

export class PlantasService {
  static async crear(data: IPlantaRequest, creadoPorId: string): Promise<BaseResponse<IPlantaResponse>> {
    const response = await api.post<BaseResponse<IPlantaResponse>>(
      "/api/core/planta", 
      { ...data, creadoPorId }
    );
    return response.data;
  }

  static async editar(id: string, data: IPlantaRequest, modificadoPorId: string): Promise<BaseResponse<IPlantaResponse>> {
    const response = await api.put<BaseResponse<IPlantaResponse>>(
      "/api/core/planta",
      { id, ...data, modificadoPorId }
    );
    return response.data;
  }

  static async eliminar(id: string, modificadoPorId: string): Promise<void> {
    await api.delete(`/api/core/planta?id=${id}&modificadoPorId=${modificadoPorId}`);
  }

  static async listar(url:any): Promise<IPlantaGet[]> {
    const response = await api.get<BaseResponse<IPlantaGet[]>>(url);
    return response.data.data || [];
  }

  static async obtenerPorId(id: string): Promise<IPlantaGet> {
    const response = await api.get<BaseResponse<IPlantaGet>>(`/api/core/planta/detail?id=${id}`);
    if (!response.data.data) {
      throw new Error("No se encontraron datos de la planta");
    }
    return response.data.data;
  }
}
