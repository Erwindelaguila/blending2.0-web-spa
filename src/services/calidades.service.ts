import { BaseResponse } from "@/interface";
import { ICalidadResponse, ICalidadSend, ICalidadUpdate, PagedCalidadResponse } from "@/interface/admin/calidad";
import { api } from "@/lib/api";
import { getAllCalidadKey, fetchGetCalidadesId } from "@/lib/constants/key-fetch";

// ============================================
// SERVICIO DE CALIDADES
// ============================================
export class CalidadesService {
  static async listar(page: number = 1, size: number = 10): Promise<BaseResponse<PagedCalidadResponse>> {
    const url = `${getAllCalidadKey()}?page=${page}&size=${size}`;
    const response = await api.get<BaseResponse<any>>(url);
    const raw = response.data;
    if (Array.isArray(raw.data)) {
      const items: ICalidadResponse[] = raw.data;
      return {
        ...raw,
        data: { items, total: items.length, page, size, totalPages: 1 },
      } as BaseResponse<PagedCalidadResponse>;
    }
    return raw as BaseResponse<PagedCalidadResponse>;
  }

  static async obtenerPorId(url: any) { // url ya viene construido por SWR
    const response = await api.get<BaseResponse<ICalidadResponse>>(url);
    return response.data;
  }

  static async crear(data: ICalidadSend) {
    const response = await api.post<BaseResponse<ICalidadResponse>>(getAllCalidadKey(), data);
    return response.data;
  }

  static async actualizar(data: ICalidadUpdate) {
    const response = await api.put<BaseResponse<ICalidadResponse>>(getAllCalidadKey(), data);
    return response.data;
  }

  static async eliminar(id: string, eliminadoPorId: string) {
    const response = await api.delete<BaseResponse<void>>(`${getAllCalidadKey()}?id=${id}&eliminadoPorId=${eliminadoPorId}`);
    return response.data;
  }
}
