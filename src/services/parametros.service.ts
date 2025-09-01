import { BaseResponse } from "@/interface";
import { 
  IParametroResponse, 
  IParametroRequest, 
  IParametroUpdate, 
  ParametroPagedItemsResponse, 
  ParametroFiltersParams
} from "@/interface/admin/parametro";
import { api } from "@/lib/api";
import { getAllParametroKey, getByIdParametroKey, deleteParametroKey } from "@/lib/constants/key-fetch";

export class ParametrosService {
  static async listar(
    page: number = 1,
    size: number = 10,
    filters?: ParametroFiltersParams
  ): Promise<BaseResponse<ParametroPagedItemsResponse>> {
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
  const response = await api.get<BaseResponse<ParametroPagedItemsResponse>>(url);
    return response.data;
  }

  static async obtenerPorId(url: string): Promise<BaseResponse<IParametroResponse>> {
    const response = await api.get<BaseResponse<IParametroResponse>>(url);
    return response.data;
  }

  static async crear(data: IParametroRequest): Promise<BaseResponse<IParametroResponse>> {
    const response = await api.post<BaseResponse<IParametroResponse>>(getAllParametroKey(), data);
    return response.data;
  }

  static async actualizar(data: IParametroUpdate): Promise<BaseResponse<IParametroResponse>> {
    const response = await api.put<BaseResponse<IParametroResponse>>(getByIdParametroKey(data.id), data);
    return response.data;
  }

  static async eliminar(id: string): Promise<BaseResponse<void>> {
    const response = await api.delete<BaseResponse<void>>(`${deleteParametroKey()}/${encodeURIComponent(id)}`);
    return response.data;
  }
}
