import { BaseResponse } from "@/interface";
import { ITipoProduccionResponse, ITipoProduccionRequest, ITipoProduccionUpdate, PagedTipoProduccionResponse } from "@/interface/admin/tipo-produccion";
import { api } from "@/lib/api";
import { getAllTipoProduccionKey } from "@/lib/constants/key-fetch";
import { withCreateAudit, withUpdateAudit } from "./audit.util";

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
  const payload: any = withCreateAudit(data as any);
  // Evitar enviar campos de auditoría en camelCase que puedan venir nulos por accidente
  delete payload.creadoPorId;
  delete payload.modificadoPorId;
  const response = await api.post<BaseResponse<ITipoProduccionResponse>>(getAllTipoProduccionKey(), payload);
    return response.data;
  }

  static async actualizar(data: ITipoProduccionUpdate) {
  const payload: any = withUpdateAudit(data as any);
  // Evitar enviar campos de auditoría en camelCase que puedan estar null y rompan el binder del backend
  delete payload.creadoPorId;
  delete payload.modificadoPorId;
  const response = await api.put<BaseResponse<ITipoProduccionResponse>>(getAllTipoProduccionKey(), payload);
    return response.data;
  }

  static async eliminar(id: string, eliminadoPorId: string) {
    const response = await api.delete<BaseResponse<void>>(`${getAllTipoProduccionKey()}?id=${id}&eliminadoPorId=${eliminadoPorId}`);
    return response.data;
  }
}
