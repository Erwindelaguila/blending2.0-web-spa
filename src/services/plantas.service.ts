import api from "@/lib/api/client";
import { BaseResponse } from "@/interface";

export interface IPlantaRequest {
  codigo: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

export interface IPlantaResponse {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
  fechaCreacion: string;
}

export class PlantasService {
  static async get(url: string) {
    try {
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      throw error;
    }
  }

  static async crear(data: IPlantaRequest): Promise<BaseResponse<IPlantaResponse>> {
    const response = await api.post<BaseResponse<IPlantaResponse>>(
      "/api/plantas", 
      data
    );
    return response.data;
  }

  static async editar(id: string, data: IPlantaRequest): Promise<BaseResponse<IPlantaResponse>> {
    const response = await api.put<BaseResponse<IPlantaResponse>>(
      `/api/plantas/${id}`,
      data
    );
    return response.data;
  }

  static async eliminar(id: number): Promise<void> {
    await api.delete(`/api/plantas/${id}`);
  }

  static async listar(): Promise<IPlantaResponse[]> {
    const response = await api.get<IPlantaResponse[]>("/api/plantas");
    return response.data;
  }

  static async obtenerPorId(id: number): Promise<IPlantaResponse> {
    const response = await api.get<IPlantaResponse>(`/api/plantas/${id}`);
    return response.data;
  }
}
