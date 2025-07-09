import api from "@/lib/api/client";
import { BaseResponse } from "@/interface";

export interface IParametroRequest {
  codigo: string; 
  nombre: string;
  descripcion: string;
  activo: boolean;
}

export interface IParametroResponse {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
  fechaCreacion: string;
}

export class ParametrosService {
  static async get(url: string) {
    try {
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      throw error;
    }
  }

  static async crear(data: IParametroRequest): Promise<BaseResponse<IParametroResponse>> {
    const response = await api.post<BaseResponse<IParametroResponse>>(
      "/api/parametros", 
      data
    );
    return response.data;
  }

  static async editar(id: string, data: IParametroRequest): Promise<BaseResponse<IParametroResponse>> {
    const response = await api.put<BaseResponse<IParametroResponse>>(
      `/api/parametros/${id}`,
      data
    );
    return response.data;
  }

  static async eliminar(id: number): Promise<void> {
    await api.delete(`/api/parametros/${id}`);
  }

  static async listar(): Promise<IParametroResponse[]> {
    const response = await api.get<IParametroResponse[]>("/api/parametros");
    return response.data;
  }

  static async obtenerPorId(id: number): Promise<IParametroResponse> {
    const response = await api.get<IParametroResponse>(`/api/parametros/${id}`);
    return response.data;
  }
}
