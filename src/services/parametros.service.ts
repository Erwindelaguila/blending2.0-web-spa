import { BaseResponse } from "@/interface";
import { IParametro, IParametroSend, IParametroUpdate, PagedParametroResponse } from "@/interface/admin/parametro";
import { api } from "@/lib/api";
import { getAllParametroKey } from "@/lib/constants/key-fetch";

export class ParametrosService {

  static async listar(page: number = 1, size: number = 10): Promise<BaseResponse<PagedParametroResponse>> {
    const url = `${getAllParametroKey}?page=${page}&size=${size}`;
    const response = await api.get<BaseResponse<PagedParametroResponse>>(url);
    return response.data; 
  }

  static async obtenerPorId(url: any): Promise<BaseResponse<IParametro>> {
    const response = await api.get<BaseResponse<IParametro>>(url);
    return response.data; 
  }

  static async crear(
      data: IParametroSend
    ): Promise<BaseResponse<IParametro>> {
      const response = await api.post<BaseResponse<IParametro>>(
        getAllParametroKey,
        data
      );
      return response.data;
    }

    static async actualizar(
      data: IParametroUpdate
    ): Promise<BaseResponse<IParametro>> {
      const response = await api.put<BaseResponse<IParametro>>(
        getAllParametroKey,
        data
      );
      return response.data;
    }

    static async eliminar(id: string, eliminadoPorId: string): Promise<BaseResponse<void>> {
      const response = await api.delete<BaseResponse<void>>(`${getAllParametroKey}?id=${id}&eliminadoPorId=${eliminadoPorId}`);
      return response.data;
    }

}
