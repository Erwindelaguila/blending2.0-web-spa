import { BaseResponse } from "@/interface";
import { ICalidadResponse, ICalidadRequest, ICalidadUpdate, PagedCalidadResponse, CalidadFiltersParams } from "@/interface/admin/calidad";
import { api } from "@/lib/api";
import { withCreateAudit, withUpdateAudit } from "./audit.util";
import { getAllCalidadKey, fetchGetCalidadesId } from "@/lib/constants/key-fetch";

export class CalidadesService {
  static async listar(page: number = 1, size: number = 10, filters?: CalidadFiltersParams): Promise<BaseResponse<PagedCalidadResponse>> {
    let url = `${getAllCalidadKey()}?page=${page}&size=${size}`;

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

    const response = await api.get<BaseResponse<PagedCalidadResponse>>(url);
    return response.data;
  }

  static async obtenerPorId(url: string): Promise<BaseResponse<ICalidadResponse>> {
    const response = await api.get<BaseResponse<ICalidadResponse>>(url);
    return response.data;
  }

  static async crear(
      data: ICalidadRequest
    ): Promise<BaseResponse<ICalidadResponse>> {
      const payload = { ...data, noConforme: !data.conforme };
      const { conforme, ...rest } = payload;
      const response = await api.post<BaseResponse<ICalidadResponse>>(
        getAllCalidadKey(),
        withCreateAudit(rest as any)
      );
      return response.data;
    }

  static async actualizar(
      data: ICalidadUpdate
    ): Promise<BaseResponse<ICalidadResponse>> {
      const payload = { ...data, noConforme: !data.conforme };
      const { conforme, ...rest } = payload;
      const response = await api.put<BaseResponse<ICalidadResponse>>(
        getAllCalidadKey(),
        withUpdateAudit(rest as any)
      );
      return response.data;
    }

  static async eliminar(id: string, eliminadoPorId: string): Promise<BaseResponse<void>> {
    const url = `${getAllCalidadKey()}?id=${encodeURIComponent(id)}&eliminadoPorId=${encodeURIComponent(eliminadoPorId)}`;
    const response = await api.delete<BaseResponse<void>>(url);
    return response.data;
  }
}
