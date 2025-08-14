import { BaseResponse } from "@/interface";
import { ITipoProduccionResponse, ITipoProduccionSend, ITipoProduccionUpdate, PagedTipoProduccionResponse } from "@/interface/admin/tipo-produccion";
import { api } from "@/lib/api";
import { getAllTipoProduccionKey } from "@/lib/constants/key-fetch";

export class TipoProduccionService {
  static async listar(page: number = 1, size: number = 10): Promise<BaseResponse<PagedTipoProduccionResponse>> {
    const url = `${getAllTipoProduccionKey()}?page=${page}&size=${size}`;
    const response = await api.get<BaseResponse<any>>(url);
    const raw = response.data;
    if (Array.isArray(raw.data)) {
      const items: ITipoProduccionResponse[] = raw.data;
      return { ...raw, data: { items, total: items.length, page, size, totalPages: 1 } } as BaseResponse<PagedTipoProduccionResponse>;
    }
    return raw as BaseResponse<PagedTipoProduccionResponse>;
  }

  static async obtenerPorId(url: any) {
    const response = await api.get<BaseResponse<ITipoProduccionResponse>>(url);
    return response.data;
  }

  static async crear(data: ITipoProduccionSend) {
    const response = await api.post<BaseResponse<ITipoProduccionResponse>>(getAllTipoProduccionKey(), data);
    return response.data;
  }

  static async actualizar(data: ITipoProduccionUpdate) {
    const response = await api.put<BaseResponse<ITipoProduccionResponse>>(getAllTipoProduccionKey(), data);
    return response.data;
  }

  static async eliminar(id: string, eliminadoPorId: string) {
    const response = await api.delete<BaseResponse<void>>(`${getAllTipoProduccionKey()}?id=${id}&eliminadoPorId=${eliminadoPorId}`);
    return response.data;
  }
}
