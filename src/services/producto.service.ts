import { BaseResponse } from "@/interface";
import { IProductoResponse, IProductoRequest, IProductoUpdate, PagedProductoResponse, ProductoFiltersParams, PagedProductoBackendResponse } from "@/interface/admin/producto";
import { api } from "@/lib/api";
import { withCreateAudit, withUpdateAudit } from "./audit.util";
import { getAllProductoKey } from "@/lib/constants/key-fetch";

export class ProductoService {
  static async listar(page: number = 1, size: number = 10, filters?: ProductoFiltersParams): Promise<BaseResponse<PagedProductoResponse>> {
    let url = `${getAllProductoKey()}?page=${page}&size=${size}`;

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
  const response = await api.get<BaseResponse<PagedProductoResponse>>(url);
  return response.data;
  }

  static async listarBackendPascal(
    page: number = 1,
    size: number = 10,
    filters?: ProductoFiltersParams
  ): Promise<PagedProductoBackendResponse> {
    let url = `${getAllProductoKey()}?page=${page}&size=${size}`;
    if (filters) {
      if (filters.codigo) url += `&codigo=${encodeURIComponent(filters.codigo)}`;
      if (filters.estado !== undefined) url += `&estado=${filters.estado}`;
      if (filters.fechaDesde) url += `&fechaDesde=${encodeURIComponent(filters.fechaDesde)}`;
    }
  const response = await api.get<PagedProductoBackendResponse>(url);
  return response.data;
  }

  static async obtenerPorId(url: string): Promise<BaseResponse<IProductoResponse>> {
    const response = await api.get<BaseResponse<IProductoResponse>>(url);
    return response.data;
  }

  static async crear(data: IProductoRequest): Promise<BaseResponse<IProductoResponse>> {
    const response = await api.post<BaseResponse<IProductoResponse>>(
      getAllProductoKey(),
      withCreateAudit(data as any)
    );
    return response.data;
  }

  static async actualizar(data: IProductoUpdate): Promise<BaseResponse<IProductoResponse>> {
    const response = await api.put<BaseResponse<IProductoResponse>>(
      getAllProductoKey(),
      withUpdateAudit(data as any)
    );
    return response.data;
  }

  static async eliminar(id: string, eliminadoPorId: string): Promise<BaseResponse<void>> {
    const response = await api.delete<BaseResponse<void>>(`${getAllProductoKey()}?id=${encodeURIComponent(id)}&eliminadoPorId=${encodeURIComponent(eliminadoPorId)}`);
    return response.data;
  }
}
