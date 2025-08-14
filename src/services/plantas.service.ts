import api from "@/lib/api/client";
import { BaseResponse } from "@/interface";
import { IPlantaRequest, IPlantaResponse, IPlantaGet, IPlantaSend, IPlantaUpdate, PagedPlantaResponse } from "@/interface/admin/planta";
import { getAllPlantaKey } from "@/lib/constants/key-fetch";

export class PlantasService {
  static async listar(page: number = 1, size: number = 10): Promise<BaseResponse<PagedPlantaResponse>> {
    const url = `${getAllPlantaKey()}?page=${page}&size=${size}`;
    const response = await api.get<BaseResponse<any>>(url);
    const raw = response.data;
    if (Array.isArray(raw.data)) {
      const items: IPlantaResponse[] = raw.data;
      return {
        ...raw,
        data: {
          items,
          total: items.length,
          page,
            size,
          totalPages: 1,
        },
      } as BaseResponse<PagedPlantaResponse>;
    }
    return raw as BaseResponse<PagedPlantaResponse>;
  }

  static async obtenerPorId(url: any): Promise<BaseResponse<IPlantaResponse>> {
    const response = await api.get<BaseResponse<IPlantaResponse>>(url);
    return response.data;
  }

  static async crear(data: IPlantaSend): Promise<BaseResponse<IPlantaResponse>> {
    const response = await api.post<BaseResponse<IPlantaResponse>>(getAllPlantaKey(), data);
    return response.data;
  }

  static async actualizar(data: IPlantaUpdate): Promise<BaseResponse<IPlantaResponse>> {
    const response = await api.put<BaseResponse<IPlantaResponse>>(getAllPlantaKey(), data);
    return response.data;
  }

  static async eliminar(id: string, eliminadoPorId: string): Promise<BaseResponse<void>> {
    const response = await api.delete<BaseResponse<void>>(`${getAllPlantaKey()}?id=${id}&eliminadoPorId=${eliminadoPorId}`);
    return response.data;
  }
}
