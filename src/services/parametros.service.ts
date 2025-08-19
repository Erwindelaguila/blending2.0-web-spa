import { BaseResponse } from "@/interface";
import { IParametro, IParametroResponse, IParametroSend, IParametroUpdate, PagedParametroResponse } from "@/interface/admin/parametro";
import { api } from "@/lib/api";
import { getAllParametroKey } from "@/lib/constants/key-fetch";

export interface ParametroFiltersParams {
  codigo?: string;
  estado?: number;
  fechaInicio?: string;
  fechaFin?: string;
  tipoFecha?: string;
}

export class ParametrosService {

  static async listar(
    page: number = 1, 
    size: number = 10, 
    filters?: ParametroFiltersParams
  ): Promise<BaseResponse<PagedParametroResponse>> {
    // Construir URL similar a agregado/planta
    let url = `${getAllParametroKey}?page=${page}&size=${size}`;

    if (filters) {
      if (filters.codigo && filters.codigo.trim() !== "") {
        url += `&codigo=${encodeURIComponent(filters.codigo.trim())}`;
      }
      if (filters.estado !== undefined) {
        // Backend espera 'estado' (1|0)
        url += `&estado=${filters.estado}`;
      }
      if (filters.fechaInicio) {
        url += `&fechaInicio=${encodeURIComponent(filters.fechaInicio)}`;
      }
      if (filters.fechaFin) {
        url += `&fechaFin=${encodeURIComponent(filters.fechaFin)}`;
      }
      if (filters.tipoFecha && (filters.fechaInicio || filters.fechaFin)) {
        url += `&tipoFecha=${encodeURIComponent(filters.tipoFecha)}`;
      }
    }

  console.log("\uD83C\uDF10 URL enviada al backend (parametros):", url);
  const response = await api.get<any>(url);
    const raw = response.data;

    // Normalizar diferentes formas de respuesta del backend a PagedParametroResponse
    // Caso 1: Nueva estructura con data.items y metadatos sueltos (similar a agregado)
    if (raw?.data && Array.isArray(raw.data.items)) {
      const data = raw.data;
      return {
        succeeded: raw.succeeded,
        message: raw.message,
        errors: raw.errors,
        statusCode: raw.statusCode,
        data: {
          items: data.items as IParametroResponse[],
          page: data.currentPage ?? data.page ?? page,
          totalPages: data.totalPages ?? 1,
          size: data.pageSize ?? size,
          total: data.totalCount ?? data.total ?? (data.items?.length ?? 0),
          // Pasar metadatos crudos si existen
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
      } as BaseResponse<PagedParametroResponse> as any;
    }

    // Caso 2: Estructura { data: IParametroResponse[], pagination: {...} }
    if (raw?.data && Array.isArray(raw.data.data) && raw.data.pagination) {
      const dataArr = raw.data.data as IParametroResponse[];
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
      } as BaseResponse<PagedParametroResponse> as any;
    }

    // Caso 3: Legacy: raw.data es un array plano
    if (Array.isArray(raw?.data)) {
      const items: IParametroResponse[] = raw.data as IParametroResponse[];
      return {
        ...raw,
        data: {
          items,
          total: items.length,
          page,
          size,
          totalPages: 1,
        },
      } as BaseResponse<PagedParametroResponse>;
    }

    // Retornar tal cual para no romper en caso no identificado
    return raw as BaseResponse<PagedParametroResponse>;
  }

  static async obtenerPorId(url: any): Promise<BaseResponse<IParametro>> {
    const response = await api.get<BaseResponse<IParametro>>(url);
    return response.data; 
  }

  static async crear(
      data: IParametroSend
    ): Promise<BaseResponse<IParametro>> {
      const response = await api.post<BaseResponse<IParametro>>(
        getAllParametroKey,
        data
      );
      return response.data;
    }

    static async actualizar(
      data: IParametroUpdate
    ): Promise<BaseResponse<IParametro>> {
      const response = await api.put<BaseResponse<IParametro>>(
        getAllParametroKey,
        data
      );
      return response.data;
    }

    static async eliminar(id: string, eliminadoPorId: string): Promise<BaseResponse<void>> {
      const response = await api.delete<BaseResponse<void>>(`${getAllParametroKey}?id=${id}&eliminadoPorId=${eliminadoPorId}`);
      return response.data;
    }

}
