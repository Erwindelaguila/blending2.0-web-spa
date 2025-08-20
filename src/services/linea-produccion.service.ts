import { BaseResponse } from "@/interface";
import { ILineaProduccionResponse, ILineaProduccionRequest, ILineaProduccionUpdate, PagedLineaProduccionResponse, LineaProduccionFiltersParams } from "@/interface/admin/linea-produccion";
import { api } from "@/lib/api";
import { withCreateAudit, withUpdateAudit } from "./audit.util";
import { getAllLineaProduccionKey } from "@/lib/constants/key-fetch";

export class LineaProduccionService {
  static async listar(page: number = 1, size: number = 10, filters?: LineaProduccionFiltersParams): Promise<BaseResponse<PagedLineaProduccionResponse>> {
    let url = `${getAllLineaProduccionKey()}?page=${page}&size=${size}`;

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
    const response = await api.get<BaseResponse<PagedLineaProduccionResponse>>(url);
    return response.data;
  }

  static async obtenerPorId(url: string): Promise<BaseResponse<ILineaProduccionResponse>> {
    const response = await api.get<BaseResponse<ILineaProduccionResponse>>(url);
    return response.data;
  }

  static async crear(
      data: ILineaProduccionRequest
    ): Promise<BaseResponse<ILineaProduccionResponse>> {
      const response = await api.post<BaseResponse<ILineaProduccionResponse>>(
        getAllLineaProduccionKey(),
  withCreateAudit(data as any)
      );
      return response.data;
    }

    static async actualizar(
      data: ILineaProduccionUpdate
    ): Promise<BaseResponse<ILineaProduccionResponse>> {
      const response = await api.put<BaseResponse<ILineaProduccionResponse>>(
        getAllLineaProduccionKey(),
  withUpdateAudit(data as any)
      );
      return response.data;
    }

    static async eliminar(id: string, eliminadoPorId: string): Promise<BaseResponse<void>> {
      const response = await api.delete<BaseResponse<void>>(`${getAllLineaProduccionKey()}?id=${encodeURIComponent(id)}&eliminadoPorId=${encodeURIComponent(eliminadoPorId)}`);
      return response.data;
    }
}
