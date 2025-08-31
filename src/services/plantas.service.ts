import { BaseResponse } from "@/interface";
import { IPlantaResponse, IPlantaRequest, IPlantaUpdate, PlantaPagedItemsResponse, PlantaFiltersParams } from "@/interface/admin/planta";
import { api } from "@/lib/api";
import { getAllPlantaKey, getByIdPlantaKey, createPlantaKey, deletePlantaKey } from "@/lib/constants/key-fetch";

export class PlantasService {
  static async listar(
    page: number = 1,
    size: number = 10,
    filters?: PlantaFiltersParams
  ): Promise<BaseResponse<PlantaPagedItemsResponse>> {
    let url = `${getAllPlantaKey()}?page=${page}&size=${size}`;

    if (filters) {
      if (filters.codigo) {
        url += `&codigo=${encodeURIComponent(filters.codigo)}`;
      }
      if (filters.estado !== undefined) {
        url += `&estado=${filters.estado}`;
      }
      if (filters.fechaDesde) {
        url += `&fechaDesde=${encodeURIComponent(filters.fechaDesde)}`;
      }
    }
  const response = await api.get<BaseResponse<PlantaPagedItemsResponse>>(url);
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
      createPlantaKey(),
      data
    );
    return response.data;
  }

  static async actualizar(
    data: IPlantaUpdate
  ): Promise<BaseResponse<IPlantaResponse>> {
    const response = await api.put<BaseResponse<IPlantaResponse>>(
      getByIdPlantaKey(data.id),
      data
    );
    return response.data;
  }

  static async eliminar(id: string): Promise<BaseResponse<void>> {
    const response = await api.delete<BaseResponse<void>>(
      `${deletePlantaKey()}/${encodeURIComponent(id)}`
    );
    return response.data;
  }
}
