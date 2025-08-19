import api from "@/lib/api/client";
import { BaseResponse } from "@/interface";
import { IPlantaRequest, IPlantaResponse, IPlantaGet, IPlantaSend, IPlantaUpdate, PagedPlantaResponse } from "@/interface/admin/planta";
import { getAllPlantaKey } from "@/lib/constants/key-fetch";

export interface PlantaFiltersParams {
  codigo?: string;
  estado?: number;
  fechaInicio?: string;
  fechaFin?: string;
  tipoFecha?: string; // 'creados' | 'modificados'
}

export class PlantasService {
  static async listar(page: number = 1, size: number = 10, filters?: PlantaFiltersParams): Promise<BaseResponse<PagedPlantaResponse>> {
    let url = `${getAllPlantaKey()}?page=${page}&size=${size}`;

    // Agregar parámetros de filtro si existen
    if (filters) {
      if (filters.codigo) {
        url += `&codigo=${encodeURIComponent(filters.codigo)}`;
      }
      if (filters.estado !== undefined) {
        // Contrato: estado=1 (activos) o estado=0 (inactivos)
        url += `&estado=${filters.estado}`;
      }
      if (filters.fechaInicio) {
        url += `&fechaInicio=${encodeURIComponent(filters.fechaInicio)}`;
      }
      if (filters.fechaFin) {
        url += `&fechaFin=${encodeURIComponent(filters.fechaFin)}`;
      }
      if (filters.tipoFecha) {
        url += `&tipoFecha=${encodeURIComponent(filters.tipoFecha)}`;
      }
    }

    console.log("\uD83C\uDF10 URL enviada al backend (plantas):", url);

    const response = await api.get<any>(url);
    const raw = response.data;

    // Caso 1: Nueva estructura con data.items y metadatos sueltos
    if (raw?.data && Array.isArray(raw.data.items)) {
      const data = raw.data;
      return {
        succeeded: raw.succeeded,
        message: raw.message,
        errors: raw.errors,
        statusCode: raw.statusCode,
        data: {
          items: data.items as IPlantaResponse[],
          page: data.currentPage ?? data.page ?? page,
          totalPages: data.totalPages ?? 1,
          size: data.pageSize ?? size,
          total: data.totalCount ?? data.total ?? (data.items?.length ?? 0),
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
      } as BaseResponse<PagedPlantaResponse> as any;
    }

    // Caso 2: Estructura { data: IPlantaResponse[], pagination: {...} }
    if (raw?.data && Array.isArray(raw.data.data) && raw.data.pagination) {
      const dataArr = raw.data.data as IPlantaResponse[];
      const meta = raw.data.pagination;
      return {
        succeeded: raw.succeeded,
        message: raw.message,
        errors: raw.errors,
        statusCode: raw.statusCode,
        data: {
          items: dataArr,
          page: meta.currentPage ?? page,
          totalPages: meta.totalPages ?? 1,
          size: meta.pageSize ?? size,
          total: meta.totalCount ?? dataArr.length,
          meta,
        },
      } as BaseResponse<PagedPlantaResponse> as any;
    }

    // Caso 3: Legacy: raw.data es un array plano
    if (Array.isArray(raw?.data)) {
      const items: IPlantaResponse[] = raw.data as IPlantaResponse[];
      return {
        ...raw,
        data: {
          items,
          total: items.length,
          page,
          size,
          totalPages: 1,
        },
      } as BaseResponse<PagedPlantaResponse>;
    }

    // Retornar tal cual si ya cumple el contrato esperado
    return raw as BaseResponse<PagedPlantaResponse>;
  }

  static async obtenerPorId(url: any): Promise<BaseResponse<IPlantaResponse>> {
    const response = await api.get<BaseResponse<IPlantaResponse>>(url);
    return response.data;
  }

  static async crear(data: IPlantaSend): Promise<BaseResponse<IPlantaResponse>> {
    const response = await api.post<BaseResponse<IPlantaResponse>>(getAllPlantaKey(), data);
    return response.data;
  }

  static async actualizar(data: IPlantaUpdate): Promise<BaseResponse<IPlantaResponse>> {
    const response = await api.put<BaseResponse<IPlantaResponse>>(getAllPlantaKey(), data);
    return response.data;
  }

  static async eliminar(id: string, eliminadoPorId: string): Promise<BaseResponse<void>> {
    const response = await api.delete<BaseResponse<void>>(`${getAllPlantaKey()}?id=${id}&eliminadoPorId=${eliminadoPorId}`);
    return response.data;
  }
}
