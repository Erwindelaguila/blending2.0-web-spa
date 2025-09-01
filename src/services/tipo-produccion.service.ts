import { BaseResponse } from "@/interface";
import { ITipoProduccionResponse, ITipoProduccionRequest, ITipoProduccionUpdate, PagedTipoProduccionResponse } from "@/interface/admin/tipo-produccion";
import { api } from "@/lib/api";
import { getAllTipoProduccionKey, getByIdTipoProduccionKey, deleteTipoProduccionKey } from "@/lib/constants/key-fetch";

export class TipoProduccionService {
  static async listar(
    page: number = 1,
    size: number = 10,
    filters?: { codigo?: string; estado?: number; fechaDesde?: string }
  ): Promise<BaseResponse<PagedTipoProduccionResponse>> {
    let url = `${getAllTipoProduccionKey()}?page=${page}&size=${size}`;
    if (filters) {
      if (filters.codigo) url += `&codigo=${encodeURIComponent(filters.codigo)}`;
      if (filters.estado !== undefined) url += `&estado=${filters.estado}`;
      if (filters.fechaDesde) url += `&fechaDesde=${encodeURIComponent(filters.fechaDesde)}`;
    }
    const response = await api.get<BaseResponse<PagedTipoProduccionResponse>>(url);
    return response.data;
  }

  static async obtenerPorId(url: string): Promise<BaseResponse<ITipoProduccionResponse>> {
    const response = await api.get<BaseResponse<ITipoProduccionResponse>>(url);
    return response.data;
  }

  static async crear(data: ITipoProduccionRequest) {
    const response = await api.post<BaseResponse<ITipoProduccionResponse>>(getAllTipoProduccionKey(), data);
    return response.data;
  }

  static async actualizar(data: ITipoProduccionUpdate) {
    const response = await api.put<BaseResponse<ITipoProduccionResponse>>(getByIdTipoProduccionKey(data.id), data);
    return response.data;
  }

  // Obtener solo activos para combos (sin paginación)
  static async obtenerActivos(): Promise<BaseResponse<{ id: string; codigo: string }[]>> {
    const url = `${getAllTipoProduccionKey()}?activo=true`;
    const response = await api.get<BaseResponse<{ id: string; codigo: string }[]>>(url);
    return response.data;
  }

  static async eliminar(id: string) {
    const response = await api.delete<BaseResponse<void>>(`${deleteTipoProduccionKey()}/${encodeURIComponent(id)}`);
    return response.data;
  }
}
