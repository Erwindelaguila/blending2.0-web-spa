import { BaseResponse } from "@/interface";
import { IPlantaResponse, IPlantaRequest, IPlantaUpdate, PagedPlantaResponse, PlantaFiltersParams } from "@/interface/admin/planta";
import { api } from "@/lib/api";
import { withCreateAudit, withUpdateAudit } from "./audit.util";
import { getAllPlantaKey } from "@/lib/constants/key-fetch";

export class PlantasService {
  static async listar<TResponse>(
    page: number = 1,
    size: number = 10,
    filters?: PlantaFiltersParams
  ): Promise<BaseResponse<TResponse>> {
    let url = `${getAllPlantaKey()}?page=${page}&size=${size}`;

    if (filters) {
      if (filters.codigo) {
        url += `&codigo=${encodeURIComponent(filters.codigo)}`;
      }
      if (filters.estado !== undefined) {
        url += `&estado=${filters.estado}`;
      }
      if (filters.isHarina) {
        url += `&isHarina=${encodeURIComponent(filters.isHarina)}`;
      } 
      if (filters.fechaDesde) {
        url += `&fechaDesde=${encodeURIComponent(filters.fechaDesde)}`;
      }
    }

    const response = await api.get<BaseResponse<TResponse>>(url);
    return response.data;
  }

  static async obtenerPorId(url: string): Promise<BaseResponse<IPlantaResponse>> {
    const response = await api.get<BaseResponse<IPlantaResponse>>(url);
    return response.data;
  }

  static async crear(
    data: IPlantaRequest
  ): Promise<BaseResponse<IPlantaResponse>> {
    const response = await api.post<BaseResponse<IPlantaResponse>>(
      getAllPlantaKey(),
  withCreateAudit(data as any)
    );
    return response.data;
  }

  static async actualizar(
    data: IPlantaUpdate
  ): Promise<BaseResponse<IPlantaResponse>> {
    const response = await api.put<BaseResponse<IPlantaResponse>>(
      getAllPlantaKey(),
  withUpdateAudit(data as any)
    );
    return response.data;
  }

  static async eliminar(id: string, eliminadoPorId: string): Promise<BaseResponse<void>> {
    const response = await api.delete<BaseResponse<void>>(
      `${getAllPlantaKey()}?id=${encodeURIComponent(id)}&eliminadoPorId=${encodeURIComponent(eliminadoPorId)}`
    );
    return response.data;
  }
}
