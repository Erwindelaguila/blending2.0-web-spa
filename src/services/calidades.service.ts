import { BaseResponse, ICalidadRequest, ICalidadResponse } from "@/interface";
import api from "@/lib/api/client";
import {
  fetchGetCalidadesId,
  getAllCalidadKey,
} from "@/lib/constants/key-fetch";

// ============================================
// SERVICIO DE CALIDADES
// ============================================

export class CalidadesService {
  static async get(url: string) {
    try {
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      throw error;
    }
  }

  static async crear(
    data: ICalidadRequest
  ): Promise<BaseResponse<ICalidadResponse>> {
    const response = await api.post<BaseResponse<ICalidadResponse>>(
      getAllCalidadKey(),
      data
    );
    return response.data;
  }

  static async eliminar(id: any): Promise<void> {
    await api.delete(fetchGetCalidadesId(id));
  }

  static async editar(
    id: string,
    data: ICalidadRequest
  ): Promise<BaseResponse<ICalidadResponse>> {
    const response = await api.put<BaseResponse<ICalidadResponse>>(
      `/api/calidades/${id}`,
      data
    );
    return response.data;
  }

  static async listar(): Promise<ICalidadResponse[]> {
    const response = await api.get<ICalidadResponse[]>("/api/calidades");
    return response.data;
  }

  static async obtenerPorId(id: number): Promise<ICalidadResponse> {
    const response = await api.get<ICalidadResponse>(`/api/calidades/${id}`);
    return response.data;
  }
}
