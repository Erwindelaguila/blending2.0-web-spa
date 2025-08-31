import { BaseResponse } from "@/interface";
import { ILineaProduccionResponse, ILineaProduccionRequest, ILineaProduccionUpdate, PagedLineaProduccionResponse, LineaProduccionFiltersParams } from "@/interface/admin/linea-produccion";
import { api } from "@/lib/api";
import { getAllLineaProduccionKey, getByIdLineaProduccionKey, deleteLineaProduccionKey } from "@/lib/constants/key-fetch";

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

  // Método específico para combos - solo activos
  static async obtenerActivos(): Promise<BaseResponse<{ id: string; codigo: string }[]>> {
    const url = `${getAllLineaProduccionKey()}?activo=true`;
    const response = await api.get<BaseResponse<{ id: string; codigo: string }[]>>(url);
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
        data
      );
      return response.data;
    }

    static async actualizar(
      data: ILineaProduccionUpdate
    ): Promise<BaseResponse<ILineaProduccionResponse>> {
      // Usar endpoint de detalle con id (consistente con agregado)
      const response = await api.put<BaseResponse<ILineaProduccionResponse>>(
        getByIdLineaProduccionKey(data.id),
        data
      );
      return response.data;
    }

    static async eliminar(id: string): Promise<BaseResponse<void>> {
      const response = await api.delete<BaseResponse<void>>(`${deleteLineaProduccionKey()}/${encodeURIComponent(id)}`);
      return response.data;
    }
}
