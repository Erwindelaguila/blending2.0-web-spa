import { BaseResponse } from "@/interface";
import { IAgregado, IAgregadoSend, IAgregadoUpdate, PagedAgregadoResponse } from "@/interface/admin/agregado";
import { api } from "@/lib/api";
import { getAllAgregadoKey } from "@/lib/constants/key-fetch";

export class AgregadoService {
  static async listar(page: number = 1, size: number = 10): Promise<any> {
    const url = `${getAllAgregadoKey()}?page=${page}&size=${size}`;
    const response = await api.get<any>(url);
    
    // El backend devuelve directamente: { succeeded: true, data: { items: [...], currentPage: 4, totalPages: 4, ... } }
    const raw = response.data;
    
    if (raw?.data && Array.isArray(raw.data.items)) {
      const data = raw.data;
      return {
        succeeded: raw.succeeded,
        message: raw.message,
        errors: raw.errors,
        statusCode: raw.statusCode,
        data: {
          items: data.items,
          // campos legacy para compatibilidad
          page: data.currentPage,
          totalPages: data.totalPages,
          size: data.pageSize,
          total: data.totalCount,
          // metadatos nuevos directamente del backend
          meta: {
            currentPage: data.currentPage,
            totalPages: data.totalPages,
            pageSize: data.pageSize,
            totalCount: data.totalCount,
            hasPrevious: data.hasPrevious,
            hasNext: data.hasNext,
            previousPage: data.previousPage,
            nextPage: data.nextPage,
            pageNumbers: data.pageNumbers,
          },
        },
      };
    }
    
    return response.data; 
  }

  static async obtenerPorId(url: any): Promise<BaseResponse<IAgregado>> {
    const response = await api.get<BaseResponse<IAgregado>>(url);
    return response.data; 
  }

  static async crear(
      data: IAgregadoSend
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
        getAllAgregadoKey(),
        data
      );
      return response.data;
    }

    static async eliminar(id: string, eliminadoPorId: string): Promise<BaseResponse<void>> {
      const response = await api.delete<BaseResponse<void>>(`${getAllAgregadoKey()}?id=${id}&eliminadoPorId=${eliminadoPorId}`);
      return response.data;
    }

}
