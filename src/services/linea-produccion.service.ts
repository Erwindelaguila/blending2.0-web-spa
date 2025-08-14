import { BaseResponse } from "@/interface";
import { ILineaProduccion, ILineaProduccionSend, ILineaProduccionUpdate, PagedLineaProduccionResponse } from "@/interface/admin/linea-produccion";
import { api } from "@/lib/api";
import { getAllLineaProduccionKey } from "@/lib/constants/key-fetch";

export class LineaProduccionService {
  static async listar(page: number = 1, size: number = 10): Promise<BaseResponse<PagedLineaProduccionResponse>> {
    const url = `${getAllLineaProduccionKey()}?page=${page}&size=${size}`;
    const response = await api.get<BaseResponse<PagedLineaProduccionResponse>>(url);
    return response.data;
  }

  static async obtenerPorId(url: any): Promise<BaseResponse<ILineaProduccion>> {
    const response = await api.get<BaseResponse<ILineaProduccion>>(url);
    return response.data;
  }

  static async crear(data: ILineaProduccionSend): Promise<BaseResponse<ILineaProduccion>> {
    const response = await api.post<BaseResponse<ILineaProduccion>>(getAllLineaProduccionKey(), data);
    return response.data;
  }

  static async actualizar(data: ILineaProduccionUpdate): Promise<BaseResponse<ILineaProduccion>> {
    const response = await api.put<BaseResponse<ILineaProduccion>>(getAllLineaProduccionKey(), data);
    return response.data;
  }

  static async eliminar(id: string, eliminadoPorId: string): Promise<BaseResponse<void>> {
    const response = await api.delete<BaseResponse<void>>(`${getAllLineaProduccionKey()}?id=${id}&eliminadoPorId=${eliminadoPorId}`);
    return response.data;
  }
}
