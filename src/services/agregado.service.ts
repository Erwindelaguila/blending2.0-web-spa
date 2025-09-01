import { BaseResponse } from "@/interface";
import {
  IAgregado,
  IAgregadoRequest,
  IAgregadoUpdate,
  PagedAgregadoResponse,
  AgregadoFiltersParams,
} from "@/interface/admin/agregado";
import { api } from "@/lib/api";
import { getAllAgregadoKey, getByIdAgregadoKey, deleteAgregadoKey } from "@/lib/constants/key-fetch";

export class AgregadoService {
  static async listar(
    page: number = 1,
    size: number = 10,
    filters?: AgregadoFiltersParams
  ): Promise<BaseResponse<PagedAgregadoResponse>> {
    let url = `${getAllAgregadoKey()}?page=${page}&size=${size}`;

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
    const response = await api.get<BaseResponse<PagedAgregadoResponse>>(url);
    return response.data;
  }

  static async obtenerActivos(): Promise<BaseResponse<{ id: string; codigo: string }[]>> {
    const url = `${getAllAgregadoKey()}?activo=true`;
    const response = await api.get<BaseResponse<{ id: string; codigo: string }[]>>(url);
    return response.data;
  }

  static async obtenerPorId(url: string): Promise<BaseResponse<IAgregado>> {
    const response = await api.get<BaseResponse<IAgregado>>(url);
    return response.data;
  }

  static async crear(
      data: IAgregadoRequest
    ): Promise<BaseResponse<IAgregado>> {
      const response = await api.post<BaseResponse<IAgregado>>(
        getAllAgregadoKey(),
        data
      );
      return response.data;
    }

    static async actualizar(
      data: IAgregadoUpdate
    ): Promise<BaseResponse<IAgregado>> {
      const response = await api.put<BaseResponse<IAgregado>>(
        getByIdAgregadoKey(data.id),
        data
      );
      return response.data;
    }

    static async eliminar(id: string): Promise<BaseResponse<void>> {
      const response = await api.delete<BaseResponse<void>>(`${deleteAgregadoKey()}/${encodeURIComponent(id)}`);
      return response.data;
    }

}
