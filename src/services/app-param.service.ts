import { BaseResponse } from "@/interface";
import { IAppParam, IAppParamCreateRequest, IAppParamUpdateRequest, IAppParamFilters, AppParamPagedItemsResponse } from "@/interface/admin/app-param";
import { api } from "@/lib/api";
import { getAllAppParamKey, getByIdAppParamKey } from "@/lib/constants/key-fetch";

export class AppParamService {
  static async listar(page: number = 1, size: number = 10, filters?: IAppParamFilters): Promise<BaseResponse<AppParamPagedItemsResponse>> {
    let url = `${getAllAppParamKey()}?page=${page}&size=${size}`;

    if (filters) {
      if (filters.key) {
        url += `&key=${encodeURIComponent(filters.key)}`;
      }
      if (filters.isActive !== undefined) {
        url += `&isActive=${filters.isActive}`;
      }
      if (filters.fecha) {
        url += `&fecha=${encodeURIComponent(filters.fecha)}`;
      }
    }
    
    const response = await api.get<BaseResponse<AppParamPagedItemsResponse>>(url);
    return response.data;
  }

  static async obtenerPorKey(key: string): Promise<BaseResponse<IAppParam>> {
    const response = await api.get<BaseResponse<IAppParam>>(getByIdAppParamKey(key));
    return response.data;
  }

  static async crear(data: IAppParamCreateRequest): Promise<BaseResponse<IAppParam>> {
    const response = await api.post<BaseResponse<IAppParam>>(
      getAllAppParamKey(),
      data
    );
    return response.data;
  }

  static async actualizar(key: string, data: IAppParamUpdateRequest): Promise<BaseResponse<IAppParam>> {
    const response = await api.put<BaseResponse<IAppParam>>(
      getByIdAppParamKey(key),
      data
    );
    return response.data;
  }

  static async eliminar(key: string): Promise<BaseResponse<{ success: boolean; message: string }>> {
    const response = await api.delete<BaseResponse<{ success: boolean; message: string }>>(
      `${getAllAppParamKey()}/${encodeURIComponent(key)}`
    );
    return response.data;
  }
}
