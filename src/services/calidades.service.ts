import { BaseResponse } from "@/interface";
import { ICalidadResponse, ICalidadRequest, ICalidadUpdate, CalidadFiltersParams, PagedCalidadResponse } from "@/interface/admin/calidad";
import { api } from "@/lib/api";
import { getAllCalidadKey, getByIdCalidadKey, deleteCalidadKey } from "@/lib/constants/key-fetch";

export class CalidadesService {
  static async listar(page: number = 1, size: number = 10, filters?: CalidadFiltersParams): Promise<BaseResponse<PagedCalidadResponse>> {
    let url = `${getAllCalidadKey()}?page=${page}&size=${size}`;

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

    const response = await api.get<BaseResponse<PagedCalidadResponse>>(url);
    return response.data;
  }

  // Método específico para combos - solo activos
  static async obtenerActivos(): Promise<BaseResponse<{ id: string; codigo: string }[]>> {
    const url = `${getAllCalidadKey()}?activo=true`;
    const response = await api.get<BaseResponse<{ id: string; codigo: string }[]>>(url);
    return response.data;
  }

  static async obtenerPorId(url: string): Promise<BaseResponse<ICalidadResponse>> {
    const response = await api.get<BaseResponse<ICalidadResponse>>(url);
    return response.data;
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

    static async actualizar(
    data: ICalidadUpdate
  ): Promise<BaseResponse<ICalidadResponse>> {
    const response = await api.put<BaseResponse<ICalidadResponse>>(
      getByIdCalidadKey(data.id),
      data
    );
    return response.data;
  }

  static async eliminar(id: string): Promise<BaseResponse<void>> {
    const response = await api.delete<BaseResponse<void>>(
      `${deleteCalidadKey()}/${encodeURIComponent(id)}`
    );
    return response.data;
  }
}
