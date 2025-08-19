import { BaseResponse } from "@/interface";
import {
  IParametroResponse,
  IParametroSend,
  IParametroUpdate,
  PagedParametroResponse,
  ParametroFiltersParams,
} from "@/interface/admin/parametro";
import { api } from "@/lib/api";
import { getAllParametroKey } from "@/lib/constants/key-fetch";

export class ParametrosService {
  static async listar(
    page: number = 1,
    size: number = 10,
    filters?: ParametroFiltersParams
  ): Promise<BaseResponse<PagedParametroResponse>> {
    let url = `${getAllParametroKey()}?page=${page}&size=${size}`;

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
    const response = await api.get<BaseResponse<PagedParametroResponse>>(url);
    return response.data;
  }

  static async obtenerPorId(url: string): Promise<BaseResponse<IParametroResponse>> {
    const response = await api.get<BaseResponse<IParametroResponse>>(url);
    return response.data;
  }

  static async crear(data: IParametroSend): Promise<BaseResponse<IParametroResponse>> {
    const response = await api.post<BaseResponse<IParametroResponse>>(getAllParametroKey(), data);
    return response.data;
  }

  static async actualizar(data: IParametroUpdate): Promise<BaseResponse<IParametroResponse>> {
    const response = await api.put<BaseResponse<IParametroResponse>>(getAllParametroKey(), data);
    return response.data;
  }

  static async eliminar(id: string, eliminadoPorId: string): Promise<BaseResponse<void>> {
    const response = await api.delete<BaseResponse<void>>(
      `${getAllParametroKey()}?id=${encodeURIComponent(id)}&eliminadoPorId=${encodeURIComponent(eliminadoPorId)}`
    );
    return response.data;
  }
}
